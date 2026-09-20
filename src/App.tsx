import { useState } from 'react'
import PriceBoard from './components/PriceBoard'
import PoolMonitor from './components/PoolMonitor'
import CurveStudio from './components/CurveStudio'
import PreStocksBoard from './components/PreStocksBoard'

type Tab = 'monitor' | 'priceboard' | 'studio' | 'prestocks'

const TABS: { id: Tab; label: string }[] = [
  { id: 'monitor', label: 'Fair-Value Monitor' },
  { id: 'priceboard', label: 'On-chain Pyth Prices' },
  { id: 'studio', label: 'Curve Studio' },
  { id: 'prestocks', label: 'PreStocks' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('monitor')

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark">EC</div>
          <div>
            <h1>EquityCurve</h1>
            <p>Pyth-anchored tokenized-stock launches on Meteora DBC</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge live">
            <span className="dot pulse" /> mainnet live
          </span>
          <span className="badge">Meteora DBC</span>
          <span className="badge">Pyth push feeds</span>
          <span className="badge">STOCKLANA</span>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'monitor' && <PoolMonitor />}
      {tab === 'priceboard' && <PriceBoard />}
      {tab === 'studio' && <CurveStudio />}
      {tab === 'prestocks' && <PreStocksBoard />}

      <div className="footer">
        <strong>EquityCurve</strong> — a STOCKLANA entry. Live Pyth prices are parsed from the sponsored shard-0 push-feed accounts
        (program <span className="mono">rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ</span>) via raw Solana JSON-RPC with no API key. Pool
        state comes from the Meteora DBC program (<span className="mono">dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN</span>). The
        fair-value lens converts pool quote/ base to USD using the on-chain SOL/USD, USDC, or USDT feed, then compares to the Pyth
        reference for the base asset. Curve Studio pins the launch curve start price to the oracle fair value using
        <span className="mono"> buildCurveWithCustomSqrtPrices</span>.
      </div>
    </div>
  )
}