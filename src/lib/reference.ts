import { SPONSORED_FEEDS, EQUITY_FEEDS, equityFeedBySymbol, sponsoredFeed, preStockByMint, PRESTOCKS, resolveAssetLabel } from './feeds'
import { fetchPushFeedPrices } from './pythPush'

export const HERMES = 'https://hermes.pyth.network'
export const PRESTOCKS_URL = 'https://prestocks.com/api/prestocks'

export interface NetAssetValue {
  symbol: string
  price: number
  valuation: number
  supply: number
}

export interface ReferenceQuote {
  symbol: string
  price: number | null
  source: 'onchain-push' | 'hermes' | 'prestocks' | 'none'
  feedId?: string
  publishTime?: number
  marketOpen?: boolean
  error?: string
}

let prestocksCache: NetAssetValue[] = []
let prestocksFetchedAt = 0

export async function fetchPreStocks(): Promise<NetAssetValue[]> {
  const now = Date.now()
  if (prestocksCache.length && now - prestocksFetchedAt < 60_000) return prestocksCache
  const res = await fetch(PRESTOCKS_URL)
  if (!res.ok) throw new Error('PreStocks HTTP ' + res.status)
  const data: {
    symbol: string
    markPrice: number
    tokenPrice: number
    impliedValuation: number
    supply: number
    contract_address: string
  }[] = await res.json()
  prestocksCache = data.map((d) => ({
    symbol: d.symbol,
    price: d.markPrice ?? d.tokenPrice,
    valuation: d.impliedValuation,
    supply: d.supply,
  }))
  prestocksFetchedAt = now
  return prestocksCache
}

export function prestockBySymbol(symbol: string): NetAssetValue | undefined {
  return prestocksCache.find((p) => p.symbol.toUpperCase() === symbol.toUpperCase())
}

export function prestockByMintInfo(mint: string): NetAssetValue | undefined {
  const p = preStockByMint(mint)
  if (!p) return undefined
  return prestocksCache.find((n) => n.symbol.toUpperCase() === p.symbol.toUpperCase())
}

export async function hermesLatestPrice(feedId: string, apiKey?: string): Promise<number | null> {
  const url = `${HERMES}/v2/updates/price/latest?ids[]=${feedId}`
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (apiKey) headers['x-api-key'] = apiKey
  const res = await fetch(url, { headers })
  if (res.status === 401) return null
  if (!res.ok) return null
  const j = await res.json()
  const p = j?.parsed?.[0]?.price
  if (p && typeof p.price === 'string' && typeof p.expo === 'number') {
    return (Number(p.price) * 10 ** p.expo)
  }
  return null
}

export async function hermesMarketHours(symbol: string): Promise<{ marketOpen: boolean } | null> {
  try {
    const res = await fetch(`${HERMES}/v2/price_feeds?query=${encodeURIComponent(symbol)}`)
    if (!res.ok) return null
    const j = await res.json()
    const f = j.find((x: { attributes?: { display_symbol: string } }) => x?.attributes?.display_symbol === symbol.toUpperCase())
    if (!f) return null
    return { marketOpen: Boolean(f.market_hours?.is_open) }
  } catch {
    return null
  }
}

export interface ResolvedReference {
  quote: ReferenceQuote
  netAssetValue?: NetAssetValue
}

export async function resolveAssetReference(asset: string, opts?: { apiKey?: string; full?: boolean }): Promise<ResolvedReference> {
  const symbolUpper = asset.toUpperCase()

  const sponsored = sponsoredFeed(symbolUpper) ?? (symbolUpper.endsWith('/USD') ? sponsoredFeed(symbolUpper) : undefined)
  if (sponsored) {
    const quotes = await fetchPushFeedPrices([sponsored])
    const q = quotes.get(sponsored.alias)
    if (q) {
      return {
        quote: { symbol: sponsored.alias, price: q.price, source: 'onchain-push', feedId: sponsored.id, publishTime: q.publishTime },
      }
    }
  }

  const equity = equityFeedBySymbol(symbolUpper)
  if (equity && opts?.full) {
    const market = await hermesMarketHours(symbolUpper)
    const price = opts.apiKey ? await hermesLatestPrice(equity.id, opts.apiKey) : null
    return {
      quote: {
        symbol: symbolUpper,
        price,
        source: 'hermes',
        feedId: equity.id,
        marketOpen: market?.marketOpen,
        error: !opts.apiKey ? 'Hermes price needs API key; feed id available for pull' : price === null ? 'Hermes latest returned no parity' : undefined,
      },
    }
  }

  const nv = prestockBySymbol(symbolUpper) ?? prestockByMintInfo(asset)
  if (nv) {
    return { quote: { symbol: symbolUpper, price: nv.price, source: 'prestocks' }, netAssetValue: nv }
  }

  return { quote: { symbol: symbolUpper, price: null, source: 'none', error: `No reference source for ${symbolUpper}` } }
}

export async function resolveMintReference(mint: string): Promise<ResolvedReference> {
  const label = resolveAssetLabel(mint)
  if (label) return resolveAssetReference(label)
  return { quote: { symbol: mint, price: null, source: 'none' } }
}

export const allEquitySymbols = (): string[] => EQUITY_FEEDS.map((f) => f.displaySymbol)
export const allPreStockSymbols = (): string[] => PRESTOCKS.map((p) => p.symbol)
export const allSponsoredAliases = (): string[] => SPONSORED_FEEDS.map((f) => f.alias)