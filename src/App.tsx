import { useState } from 'react'
import styles from './app.module.css'
import { DEFAULTS } from './types/tip-state'
import { formatCurrency } from './utils/format'
import {
  isValidBillInput, normalizeBill,
  isValidTipInput, normalizeTip,
  isValidPeopleInput, normalizePeople,
} from './utils/validation'
import { useTipCalculator } from './hooks/useTipCalculator'
import { FieldInput } from './components/field-input/field-input'
import { ComputedField } from './components/computed-field/computed-field'
import { SplitSection } from './components/split-section/split-section'

function App() {
  const [bill, setBill] = useState<string>(DEFAULTS.bill)
  const [tip, setTip] = useState<string>(DEFAULTS.tip)
  const [people, setPeople] = useState<string>(DEFAULTS.people)
  const [splitOpen, setSplitOpen] = useState(false)

  const { tipAmount, total, tipPerPerson, totalPerPerson } = useTipCalculator(bill, tip, people)

  const handleReset = () => {
    setBill(DEFAULTS.bill)
    setTip(DEFAULTS.tip)
    setPeople(DEFAULTS.people)
    setSplitOpen(false)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles['page-title']}>Tip Calculator</h1>
      <div className={styles.card}>
        <div className={styles['split-row']}>
          <FieldInput
            label="Bill"
            value={bill}
            type="text"
            inputMode="decimal"
            onChange={e => { if (isValidBillInput(e.target.value)) setBill(e.target.value) }}
            onBlur={() => setBill(normalizeBill(bill))}
          />
          <FieldInput
            label="Tip"
            value={tip}
            type="number"
            min="0"
            max="100"
            onChange={e => { if (isValidTipInput(e.target.value)) setTip(e.target.value) }}
            onBlur={() => setTip(normalizeTip(tip))}
          />
        </div>

        <div className={styles['split-row']}>
          <ComputedField label="Tip amount" value={formatCurrency(tipAmount)} />
          <ComputedField label="Total" value={formatCurrency(total)} />
        </div>

        <div className={styles.divider} />

        <SplitSection label="Are you splitting the bill?" open={splitOpen} onToggle={() => setSplitOpen(o => !o)}>
          <FieldInput
            label="Number of people"
            value={people}
            type="number"
            min="2"
            max="50"
            onChange={e => { if (isValidPeopleInput(e.target.value)) setPeople(e.target.value) }}
            onBlur={() => setPeople(normalizePeople(people))}
          />
          <div className={styles['split-row']}>
            <ComputedField label="Tip per person" value={formatCurrency(tipPerPerson)} />
            <ComputedField label="Total per person" value={formatCurrency(totalPerPerson)} />
          </div>
        </SplitSection>

        <button className={styles['reset-btn']} onClick={handleReset}>Reset</button>
      </div>
    </div>
  )
}

export default App
