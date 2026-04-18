import styles from './field.module.css'
import type { FieldProps } from './field.types'

export function Field({ label, children, rowClassName }: FieldProps) {
  return (
    <div className={styles.section}>
      <div className={styles['section-header']}>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={`${styles['field-row']}${rowClassName ? ` ${rowClassName}` : ''}`}>
        {children}
      </div>
    </div>
  )
}
