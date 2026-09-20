const RPC = 'https://api.mainnet-beta.solana.com'
const PYTH_PROGRAM = 'FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH'

const WANT = /AAPL|AAPLX|AAPLON|NVDA|TSLA|MSFT|AMZN|GOOG|META|COIN|SPY|QQQ/i

async function rpc(method, params) {
  const r = await fetch(RPC, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const j = await r.json()
  if (j.error) throw new Error(j.error.message)
  return j.result
}

function b58str(buf) {
  const B = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let s = ''; let n = BigInt('0x' + buf.toString('hex'))
  while (n > 0n) { s = B[Number(n % 58n)] + s; n /= 58n }
  for (const b of buf) if (b === 0) s = '1' + s; else break
  return s
}

async function main() {
  const accs = await rpc('getProgramAccounts', [PYTH_PROGRAM, { encoding: 'base64' }])
  console.log('program accounts:', accs.length)
  const mappings = []; const products = []; const prices = []
  for (const a of accs) {
    const b = Buffer.from(a.account.data[0], 'base64')
    if (b.readUInt32LE(0) !== 0xa1b2c3d4) continue
    const type = b.readUInt32LE(8)
    if (type === 1) mappings.push({ pk: a.pubkey, data: b })
    else if (type === 2) products.push({ pk: a.pubkey, data: b })
    else if (type === 3) prices.push({ pk: a.pubkey, data: b })
  }
  console.log(`mappings=${mappings.length} products=${products.length} prices=${prices.length}`)

  // traverse mapping chain from FIRST mapping account
  const first = mappings[0]
  const productPubkeys = new Set()
  let cur = first
  for (let d = 0; d < 100 && cur; d++) {
    const num = cur.data.readUInt32LE(16)
    for (let i = 0; i < num; i++) {
      productPubkeys.add(b58str(cur.data.subarray(56 + i * 32, 56 + (i + 1) * 32)))
    }
    const next = b58str(cur.data.subarray(24, 56))
    if (next === '11111111111111111111111111111111') break
    cur = mappings.find((m) => m.pk === next)
  }
  console.log('distinct products via chain:', productPubkeys.size, ' starting at', first.pk)

  const byKey = new Map(products.map((p) => [p.pk, p.data]))
  const priceByKey = new Map(prices.map((p) => [p.pk, p.data]))
  const hits = []
  for (const pk of productPubkeys) {
    const d = byKey.get(pk)
    if (!d) continue
    const priceKey = b58str(d.subarray(16, 48))
    const sym = (() => {
      let off = 48; const seen = {}
      while (off < d.length - 1) {
        const kl = d.readUInt8(off); off++
        if (!kl) break
        const k = d.subarray(off, off + kl).toString('utf8'); off += kl
        const vl = d.readUInt8(off); off++
        const v = d.subarray(off, off + vl).toString('utf8'); off += vl
        seen[k] = v
      }
      return seen
    })()
    if (WANT.test(sym.symbol || '')) hits.push({ p: pk, ...sym, price: priceKey })
  }
  console.log('HITS:', JSON.stringify(hits, null, 1))

  for (const h of hits) {
    const pd = priceByKey.get(h.price)
    if (!pd) { console.log(h.symbol, 'no price data for', h.price); continue }
    const expo = pd.readInt32LE(20)
    const priceRaw = Number(pd.readBigInt64LE(208))
    const confRaw = Number(pd.readBigUInt64LE(216))
    const status = pd.readUInt32LE(224)
    const publishSlot = Number(pd.readBigUInt64LE(232))
    console.log(h.symbol, JSON.stringify({ addr: h.price, price: priceRaw * 10 ** expo, raw: priceRaw, expo, conf: confRaw * 10 ** expo, status, publishSlot }))
  }
}

main().catch((e) => { console.error('FATAL', e); process.exit(1) })