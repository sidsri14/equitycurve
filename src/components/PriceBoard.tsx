import { useMemo } from 'react'
import { SPONSORED_FEEDS } from '../lib/feeds'
import { fetchPushFeedPrices, type LiveQuote } from '../lib/pythPush'
import { usePolling, fmtUsd, timeAgo, fmtPct } from '../lib/hooks'

const GROUPS: Record<string, string[]> = {
  Core: ['SOL/USD', 'BTC/USD', 'ETH/USD', 'USDC/USD', 'USDT/USD'],
  LSTs: ['MSOL/USD', 'BSOL/USD', 'SSOL/SOL', 'JUPSOL/SOL.RR', 'INF/SOL'],
  Metals: ['XAU/USD', 'XAG/USD'],
  FX: ['EUR/USD', 'GBP/USD', 'AUD/USD'],
  Equities: ['INDEX.FORD/USD', 'INDEX.GLXY/USD'],
  DeFi: ['JUP/USD', 'JLP/USD', 'PYTH/USD', 'ORCA/USD', 'MNDE/USD'],
  RWAs: ['NAV.USTB/USD', 'NAV.USCC/USD', 'WTIZ5/USD', 'WTIX5/USD', 'ACRED/USD', 'PST/USDC.RR'],
}

export default function PriceBoard() {
  const { data, error, loading } = usePolling(() => fetchPushFeedPrices(SPONSORED_FEEDS), 15_000)

  const quotes: Map<string, LiveQuote> = data ?? new Map()
  const liveCount = useMemo(() => [...quotes.values()].filter((q) => q.isLive).length, [quotes])

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid cols-4">
        <div className="metric">
          <div className="label">On-chain Pyth feeds</div>
          <div className="value">{SPONSORED_FEEDS.length}</div>
          <div className="meta">sponsored push accounts · Solana mainnet</div>
        </div>
        <div className="metric">
          <div className="label">Live (&lt;5 min)</div>
          <div className="value pos">{liveCount}</div>
          <div className="meta">reading raw receiver accounts</div>
        </div>
        <div className="metric">
          <div className="label">Source</div>
          <div className="value" style={{ fontSize: 16 }}>
            rec5EKMGg…
          </div>
          <div className="meta">Pyth Solana receiver program</div>
        </div>
        <div className="metric">
          <div className="label">Zero-key proof</div>
          <div className="value" style={{ fontSize: 16 }}>
            raw JSON-RPC
          </div>
          <div className="meta">no Hermes key required</div>
        </div>
      </div>

      {error && <div className="err-box">RPC error: {error}</div>}

      <div className="panel">
        <h2>Pyth push-feed accounts · live on-chain</h2>
        <p className="sub">
          Parsed directly from each shard-0 receiver account (134-byte <span className="mono">priceUpdateV2</span> layout). This is the
          zero-key anchor layer EquityCurve prices every tokenized-stock pool against.
        </p>
        {loading && <div className="small">Loading feeds…</div>}
        <div className="grid" style={{ gap: 18 }}>
          {Object.entries(GROUPS).map(([group, aliases]) => {
            const feeds = SPONSORED_FEEDS.filter((f) => aliases.includes(f.alias))
            if (!feeds.length) return null
            return (
              <div key={group}>
                <div className="small" style={{ textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8, fontWeight: 600 }}>
                  {group}
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Feed</th>
                      <th style={{ textAlign: 'right' }}>Price</th>
                      <th style={{ textAlign: 'right' }}>Confidence</th>
                      <th style={{ textAlign: 'right' }}>Published</th>
                      <th style={{ textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeds.map((f) => {
                      const q = quotes.get(f.alias)
                      return (
                        <tr key={f.alias}>
                          <td style={{ fontWeight: 600 }}>{f.alias}</td>
                          <td className="num" style={{ textAlign: 'right', fontWeight: 600 }}>
                            {q ? fmtUsd(q.price) : '—'}
                          </td>
                          <td className="num small" style={{ textAlign: 'right' }}>
                            {q ? '±' + fmtUsd(q.conf) + ` (${fmtPct((q.conf / q.price) * 100, 3)})` : '—'}
                          </td>
                          <td className="small" style={{ textAlign: 'right' }}>
                            {q ? timeAgo(q.publishTime) : '—'}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {q ? (
                              q.isLive ? (
                                <span className="badge live">
                                  <span className="dot pulse" /> live
                                </span>
                              ) : (
                                <span className="badge stale">
                                  <span className="dot" /> stale
                                </span>
                              )
                            ) : (
                              <span className="badge">no acct</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}