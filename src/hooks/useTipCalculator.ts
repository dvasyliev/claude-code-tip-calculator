export function useTipCalculator(bill: string, tip: string, people: string) {
  const billNum = parseFloat(bill) || 0
  const tipNum = parseFloat(tip) || 0
  const peopleNum = Math.max(1, parseInt(people) || 1)
  const tipAmount = Math.round(billNum * tipNum) / 100
  const total = Math.round((billNum + tipAmount) * 100) / 100
  return {
    tipAmount,
    total,
    tipPerPerson: tipAmount / peopleNum,
    totalPerPerson: total / peopleNum,
  }
}
