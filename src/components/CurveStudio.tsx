import { useMemo, useState } from 'react'
import {
  ActivationType,
  TokenType,
  TokenDecimal,
  TokenAuthorityOption,
  BaseFeeMode,
  CollectFeeMode,
  MigrationOption,
  MigrationFeeOption,
  buildCurveWithCustomSqrtPrices,
  getSqrtPriceFromPrice,
} from '@meteora-ag/dynamic-bonding-curve-sdk'
import { equityFeedBySymbol, sponsoredFeed } from '../lib/feeds'
import { resolveAssetReference, fetchPreStocks, hermesLatestPrice, hermesMarketHours } from '../lib/reference'
import { fetchPushFeedPrices } from '../lib/pythPush'
import { fmtUsd, fmtNum, usePolling } from '../lib/hooks'

interface QuoteRow {
  symbol: string
  kind: 'equity' | 'xstock' | 'prestocks' | 'onchain'
  price: number | null
  source: string
  open?: boolean
  note?: string
}

export default function CurveStudio() {
  const [ticker, setTicker] = useState('AAPL')
  const [apiKey, setApiKey] = useState('')
  const [decimals, setDecimals] = useState(6)
  const [supply, setSupply] = useState(1_000_000_000)
  const [startPrice, setStartPrice] = useState(310)
  const [targetPrice, setTargetPrice] = useState(620)
  const [feeBps, setFeeBps] = useState(200)
  const [migFeeBps, setMigFeeBps] = useState(100)
  const [creatorPct, setCreatorPct] = useState(100)

  const qrows = usePolling(loadQuotes, 60_000, [apiKey])

  const config = useMemo(() => tryBuildCurve({
    decimals, supply, startPrice, targetPrice, feeBps, migFeeBps, creatorPct,
  }), [decimals, supply, startPrice, targetPrice, feeBps, migFeeBps, creatorPct])

  async function loadQuotes(): Promise<QuoteRow[]> {
    const rows: QuoteRow[] = []
    await fetchPreStocks().catch(() => [])
    const eq = equityFeedBySymbol(ticker)
    if (eq) {
      const market = await hermesMarketHours(ticker).catch(() => null)
      rows.push({
        symbol: ticker,
        kind: 'equity',
        price: apiKey ? await hermesLatestPrice(eq.id, apiKey) : null,
        source: 'Equity.US.' + ticker + '/USD',
        open: market?.marketOpen,
        note: apiKey ? undefined : 'Hermes latest needs an API key — enter one above',
      })
    }
    const sp = sponsoredFeed(`${ticker}/USD`)
    if (sp) {
      const q = await fetchPushFeedPrices([sp])
      rows.push({ symbol: sp.alias, kind: 'onchain', price: q.get(sp.alias)?.price ?? null, source: 'on-chain push feed account' })
    }
    const resolved = await resolveAssetReference(ticker)
    if (resolved.quote.source === 'prestocks' && resolved.quote.price != null) {
      rows.push({ symbol: ticker, kind: 'prestocks', price: resolved.quote.price, source: 'PreStocks REST' })
    }
    return rows
  }

  function applyReference(p: number) {
    setStartPrice(p)
    if (targetPrice <= p) setTargetPrice(p * 2)
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid cols-3" style={{ gap: 16 }}>
        <div className="metric">
          <div className="label">Equity feeds on Pyth (17) + sponsored on-chain (46)</div>
          <div className="value" style={{ fontSize: 18 }}>{qrows.data?.length ?? 0} references shown</div>
          <div className="meta">feed-list is public · Hermes latest needs key</div>
        </div>
        <div className="metric">
          <div className="label">Curve anchor model</div>
          <div className="value" style={{ fontSize: 18 }}>
            price&rarr;sqrt
          </div>
          <div className="meta">start sqrt price pinned to oracle fair value</div>
        </div>
        <div className="metric">
          <div className="label">Curve status</div>
          <div className="value" style={{ fontSize: 18 }}>
            {config.ok ? <span className="pos">valid</span> : <span className="neg">{config.error ? 'invalid' : 'ok'}</span>}
          </div>
          <div className="meta">{config.ok ? `${config.out.curve.length} liquidity segments` : (config.error ?? '')}</div>
        </div>
      </div>

      <div className="grid cols-2" style={{ gap: 16 }}>
        <div className="panel">
          <h2>Reference feed</h2>
          <p className="sub">Ticker to anchor the launch curve to (Pyth equity feed / sponsor / PreStocks)</p>
          <div className="row">
            <div className="field" style={{ flex: 1 }}>
              <label>Ticker</label>
              <input value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} placeholder="AAPL" />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Hermes API key (optional)</label>
              <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-…" style={{ fontFamily: 'monospace' }} />
            </div>
          </div>
          {(qrows.data ?? []).map((r) => (
            <div className="kv" key={r.symbol + r.kind}>
              <span className="k">
                {r.symbol}{' '}
                <span className={`chip ${r.kind === 'onchain' ? 'pyth' : r.kind === 'prestocks' ? 'pre' : r.kind === 'equity' ? 'pyth' : 'warn'}`}>
                  {(r.open === false ? 'closed · ' : '') + r.kind}
                </span>
              </span>
              <span className="v">
                {r.price != null ? fmtUsd(r.price) : '—'}
                {r.note ? <div className="small">{r.note}</div> : null}
                {r.source ? <div className="small">{r.source}</div> : null}
              </span>
            </div>
          ))}
          {!qrows.data?.length && <div className="small">Loading references…</div>}
          {qrows.data?.length ? (
            <button
              className="btn ghost"
              style={{ marginTop: 10 }}
              onClick={() => {
                const usable = (qrows.data ?? []).find((r) => r.price != null)
                if (usable && usable.price != null) applyReference(usable.price)
              }}
            >
              Anchor start price to {qrows.data.find((r) => r.price != null)?.price != null ? fmtUsd(qrows.data.find((r) => r.price != null)!.price!) : 'reference'}
            </button>
          ) : null}
        </div>

        <div className="panel">
          <h2>Curve parameters</h2>
          <p className="sub">Equity launch configuration — output is DBC ConfigParameters</p>
          <div className="grid cols-2" style={{ gap: 12 }}>
            <div className="field">
              <label>Token decimals</label>
              <select value={decimals} onChange={(e) => setDecimals(Number(e.target.value))}>
                {[6, 7, 8, 9].map((d) => (
                  <option key={d} value={d}>1e{d}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Total supply</label>
              <input type="number" value={supply} onChange={(e) => setSupply(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Start price (Pyth fair value, {fmtUsd(startPrice)})</label>
              <input type="number" step="0.01" value={startPrice} onChange={(e) => setStartPrice(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Migration price ({fmtUsd(targetPrice)})</label>
              <input type="number" step="0.01" value={targetPrice} onChange={(e) => setTargetPrice(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Base fee (bps)</label>
              <input type="number" value={feeBps} onChange={(e) => setFeeBps(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Migration fee (bps)</label>
              <select value={migFeeBps} onChange={(e) => setMigFeeBps(Number(e.target.value))}>
                {[25, 30, 100, 200, 400, 600].map((b) => (
                  <option key={b} value={b}>
                    {b} bps
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Creator liquidity %</label>
              <input type="number" min="1" max="100" value={creatorPct} onChange={(e) => setCreatorPct(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Initial market cap</label>
              <input value={fmtNum(supply * 0.000001, 0)} disabled className="mono" />
            </div>
          </div>
          <div className="info-box" style={{ marginTop: 6 }}>
            Start sqrt price is pinned so the first trade prints the base token at the Pyth fair value, then the curve climbs to the
            migration price. This is the "Pyth-anchored equity launch" mechanic.
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Generated ConfigParameters</h2>
        <p className="sub">Feed these into <span className="mono">buildCurveWithCustomSqrtPrices → createConfig → createPoolWithFirstBuy</span></p>
        {config.ok ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <table>
                <tbody>
                  <tr><td>sqrtStartPrice</td><td className="num">{config.out.sqrtStartPrice.toString()}</td></tr>
                  <tr><td>migration sqrt price</td><td className="num">{config.out.curve[config.out.curve.length - 1]?.sqrtPrice?.toString?.() ?? '—'}</td></tr>
                  <tr><td>migrationQuoteThreshold</td><td className="num">{(config.out.migrationQuoteThreshold?.toString?.() ?? '')}</td></tr>
                  <tr><td>tokenSupply</td><td className="num">{config.out.tokenSupply?.toString?.() ?? '—'}</td></tr>
                  <tr><td>curve segments</td><td className="num">{config.out.curve.length}</td></tr>
                  <tr><td>creator trading fee %</td><td className="num">{config.out.creatorTradingFeePercentage?.toString?.() ?? '—'}</td></tr>
                  <tr><td>migrationFeeOption</td><td className="num">{config.out.migrationFeeOption?.toString?.() ?? '—'}</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <label>Segment sqrt prices</label>
              <div className="scroll-y" style={{ maxHeight: 180, border: '1px solid var(--border)', borderRadius: 8, padding: 6 }}>
                {config.out.curve.map((c, i) => (
                  <div key={i} className="small mono" style={{ padding: '2px 4px' }}>
                    #{i} {c.sqrtPrice?.toString?.() ?? ''} · liq {c.liquidity?.toString?.() ?? ''}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="err-box">
            {config.error ?? 'Curve params invalid — adjust liquidity % or price band.'}
          </div>
        )}
      </div>
    </div>
  )
}

function tryBuildCurve(a: {
  decimals: number
  supply: number
  startPrice: number
  targetPrice: number
  feeBps: number
  migFeeBps: number
  creatorPct: number
}): { ok: true; out: ReturnType<typeof buildCurveWithCustomSqrtPrices> } | { ok: false; error: string } {
  try {
    const qDec = 9
    const start = getSqrtPriceFromPrice(a.startPrice.toFixed(6), a.decimals, qDec)
    const target = getSqrtPriceFromPrice(a.targetPrice.toFixed(6), a.decimals, qDec)
    const out = buildCurveWithCustomSqrtPrices({
      token: {
        tokenType: TokenType.SPLToken,
        tokenBaseDecimal: a.decimals as TokenDecimal,
        tokenQuoteDecimal: qDec as TokenDecimal,
        tokenAuthorityOption: TokenAuthorityOption.CreatorUpdateAuthority,
        totalTokenSupply: a.supply,
        leftover: 0,
      },
      fee: {
        baseFeeParams: {
          baseFeeMode: BaseFeeMode.FeeSchedulerLinear,
          feeSchedulerParam: { startingFeeBps: a.feeBps, endingFeeBps: a.feeBps * 0.5, numberOfPeriod: 10, totalDuration: 3600 },
        },
        dynamicFeeEnabled: false,
        collectFeeMode: CollectFeeMode.QuoteToken,
        creatorTradingFeePercentage: 0,
        poolCreationFee: 0,
        enableFirstSwapWithMinFee: false,
      },
      migration: {
        migrationOption: MigrationOption.MET_DAMM_V2,
        migrationFeeOption: a.migFeeBps === 25 ? MigrationFeeOption.FixedBps25 : a.migFeeBps === 30 ? MigrationFeeOption.FixedBps30 : a.migFeeBps === 200 ? MigrationFeeOption.FixedBps200 : a.migFeeBps === 400 ? MigrationFeeOption.FixedBps400 : a.migFeeBps === 600 ? MigrationFeeOption.FixedBps600 : MigrationFeeOption.FixedBps100,
        migrationFee: { feePercentage: 1, creatorFeePercentage: 0 },
      },
      liquidityDistribution: {
        partnerPermanentLockedLiquidityPercentage: 0,
        partnerLiquidityPercentage: 0,
        creatorPermanentLockedLiquidityPercentage: 0,
        creatorLiquidityPercentage: a.creatorPct,
      },
      lockedVesting: { totalLockedVestingAmount: 0, numberOfVestingPeriod: 0, cliffUnlockAmount: 0, totalVestingDuration: 0, cliffDurationFromMigrationTime: 0 },
      activationType: ActivationType.Timestamp,
      sqrtPrices: [start, target],
    })
    return { ok: true, out }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}