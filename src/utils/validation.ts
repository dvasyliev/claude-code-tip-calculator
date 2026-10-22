import { z } from 'zod'

export const billSchema = z.string()
  .regex(/^\d*\.?\d{0,2}$/)
  .refine(v => (parseFloat(v) || 0) <= 100000)

export const tipSchema = z.string()
  .regex(/^\d*$/)
  .refine(v => (parseInt(v) || 0) <= 100)

export const peopleSchema = z.string()
  .regex(/^\d*$/)
  .refine(v => (parseInt(v) || 0) <= 50)

export const tipFormSchema = z.object({
  bill: billSchema,
  tip: tipSchema,
  people: peopleSchema,
})

export type TipFormValues = z.infer<typeof tipFormSchema>

export function normalizeBill(v: string): string {
  const n = Math.min(Math.max(parseFloat(v) || 0, 0), 100000)
  return n.toFixed(2)
}

export function normalizeTip(v: string): string {
  const n = Math.min(Math.max(parseInt(v) || 0, 0), 100)
  return String(n)
}

export function normalizePeople(v: string): string {
  const n = Math.min(Math.max(parseInt(v) || 2, 2), 50)
  return String(n)
}
