const PUSH_ORACLE_PROGRAM = 'pythWSnswVUd12oZpeFP8e9CVaEqJg25g1Vtc2biRsT'
const RPC = 'https://api.mainnet-beta.solana.com'

const FEEDS: Record<string, string> = {
  AAPL: '49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688',
  AAPLX: '978e6cc68a119ce066aa830017318563a9ed04ec3a0a6439010fc11296a58675',
  AAPLON: 'e6734de88a83d9d2fb33072adab319004700aefd069653aba30ba9e3cac056f2',
}

function bytesToHex(b: Buffer): string {
  return b.toString('hex')
}

function hexToBytes(s: string): Buffer {
  return Buffer.from(s.startsWith('0x') ? s.slice(2) : s, 'hex')
}

// Solana findProgramAddress for seeds [shard u16 LE, feedId]: PDA seed loop
function findPda(seeds: Buffer[], programId: string) {
  for (let bump = 255; bump >= 0; bump--) {
    const buf = Buffer.concat([...seeds, Buffer.from([bump])])
    const h = require('crypto').createHash('sha256').update(Buffer.concat([buf, hexToBytes(programId)])).digest()
    if (h[0] === 1) continue
    const address = h
    return { pubkey: address, bump }
  }
  throw new Error('unable to find PDA')
}

function getPriceFeedAccountAddress(shardId: number, priceFeedId: string): string {
  const shardBuffer = Buffer.alloc(2)
  shardBuffer.writeUInt16LE(shardId, 0)
  const { pubkey } = findPda([shardBuffer, hexToBytes(priceFeedId)], PUSH_ORACLE_PROGRAM)
  return base58(pubkey)
}

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function base58(b: Buffer): string {
  let s = ''
  let n = BigInt('0x' + b.toString('hex'))
  while (n > 0n) {
    s = B58[Number(n % 58n)] + s
    n = n / 58n
  }
  for (const byte of b) if (byte === 0) s = '1' + s; else break
  return s
}

async function rpc(method: string, params: any[]) {
  const r = await fetch(RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const j = await r.json()
  if (j.error) throw new Error(j.error.message)
  return j.result
}

function parsePriceData(data: Buffer) {
  const START = 44
  const SIZE = 3312
  const c = data.subarray(START, START + SIZE)
  const price = Number(c.readBigInt64LE(8))
  const conf = Number(c.readBigUInt64LE(24))
  const expo = c.readInt32LE(28)
  const status = c.readUInt32LE(16)
  const publish = Number(c.readBigInt64LE(32))
  return { price: price * 10 ** expo, conf: conf * 10 ** expo, status, publish, raw: price, expo }
}

async function main() {
  for (const shard of [0, 1, 2]) {
    for (const [name, id] of Object.entries(FEEDS)) {
      try {
        const account = getPriceFeedAccountAddress(shard, id)
        const acc = await rpc('getAccountInfo', [account, { encoding: 'base64' }])
        if (!acc?.value) {
          console.log(`shard=${shard} ${name}: no account ${account}`)
          continue
        }
        const data = Buffer.from(acc.value.data[0], 'base64')
        console.log(`shard=${shard} ${name}:`, JSON.stringify({ address: account, ...parsePriceData(data) }))
      } catch (e: any) {
        console.log(`shard=${shard} ${name}: ERR`, e.message)
      }
    }
  }
}

main().catch((e) => console.error('FATAL', e.message))