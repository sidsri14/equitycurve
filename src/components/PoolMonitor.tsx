import { useState } from 'react'
import { fetchPool, getDbcClient, type PoolView, DEMO_POOLS } from '../lib/dbc'
import { fetchMintInfos, type MintInfo } from '../lib/tokens'
import { fetchPushFeedPrices, MAINNET_RPC } from '../lib/pythPush'
import { sponsoredFeed, resolveAssetLabel, USDC_MINT, USDT_MINT, SOL_MINT } from '../lib/feeds'
import { resolveAssetReference, prestockByMintInfo, fetchPreStocks, type ReferenceQuote } from '../lib/reference'
import { usePolling, fmtUsd, fmtNum, fmtCompact, fmtPct, shortAddr } from '../lib/hooks'
import { getPriceFromSqrtPrice } from '@meteora-ag/dynamic-bonding-curve-sdk'
import BN from 'bn.js'

interface LensResult {
  pool: PoolView
  base: MintInfo | null
  quote: MintInfo | null
  poolPriceQuote: number | null
  poolPriceUsd: number | null
  quoteUsd: number | null
  reference: ReferenceQuote | null
  premiumPct: number | null
  baseLabel: string | null
}

async function loadLens(poolAddress: string): Promise<LensResult> {
  const pool = await fetchPool(poolAddress)
  if (!pool) throw new Error('No DBC virtual pool at ' + poolAddress)

  const client = await getDbcClient()
  const cfg = await client.state.getPoolConfig(pool.config)
  const quoteMint = cfg?.quoteMint ? String(cfg.quoteMint) : ''

  const mints = await fetchMintInfos([pool.baseMint, quoteMint])
  const base = mints[pool.baseMint] ?? null
  const quote = mints[quoteMint] ?? null

  const baseDec = base?.decimals ?? pool.baseDecimal
  const quoteDec = quote?.decimals ?? pool.quoteDecimal

  type TDec = Parameters<typeof getPriceFromSqrtPrice>[1]
  let poolPriceQuote: number | null = null
  try {
    const sp = new BN(pool.sqrtPrice, 10)
    poolPriceQuote = getPriceFromSqrtPrice(sp, baseDec as TDec, quoteDec as TDec).toNumber()
  } catch {
    poolPriceQuote = null
  }

  let quoteUsd: number | null = null
  if (quoteMint === USDC_MINT || quoteMint === USDT_MINT) quoteUsd = 1
  else if (quoteMint === SOL_MINT) {
    const solFeed = sponsoredFeed('SOL/USD')
    if (solFeed) {
      const q = await fetchPushFeedPrices([solFeed])
      quoteUsd = q.get('SOL/USD')?.price ?? null
    }
  }

  const poolPriceUsd = poolPriceQuote !== null && quoteUsd !== null ? poolPriceQuote * quoteUsd : null

  let baseLabel = resolveAssetLabel(pool.baseMint)
  let reference: ReferenceQuote | null = null
  await fetchPreStocks().catch(() => [])
  if (baseLabel) {
    const resolved = await resolveAssetReference(baseLabel)
    if (resolved.quote.source !== 'none') reference = resolved.quote
  } else if (prestockByMintInfo(pool.baseMint)) {
    const resolved = await resolveAssetReference(prestockByMintInfo(pool.baseMint)!.symbol)
    reference = resolved.quote
    baseLabel = resolved.quote.symbol
  }

  let premiumPct: number | null = null
  if (poolPriceUsd !== null && reference?.price) {
    premiumPct = (poolPriceUsd / reference.price - 1) * 100
  }

  return { pool, base, quote, poolPriceQuote, poolPriceUsd, quoteUsd, reference, premiumPct, baseLabel }
}

function PremiumDial({ premiumPct }: { premiumPct: number | null }) {
  if (premiumPct === null) {
    return (
      <div className="metric" style={{ gridColumn: 'span 1' }}>
        <div className="label">Pool vs Pyth reference</div>
        <div className="premium-big" style={{ color: 'var(--text-dim)' }}>
          —
        </div>
        <div className="meta">no matching reference feed for base token</div>
      </div>
    )
  }
  const inBand = Math.abs(premiumPct) <= 1
  const color = inBand ? 'var(--up)' : premiumPct > 0 ? 'var(--warn)' : 'var(--accent)'
  const label = inBand ? 'FAIR' : premiumPct > 0 ? 'PREMIUM' : 'DISCOUNT'
  return (
    <div className="metric">
      <div className="label">Pool vs Pyth reference</div>
      <div className="premium-big" style={{ color }}>
        {fmtPct(premiumPct)}
      </div>
      <div className="meta">
        <span style={{ color, fontWeight: 700 }}>{label}</span> · pool implies{' '}
        {premiumPct > 0 ? 'above' : 'below'} the oracle fair value
      </div>
    </div>
  )
}

