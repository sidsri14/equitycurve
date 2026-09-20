import { type NetAssetValue } from '../lib/reference'
import { usePolling, fmtUsd, fmtCompact, shortAddr } from '../lib/hooks'

export interface PreStockRow extends NetAssetValue {
  tokenPrice: number | null
  contractAddress: string | null
}

async function loadPreStocks(): Promise<PreStockRow[]> {
  const res = await fetch('https://prestocks.com/api/prestocks')
  if (!res.ok) throw new Error('PreStocks HTTP ' + res.status)
  const data: {
    symbol: string
    markPrice: number
    tokenPrice: number
    impliedValuation: number
    supply: number
    contract_address: string
  }[] = await res.json()
  return data.map((d) => ({
    symbol: d.symbol,
    price: d.markPrice ?? d.tokenPrice,
    valuation: d.impliedValuation,
    supply: d.supply,
    tokenPrice: d.tokenPrice,
    contractAddress: d.contract_address,
  }))
}

export default function PreStocksBoard() {
  const { data, error } = usePolling(loadPreStocks, 60_000)

  const rows = (data ?? []).filter((r) => r.contractAddress && r.symbol)
  const maxMc = rows.length ? Math.max(...rows.map((r) => r.price * r.supply)) : 0
  const maxPrice = rows.length ? Math.max(...rows.map((r) => r.price)) : 0

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid cols-4">
        <div className="metric">
          <div className="label">PreStocks tokens</div>
          <div className="value">{rows.length || '…'}</div>
          <div className="meta">keyless REST · prestocks.com/api/prestocks</div>
        </div>
        <div className="metric">
          <div className="label">Largest market cap</div>
          <div className="value">{fmtCompact(maxMc || null)}</div>
          <div className="meta">{maxMc ? rows.sort((a, b) => b.price * b.supply - a.price * a.supply)[0].symbol : '—'}</div>
        </div>
        <div className="metric">
          <div className="label">Highest price</div>
          <div className="value">{fmtUsd(maxPrice || null)}</div>
          <div className="meta">pre-IPO token mark price</div>
        </div>
        <div className="metric">
          <div className="label">Track</div>
          <div className="value" style={{ fontSize: 15 }}>
            Best Use of PreStocks
          </div>
          <div className="meta">$10,000 · 1st $5k / 2nd $3k / 3rd $2k</div>
        </div>
      </div>

      {error && <div className="err-box">PreStocks API: {error}</div>}

      <div className="panel">
        <h2>Traded pre-IPO token valuations (live)</h2>
        <p className="sub">
          On-chain price discovery for private companies. EquityCurve anchors pre-IPO token pools against these reference prices — the
          same fair-value lens used for Pyth-anchored equity launches, applied to pre-IPO tokens.
        </p>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th style={{ textAlign: 'right' }}>Mark price</th>
              <th style={{ textAlign: 'right' }}>tokenPrice</th>
              <th style={{ textAlign: 'right' }}>Implied valuation</th>
              <th style={{ textAlign: 'right' }}>Supply</th>
              <th>Raw contract address</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.symbol}>
                <td style={{ fontWeight: 600 }}>{r.symbol}</td>
                <td className="num" style={{ textAlign: 'right', fontWeight: 600 }}>
                  {fmtUsd(r.price)}
                </td>
                <td className="num small" style={{ textAlign: 'right' }}>
                  {r.tokenPrice != null ? fmtUsd(r.tokenPrice) : '—'}
                </td>
                <td className="num" style={{ textAlign: 'right' }}>
                  {fmtUsd(r.valuation, 0)}
                </td>
                <td className="num small" style={{ textAlign: 'right' }}>
                  {fmtCompact(r.supply)}
                </td>
                <td className="small mono" style={{ color: 'var(--text-faint)' }}>
                  {shortAddr(r.contractAddress ?? '', 6)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}