export const MAINNET_RPC = 'https://api.mainnet-beta.solana.com'

export interface PriceData {
  price: number
  conf: number
  exponent: number
  publishTime: number
  emaPrice: number
  emaConf: number
}

export interface RawPriceMessage extends PriceData {
  feedId: string
  prevPublishTime: number
  writeAuthority?: string
}

export async function getAccountInfoBase64(address: string, rpc = MAINNET_RPC): Promise<string | null> {
  const res = await fetch(rpc, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAccountInfo',
      params: [address, { encoding: 'base64' }],
    }),
  })
  const j = await res.json()
  if (j.error) throw new Error('RPC error: ' + j.error.message)
  const value = j.result?.value
  if (!value) return null
  return value.data[0]
}

export function parsePriceUpdateAccount(base64: string): RawPriceMessage | null {
  const d = Buffer.from(base64, 'base64')
  if (d.length < 133) return null
  const writeAuthority = d.subarray(8, 40).toString('hex')
  const feedId = d.subarray(41, 73).toString('hex')
  const price = Number(d.readBigInt64LE(73))
  const conf = Number(d.readBigUInt64LE(81))
  const exponent = d.readInt32LE(89)
  const publishTime = Number(d.readBigInt64LE(93))
  const prevPublishTime = Number(d.readBigInt64LE(101))
  const emaPrice = Number(d.readBigInt64LE(109))
  const emaConf = Number(d.readBigUInt64LE(117))
  return { feedId, price, conf, exponent, publishTime, prevPublishTime, emaPrice, emaConf, writeAuthority }
}

export interface LiveQuote {
  alias: string
  price: number
  conf: number
  publishTime: number
  ageSeconds: number
  isLive: boolean
  feedId: string
}

export async function fetchPushFeedPrices(
  feeds: { alias: string; id: string; address: string }[],
  now: number = Date.now() / 1000,
  rpc = MAINNET_RPC,
): Promise<Map<string, LiveQuote>> {
  const res = await fetch(rpc, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getMultipleAccounts',
      params: [feeds.map((f) => f.address), { encoding: 'base64' }],
    }),
  })
  const j = await res.json()
  if (j.error) throw new Error('RPC error: ' + j.error.message)
  const arr: { data?: string[] }[] = j.result?.value ?? []
  const out = new Map<string, LiveQuote>()
  for (let i = 0; i < feeds.length; i++) {
    const f = feeds[i]
    const info = arr[i]
    if (!info?.data?.[0]) continue
    const parsed = parsePriceUpdateAccount(info.data[0])
    if (!parsed) continue
    const price = parsed.price * 10 ** parsed.exponent
    out.set(f.alias, {
      alias: f.alias,
      price,
      conf: parsed.conf * 10 ** parsed.exponent,
      publishTime: parsed.publishTime,
      ageSeconds: now - parsed.publishTime,
      isLive: now - parsed.publishTime < 5 * 60,
      feedId: f.id,
    })
  }
  return out
}