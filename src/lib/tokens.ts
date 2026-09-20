import { MAINNET_RPC } from './pythPush'

export interface MintInfo {
  address: string
  decimals: number
  supply: number
}

export async function fetchMintInfos(mints: string[], rpc = MAINNET_RPC): Promise<Record<string, MintInfo>> {
  const res = await fetch(rpc, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getMultipleAccounts',
      params: [mints, { encoding: 'jsonParsed' }],
    }),
  })
  const j = await res.json()
  if (j.error) throw new Error('RPC error: ' + j.error.message)
  const arr: { data?: { parsed?: { info?: { decimals: number; supply: string } } } }[] = j.result?.value ?? []
  const out: Record<string, MintInfo> = {}
  mints.forEach((m, i) => {
    const info = arr[i]?.data?.parsed?.info
    if (info) {
      out[m] = { address: m, decimals: info.decimals, supply: Number(info.supply) / 10 ** info.decimals }
    }
  })
  return out
}

export async function fetchMintInfo(mint: string, rpc = MAINNET_RPC): Promise<MintInfo | null> {
  const all = await fetchMintInfos([mint], rpc)
  return all[mint] ?? null
}