# EquityCurve — CWF Meteora DBC Side-Track Submission Text

## One-liner (140-char friendly)
Pyth-anchored tokenized-stock launches on Meteora's Dynamic Bonding Curve.

## Short description (200 words max)
EquityCurve makes Meteora's Dynamic Bonding Curve the launch mechanism for tokenized
stocks. A Curve Studio pins a DBC's start price to the oracle fair value (live Pyth
reference quote), generates the full DBC ConfigParameters via
buildCurveWithCustomSqrtPrices, and exposes fee/config for equity-like assets. A
Fair-Value Monitor reads real DBC virtual pools straight from the
dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN program, derives spot price from the on-chain
sqrt price, converts to USD with the on-chain SOL/USD push feed, and shows premium/
discount vs the Pyth reference plus migration progress. Uses the official
@meteora-ag/dynamic-bonding-curve-sdk against live mainnet pools (ASTROCOW/USDC,
scade/SOL) — no testnet, no mocks. Price layer is Pyth-native throughout: 46 on-chain
push feeds decoded from raw account bytes (zero RPC key), Hermes equity feed IDs, and a
PreStocks keyless fallback.

## Long description / "What others can build"
Issuers get an oracle-fair launch for any asset class on DBC; any Pyth feed can be mapped
to a curve config; the Fair-Value Monitor is a reusable mainnet lens over DBC virtual
pools for portfolio/observer tools.

## Track
Best Use of Meteora's Dynamic Bonding Curve (CWF side-track, $20K pool).

## Repo link
https://github.com/sidsri14/equitycurve

## Live demo
https://equitycurve.vercel.app — (Curve Studio + Fair-Value Monitor tabs)

## Demo video
docs/frames/equitycurve-meteora-demo.mp4 — 45.6s, 1920×1080, in repo (proof walkthrough:
fair-value monitor → on-chain Pyth → curve studio → PreStocks keyless path)

## Deck
docs/EquityCurve-MeteoraDBC-Deck.pdf