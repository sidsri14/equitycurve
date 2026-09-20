# EquityCurve

**Pyth-anchored tokenized-stock launches on Meteora DBC.**

EquityCurve is tooling that makes issuing and monitoring tokenized stocks on Solana better than a brokerage app. It targets three Stocklana bounty tracks from a single live mainnet app:

- **Best Use of Meteora DBC** ($5,000) — a Curve Studio that pins a Dynamic Bonding Curve's start price to the oracle fair value, plus a Fair-Value Monitor that reads real DBC virtual pools on mainnet and measures pool-premium vs the Pyth reference.
- **Best use of Pyth market data** (Pyth Pro) — all fair-value math runs on Pyth data: on-chain sponsored push-feeds (zero key), Hermes equity feed IDs + market hours, and xStock feeds.
- **Best Use of PreStocks** ($10,000) — a dedicated PreStocks surface (live valuations for ANDURIL, ANTHROPIC, FIGUREAI, KALSHI, NEURALINK, OPENAI, POLYMARKET, SPACEX) used as the reference fair value for pre-IPO token pools.

## Why Pyth data is central

Every number EquityCurve shows traces to a live Pyth data source:

1. **On-chain push feeds (zero-key, primary).** All 46 sponsored shard-0 receiver accounts on Solana mainnet are parsed directly from raw account bytes. The 134-byte `priceUpdateV2` layout is decoded (discriminator, write authority, feed id, price i64, conf, exponent, publish times, ema, posted slot) via `fetchPushFeedPrices` — no API key, no external dependency. This is the anchor layer that prices every pool.
2. **Hermes equity feeds.** The public feed-list endpoint yields the 17 `Equity.US.*/USD` feed IDs (AAPL, TSLA, MSFT, ...) plus xStock feeds (`Crypto.AAAPLX/USD`, `Crypto.AAPLON/USD`) and market-hours, ready for pull-based updates with a Pyth Pro key.
3. **PreStocks REST** — keyless valuation fallback for pre-IPO tokens.

## Fair-Value Monitor

Enter any DBC virtual pool (demo pools: ASTROCOW/USDC, scade/SOL): reads the live pool state straight from the `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN` program, derives the spot price from the on-chain sqrt price, converts quote/base to USD using the on-chain SOL/USD push feed, then shows **premium/discount vs the Pyth reference** for the base asset plus migration progress.

## Curve Studio

The equity-launch mechanic: enter a ticker (AAPL, ...), get the live reference quote, pick supply/decimals/fees, and generate a **full DBC ConfigParameters** via `buildCurveWithCustomSqrtPrices` with the start sqrt price pinned so the first swap prints the token at the Pyth fair value, climbing to the migration price. Judge-visible as: original curve / fee configuration tuned for equity-like assets.

## Stack

- Vite + React + TypeScript
- `@meteora-ag/dynamic-bonding-curve-sdk` (mainnet read via `DynamicBondingCurveClient`)
- Raw Solana JSON-RPC (`getMultipleAccounts`) — no RPC key
- `pnpm` overrides pin `rpc-websockets@9.3.10` and `@solana/web3.js@1.99.0` (fixes the SDK `Class extends value undefined` loader bug)

## Run

```bash
pnpm install
pnpm dev      # dev server on :5173
pnpm build    # typecheck + production build
```

## Live demo

Vercel: `https://equitycurve.vercel.app` (deploy from this repo)

Track notes for judges:
1. **Meteora DBC** — real mainnet pool reads + original curve config generation anchored to Pyth (Curve Studio / Fair-Value Monitor tabs).
2. **Pyth** — on-chain push-feed parsing as the core price layer, equity + xStock feed IDs, app is live.
3. **PreStocks** — dedicated surface; no non-PreStocks pre-IPO tokens in that surface (per bounty eligibility rule).