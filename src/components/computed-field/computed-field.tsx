import { Field } from '../field/field'
import styles from './computed-field.module.css'
import type { ComputedFieldProps } from './computed-field.types'

export function ComputedField({ label, value }: ComputedFieldProps) {
  return (
    <Field label={label} rowClassName={styles['field-row--computed']}>
      <span className={styles.computed}>{value}</span>
    </Field>
  )
}
