import { Field } from '../field/field'
import styles from './field-input.module.css'
import type { FieldInputProps } from './field-input.types'

export function FieldInput({
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  inputMode,
  min,
  max,
}: FieldInputProps) {
  return (
    <Field label={label}>
      <input
        className={styles['field-input']}
        type={type}
        inputMode={inputMode}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </Field>
  )
}
