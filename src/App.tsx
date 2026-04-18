import { useState } from 'react'
import './App.css'

const DEFAULTS = { bill: '321', tip: '10', people: '2' }

function App() {
  const [bill, setBill] = useState<string>(DEFAULTS.bill)
  const [tip, setTip] = useState<string>(DEFAULTS.tip)
  const [people, setPeople] = useState<string>(DEFAULTS.people)
  const [splitOpen, setSplitOpen] = useState<boolean>(true)

  const billNum = parseFloat(bill) || 0
  const tipNum = parseFloat(tip) || 0
  const peopleNum = Math.max(1, parseInt(people) || 1)
  const tipAmount = billNum * tipNum / 100
  const total = billNum + tipAmount
  const tipPerPerson = tipAmount / peopleNum
  const totalPerPerson = total / peopleNum

  const fmt = (n: number) =>
    n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleReset = () => {
    setBill(DEFAULTS.bill)
    setTip(DEFAULTS.tip)
    setPeople(DEFAULTS.people)
    setSplitOpen(true)
  }

  return (
    <div className="page">
      <div className="card">
        <div className="split-row">
          <div className="section">
            <div className="section-header">
              <span className="label">Bill</span>
            </div>
            <div className="field-row">
              <input
                className="field-input"
                type="number"
                value={bill}
                onChange={e => setBill(e.target.value)}
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
                value={tip}
                onChange={e => setTip(e.target.value)}
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
                    min="1"
                    value={people}
                    onChange={e => setPeople(e.target.value)}
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
