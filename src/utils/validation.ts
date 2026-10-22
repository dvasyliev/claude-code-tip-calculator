export function isValidBillInput(v: string): boolean {
  return /^\d*\.?\d{0,2}$/.test(v) && (parseFloat(v) || 0) <= 100000
}

export function normalizeBill(v: string): string {
  const n = Math.min(Math.max(parseFloat(v) || 0, 0), 100000)
  return n.toFixed(2)
}

export function isValidTipInput(v: string): boolean {
  return /^\d*$/.test(v) && (parseInt(v) || 0) <= 100
}

export function normalizeTip(v: string): string {
  const n = Math.min(Math.max(parseInt(v) || 0, 0), 100)
  return String(n)
}

export function isValidPeopleInput(v: string): boolean {
  return /^\d*$/.test(v) && (parseInt(v) || 0) <= 50
}

export function normalizePeople(v: string): string {
  const n = Math.min(Math.max(parseInt(v) || 2, 2), 50)
  return String(n)
}
