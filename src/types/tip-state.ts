export const DEFAULTS = { bill: '0.00', tip: '0', people: '2' } as const

export interface TipState {
  bill: string
  tip: string
  people: string
  splitOpen: boolean
}
