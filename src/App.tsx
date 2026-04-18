import { useState } from 'react'
import './App.css'

function App() {
  const [bill, setBill] = useState<string>('321')
  const [tip, setTip] = useState<string>('10')

  const billNum = parseFloat(bill) || 0
  const tipNum = parseFloat(tip) || 0
  const tipAmount = billNum * tipNum / 100
  const total = billNum + tipAmount

  const fmt = (n: number) =>
    n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="page">
      <div className="card">
        <div className="section">
          <div className="section-header">
            <span className="label">Bill <span className="info-icon">ⓘ</span></span>
            <span className="dots">···</span>
          </div>
          <div className="field-row">
            <input
              className="field-input"
              type="number"
              value={bill}
              onChange={e => setBill(e.target.value)}
            />
            <span className="unit">PLN <span className="chevron">⌄</span></span>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <span className="label">Tip</span>
            <div className="header-right">
              <span className="pin">⚲</span>
              <span className="dots">···</span>
            </div>
          </div>
          <div className="field-row">
            <input
              className="field-input"
              type="number"
              value={tip}
              onChange={e => setTip(e.target.value)}
            />
            <span className="unit unit-percent">%</span>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <span className="label">Tip amount</span>
            <span className="dots">···</span>
          </div>
          <div className="field-row field-row--computed">
            <span className="computed">{fmt(tipAmount)}</span>
            <span className="unit">PLN <span className="chevron">⌄</span></span>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <span className="label">Total</span>
            <span className="dots">···</span>
          </div>
          <div className="field-row field-row--computed">
            <span className="computed">{fmt(total)}</span>
            <span className="unit">PLN <span className="chevron">⌄</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
