import styles from './split-section.module.css'
import type { SplitSectionProps } from './split-section.types'

export function SplitSection({ label, open, onToggle, children }: SplitSectionProps) {
  return (
    <div className={styles['split-section']}>
      <button className={styles['split-toggle']} onClick={onToggle}>
        <span className={styles['split-chevron']}>{open ? '∧' : '∨'}</span>
        <span className={styles['split-title']}>{label}</span>
      </button>
      {open && children}
    </div>
  )
}
