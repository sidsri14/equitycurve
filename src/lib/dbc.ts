import { Connection } from '@solana/web3.js'
import {
  DynamicBondingCurveClient,
  TokenDecimal,
  getPriceFromSqrtPrice,
  getSqrtPriceFromPrice,
} from '@meteora-ag/dynamic-bonding-curve-sdk'
import BN from 'bn.js'

export const MAINNET_RPC = 'https://api.mainnet-beta.solana.com'

let clientPromise: Promise<DynamicBondingCurveClient> | null = null

export function getDbcClient(rpc = MAINNET_RPC): Promise<DynamicBondingCurveClient> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const connection = new Connection(rpc, 'confirmed')
      return DynamicBondingCurveClient.create(connection, 'confirmed')
    })()
  }
  return clientPromise
}

export interface PoolView {
  address: string
  config: string
  creator: string
  baseMint: string
  baseReserve: bigint
  quoteReserve: bigint
  sqrtPrice: string
  baseDecimal: number
  quoteDecimal: number
  isMigrated: boolean
  hasSwap: boolean
  migrationProgress: number
  activationPoint: bigint
  price: number | null
}

export function toRawBN(v: unknown): string {
  if (v instanceof BN) return v.toString(10)
  if (typeof v === 'bigint') return v.toString(10)
  if (v && typeof v === 'object') {
    const bn = (v as { toNumber?: () => number }).toNumber
    if (bn) return (v as { toNumber: () => number }).toNumber().toString()
  }
  return String(v)
}

export function bnToNumber(v: unknown): number {
  if (v instanceof BN) return v.toNumber()
  if (typeof v === 'bigint') return Number(v)
  return Number(v)
}

export async function fetchPool(address: string, rpc = MAINNET_RPC): Promise<PoolView | null> {
  try {
    const client = await getDbcClient(rpc)
    const pool = await client.state.getPool(address)
    if (!pool) return null
    const s = pool.poolState as unknown as Record<string, unknown>
    const config = String(s.config)
    const cfg = await client.state.getPoolConfig(config)
    const quoteDecimal = cfg?.tokenDecimal ?? 6
    const baseDecimal = 6
    const sqrtPrice = toRawBN(s.sqrtPrice)
    let price: number | null = null
    try {
      const sp = new BN(sqrtPrice, 10)
      price = getPriceFromSqrtPrice(sp, baseDecimal as TokenDecimal, quoteDecimal as TokenDecimal).toNumber()
    } catch {
      price = null
    }
    return {
      address,
      config,
      creator: String(s.creator),
      baseMint: String(s.baseMint),
      baseReserve: BigInt(toRawBN(s.baseReserve)),
      quoteReserve: BigInt(toRawBN(s.quoteReserve)),
      sqrtPrice,
      baseDecimal,
      quoteDecimal,
      isMigrated: Boolean(s.isMigrated),
      hasSwap: Boolean(s.hasSwap),
      migrationProgress: Number(s.migrationProgress),
      activationPoint: BigInt(toRawBN(s.activationPoint)),
      price,
    }
  } catch (e) {
    throw e
  }
}

export function sqrtPriceFromUsdPrice(priceUsd: number): string {
  const sp = getSqrtPriceFromPrice(priceUsd.toFixed(6), 6, 6)
  return sp.toString(10)
}

export function usdPriceFromSqrtPrice(sqrtPrice: string, baseDecimal = 6, quoteDecimal = 6): number | null {
  try {
    const sp = new BN(sqrtPrice, 10)
    return getPriceFromSqrtPrice(sp, baseDecimal as TokenDecimal, quoteDecimal as TokenDecimal).toNumber()
  } catch {
    return null
  }
}

export function poolPriceDecimal(sqrtPrice: string | unknown): number | null {
  return usdPriceFromSqrtPrice(toRawBN(sqrtPrice))
}

export function isDbcPoolOwner(owner: string): boolean {
  return owner === 'dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN'
}

export const DEMO_POOLS = [
  { label: 'ASTROCOW / USDC', address: '4VUFLWqDhUwecAKCAWU6nsz8oEB9hmpYF5DBPzbPRyZB' },
  { label: 'scade / SOL', address: 'J5tLuDVr4RRNkbEybZ3n1iAnybiuPvGQuUeUKqVLbv4h' },
]