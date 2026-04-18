import { useState } from 'react'
import './App.css'

const DEFAULTS = { bill: '0.00', tip: '0', people: '2' }

function App() {
  const [bill, setBill] = useState<string>(DEFAULTS.bill)
  const [tip, setTip] = useState<string>(DEFAULTS.tip)
  const [people, setPeople] = useState<string>(DEFAULTS.people)
  const [splitOpen, setSplitOpen] = useState<boolean>(false)

  const billNum = parseFloat(bill) || 0
  const tipNum = parseFloat(tip) || 0
  const peopleNum = Math.max(1, parseInt(people) || 1)
  const tipAmount = billNum * tipNum / 100
  const total = billNum + tipAmount
  const tipPerPerson = tipAmount / peopleNum
  const totalPerPerson = total / peopleNum

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (/^\d*\.?\d{0,2}$/.test(v) && (parseFloat(v) || 0) <= 100000) setBill(v)
  }

  const handleBillBlur = () => {
    const n = Math.min(Math.max(parseFloat(bill) || 0, 0), 100000)
    setBill(n.toFixed(2))
  }

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (/^\d*$/.test(v) && (parseInt(v) || 0) <= 100) setTip(v)
  }

  const handleTipBlur = () => {
    const n = Math.min(Math.max(parseInt(tip) || 0, 0), 100)
    setTip(String(n))
  }

  const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (/^\d*$/.test(v) && (parseInt(v) || 0) <= 50) setPeople(v)
  }

  const handlePeopleBlur = () => {
    const n = Math.min(Math.max(parseInt(people) || 2, 2), 50)
    setPeople(String(n))
  }

  const handleReset = () => {
    setBill(DEFAULTS.bill)
    setTip(DEFAULTS.tip)
    setPeople(DEFAULTS.people)
    setSplitOpen(false)
  }

  return (
    <div className="page">
      <h1 className="page-title">Tip Calculator</h1>
      <div className="card">
        <div className="split-row">
          <div className="section">
            <div className="section-header">
              <span className="label">Bill</span>
            </div>
            <div className="field-row">
              <input
                className="field-input"
                type="text"
                inputMode="decimal"
                value={bill}
                onChange={handleBillChange}
                onBlur={handleBillBlur}
              />
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <span className="label">Tip</span>
            </div>
            <div className="field-row">
              <input
                className="field-input"
                type="number"
                min="0"
                max="100"
                value={tip}
                onChange={handleTipChange}
                onBlur={handleTipBlur}
              />
            </div>
          </div>
        </div>

        <div className="split-row">
          <div className="section">
            <div className="section-header">
              <span className="label">Tip amount</span>
            </div>
            <div className="field-row field-row--computed">
              <span className="computed">{fmt(tipAmount)}</span>
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <span className="label">Total</span>
            </div>
            <div className="field-row field-row--computed">
              <span className="computed">{fmt(total)}</span>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="split-section">
          <button className="split-toggle" onClick={() => setSplitOpen(o => !o)}>
            <span className="split-chevron">{splitOpen ? '∧' : '∨'}</span>
            <span className="split-title">Are you splitting the bill?</span>
          </button>

          {splitOpen && (
            <>
              <div className="section">
                <div className="section-header">
                  <span className="label">Number of people</span>
                </div>
                <div className="field-row">
                  <input
                    className="field-input"
                    type="number"
                    min="2"
                    max="50"
                    value={people}
                    onChange={handlePeopleChange}
                    onBlur={handlePeopleBlur}
                  />
                </div>
              </div>

              <div className="split-row">
                <div className="section">
                  <div className="section-header">
                    <span className="label">Tip per person</span>
                  </div>
                  <div className="field-row field-row--computed">
                    <span className="computed">{fmt(tipPerPerson)}</span>
                  </div>
                </div>

                <div className="section">
                  <div className="section-header">
                    <span className="label">Total per person</span>
                  </div>
                  <div className="field-row field-row--computed">
                    <span className="computed">{fmt(totalPerPerson)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>
    </div>
  )
}

export default App
