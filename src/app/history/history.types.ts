export interface HistoryEntry {
  bill: number;
  tip: number;
  people: number;
  totalPerPerson: number;
}

export interface HistoryListProps {
  entries: HistoryEntry[];
  onClear: () => void;
}