export default function PoolMonitor() {
  const [input, setInput] = useState(DEMO_POOLS[0].address)
  const [poolAddress, setPoolAddress] = useState(DEMO_POOLS[0].address)
  const { data, error, loading } = usePolling(() => loadLens(poolAddress), 20_000, [poolAddress])

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="panel">
        <h2>Fair-value lens</h2>
        <p className="sub">
          Reads a Meteora DBC virtual pool on mainnet, derives the spot price from the on-chain sqrt price, and measures the pool's
          implied USD price against the Pyth reference for the base asset. Premium/discount is the gap between market and oracle.
        </p>
        <div className="row">
          <div style={{ flex: 1, minWidth: 260 }}>
            <label>DBC virtual pool address</label>
            <input
              className="mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="dbcij3… pool account"
            />
          </div>
          <button className="btn" onClick={() => setPoolAddress(input.trim())} disabled={!input.trim()}>
            Load pool
          </button>
        </div>
        <div className="pill-row" style={{ marginTop: 12 }}>
          {DEMO_POOLS.map((p) => (
            <button
              key={p.address}
              className="chip"
              style={{ cursor: 'pointer', background: poolAddress === p.address ? 'var(--accent)' : undefined, color: poolAddress === p.address ? '#08101f' : undefined }}
              onClick={() => {
                setInput(p.address)
                setPoolAddress(p.address)
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="panel small">Reading pool state…</div>}
      {error && <div className="err-box">{error}</div>}

      {data && (
        <>
          <div className="grid cols-4">
            <div className="metric">
              <div className="label">Pool spot price</div>
              <div className="value">{data.poolPriceUsd !== null ? fmtUsd(data.poolPriceUsd) : '—'}</div>
              <div className="meta">
                {data.poolPriceQuote !== null ? `${fmtNum(data.poolPriceQuote, 8)} ${data.quote ? '' : 'quote'}/base` : 'sqrt price unavailable'}
              </div>
            </div>
            <PremiumDial premiumPct={data.premiumPct} />
            <div className="metric">
              <div className="label">Pyth reference</div>
              <div className="value">{data.reference?.price != null ? fmtUsd(data.reference.price) : '—'}</div>
              <div className="meta">
                {data.reference ? (
                  <>
                    <span className={`chip ${data.reference.source === 'onchain-push' ? 'pyth' : data.reference.source === 'prestocks' ? 'pre' : 'warn'}`}>
                      {data.reference.source}
                    </span>{' '}
                    {data.reference.symbol}
                  </>
                ) : (
                  'no reference mapped'
                )}
              </div>
            </div>
            <div className="metric">
              <div className="label">Migration progress</div>
              <div className="value">{data.pool.isMigrated ? 'Migrated' : `${data.pool.migrationProgress}%`}</div>
              <div className="meta">{data.pool.hasSwap ? 'trading enabled' : 'pre-activation'}</div>
            </div>
          </div>

          <div className="grid cols-2">
            <div className="panel">
              <h2>Pool state</h2>
              <p className="sub">Live account data, Meteora DBC program</p>
              <div className="kv">
                <span className="k">Pool</span>
                <span className="v mono">{shortAddr(data.pool.address, 6)}</span>
              </div>
              <div className="kv">
                <span className="k">Base mint</span>
                <span className="v mono">
                  {shortAddr(data.pool.baseMint, 6)} {data.baseLabel ? `· ${data.baseLabel}` : ''}
                </span>
              </div>
              <div className="kv">
                <span className="k">Base reserve</span>
                <span className="v">{data.base ? fmtCompact(data.base.supply) + ' supply' : '—'}</span>
              </div>
              <div className="kv">
                <span className="k">Quote reserve</span>
                <span className="v">{fmtNum(Number(data.pool.quoteReserve) / 10 ** (data.quote?.decimals ?? 6), 2)}</span>
              </div>
              <div className="kv">
                <span className="k">Base/quote decimals</span>
                <span className="v">
                  {data.base?.decimals ?? data.pool.baseDecimal} / {data.quote?.decimals ?? data.pool.quoteDecimal}
                </span>
              </div>
              <div className="kv">
                <span className="k">Sqrt price</span>
                <span className="v mono">{data.pool.sqrtPrice}</span>
              </div>
              <div className="kv">
                <span className="k">Config</span>
                <span className="v mono">{shortAddr(data.pool.config, 6)}</span>
              </div>
              <div className="kv">
                <span className="k">Creator</span>
                <span className="v mono">{shortAddr(data.pool.creator, 6)}</span>
              </div>
            </div>

            <div className="panel">
              <h2>Fair-value read</h2>
              <p className="sub">How the oracle lens is computed</p>
              <div className="bar" style={{ margin: '6px 0 14px' }}>
                <span style={{ width: `${Math.min(100, Math.max(0, data.pool.migrationProgress))}%` }} />
              </div>
              <div className="info-box" style={{ marginBottom: 14 }}>
                <strong>Formula.</strong> pool USD = price(base in quote) × quote/USD. Fair value = Pyth reference for base. Premium =
                (pool USD ÷ oracle) − 1. Quote/USD resolves from the on-chain SOL/USD, USDC, or USDT push feed.
              </div>
              <div className="kv">
                <span className="k">Quote asset / USD</span>
                <span className="v">{data.quoteUsd !== null ? fmtUsd(data.quoteUsd) : '—'}</span>
              </div>
              <div className="kv">
                <span className="k">Pool price (quote/base)</span>
                <span className="v">{data.poolPriceQuote !== null ? fmtNum(data.poolPriceQuote, 8) : '—'}</span>
              </div>
              <div className="kv">
                <span className="k">Pool price (USD)</span>
                <span className="v">{data.poolPriceUsd !== null ? fmtUsd(data.poolPriceUsd) : '—'}</span>
              </div>
              <div className="kv">
                <span className="k">Pyth reference</span>
                <span className="v">{data.reference?.price != null ? fmtUsd(data.reference.price) : '—'}</span>
              </div>
              <div className="kv">
                <span className="k">Premium / discount</span>
                <span className={`v ${data.premiumPct != null ? (data.premiumPct >= 0 ? 'pos' : 'neg') : ''}`}>{fmtPct(data.premiumPct)}</span>
              </div>
              <div className="small" style={{ marginTop: 12 }}>
                RPC: {shortAddr(MAINNET_RPC, 10)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}