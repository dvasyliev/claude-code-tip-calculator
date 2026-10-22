import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodType } from 'zod'
import styles from './app.module.css'
import { DEFAULTS } from './types/tip-state'
import { formatCurrency } from './utils/format'
import {
  tipFormSchema, type TipFormValues,
  billSchema, normalizeBill,
  tipSchema, normalizeTip,
  peopleSchema, normalizePeople,
} from './utils/validation'
import { useTipCalculator } from './hooks/useTipCalculator'
import { FieldInput } from './components/field-input/field-input'
import { ComputedField } from './components/computed-field/computed-field'
import { SplitSection } from './components/split-section/split-section'

// Only forwards keystrokes that leave the field valid, so invalid characters never appear.
function acceptIfValid(schema: ZodType, onChange: (v: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (schema.safeParse(e.target.value).success) onChange(e.target.value)
  }
}

function App() {
  const { control, reset } = useForm<TipFormValues>({
    defaultValues: DEFAULTS,
    resolver: zodResolver(tipFormSchema),
    mode: 'onChange',
  })
  const { bill, tip, people } = useWatch({ control })
  const [splitOpen, setSplitOpen] = useState(false)

  const { tipAmount, total, tipPerPerson, totalPerPerson } = useTipCalculator(bill ?? '', tip ?? '', people ?? '')

  const handleReset = () => {
    reset(DEFAULTS)
    setSplitOpen(false)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles['page-title']}>Tip Calculator</h1>
      <div className={styles.card}>
        <div className={styles['split-row']}>
          <Controller
            name="bill"
            control={control}
            render={({ field }) => (
              <FieldInput
                label="Bill"
                value={field.value}
                type="text"
                inputMode="decimal"
                onChange={acceptIfValid(billSchema, field.onChange)}
                onBlur={() => { field.onChange(normalizeBill(field.value)); field.onBlur() }}
              />
            )}
          />
          <Controller
            name="tip"
            control={control}
            render={({ field }) => (
              <FieldInput
                label="Tip"
                value={field.value}
                type="number"
                min="0"
                max="100"
                onChange={acceptIfValid(tipSchema, field.onChange)}
                onBlur={() => { field.onChange(normalizeTip(field.value)); field.onBlur() }}
              />
            )}
          />
        </div>

        <div className={styles['split-row']}>
          <ComputedField label="Tip amount" value={formatCurrency(tipAmount)} />
          <ComputedField label="Total" value={formatCurrency(total)} />
        </div>

        <div className={styles.divider} />

        <SplitSection label="Are you splitting the bill?" open={splitOpen} onToggle={() => setSplitOpen(o => !o)}>
          <Controller
            name="people"
            control={control}
            render={({ field }) => (
              <FieldInput
                label="Number of people"
                value={field.value}
                type="number"
                min="2"
                max="50"
                onChange={acceptIfValid(peopleSchema, field.onChange)}
                onBlur={() => { field.onChange(normalizePeople(field.value)); field.onBlur() }}
              />
            )}
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
