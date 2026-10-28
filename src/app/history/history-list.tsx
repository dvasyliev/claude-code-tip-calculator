import { formatCurrency } from "@/utils/format";
import styles from "./history-list.module.css";
import type { HistoryListProps } from "./history.types";

export function HistoryList({ entries, onClear }: HistoryListProps) {
  if (!entries.length) return null;

  return (
    <section className={styles.history}>
      <div className={styles.header}>
        <h2 className={styles.title}>History</h2>
        <button className={styles["clear-btn"]} onClick={onClear}>
          Clear
        </button>
      </div>
      <ol className={styles.list}>
        {entries.map(({ bill, tip, people, totalPerPerson }, i) => (
          <li key={i} className={styles.item}>
            Bill {formatCurrency(bill)} · Tip {tip}% · {people}{" "}
            {people === 1 ? "person" : "people"} ·{" "}
            {formatCurrency(totalPerPerson)} each
          </li>
        ))}
      </ol>
    </section>
  );
}
