import { describe, it, expect } from 'vitest'
import {
  billSchema, normalizeBill,
  tipSchema, normalizeTip,
  peopleSchema, normalizePeople,
} from './validation'

describe('billSchema', () => {
  it('accepts empty string', () => expect(billSchema.safeParse('').success).toBe(true))
  it('accepts integers', () => expect(billSchema.safeParse('100').success).toBe(true))
  it('accepts partial decimal "."', () => expect(billSchema.safeParse('.').success).toBe(true))
  it('accepts partial decimal "1."', () => expect(billSchema.safeParse('1.').success).toBe(true))
  it('accepts 1 decimal place', () => expect(billSchema.safeParse('1.5').success).toBe(true))
  it('accepts 2 decimal places', () => expect(billSchema.safeParse('1.50').success).toBe(true))
  it('accepts max value 100000', () => expect(billSchema.safeParse('100000').success).toBe(true))
  it('rejects 3 decimal places', () => expect(billSchema.safeParse('1.555').success).toBe(false))
  it('rejects above 100000', () => expect(billSchema.safeParse('100001').success).toBe(false))
  it('rejects letters', () => expect(billSchema.safeParse('abc').success).toBe(false))
  it('rejects negative sign', () => expect(billSchema.safeParse('-1').success).toBe(false))
  it('rejects multiple dots', () => expect(billSchema.safeParse('1.2.3').success).toBe(false))
})

describe('normalizeBill', () => {
  it('formats integer to 2 decimals', () => expect(normalizeBill('50')).toBe('50.00'))
  it('formats zero', () => expect(normalizeBill('0')).toBe('0.00'))
  it('empty string becomes "0.00"', () => expect(normalizeBill('')).toBe('0.00'))
  it('non-numeric becomes "0.00"', () => expect(normalizeBill('abc')).toBe('0.00'))
  it('clamps to max 100000', () => expect(normalizeBill('200000')).toBe('100000.00'))
  it('clamps negative to 0', () => expect(normalizeBill('-5')).toBe('0.00'))
  it('preserves max value', () => expect(normalizeBill('100000')).toBe('100000.00'))
})

describe('tipSchema', () => {
  it('accepts empty string', () => expect(tipSchema.safeParse('').success).toBe(true))
  it('accepts zero', () => expect(tipSchema.safeParse('0').success).toBe(true))
  it('accepts 100', () => expect(tipSchema.safeParse('100').success).toBe(true))
  it('accepts mid-range', () => expect(tipSchema.safeParse('15').success).toBe(true))
  it('rejects above 100', () => expect(tipSchema.safeParse('101').success).toBe(false))
  it('rejects decimals', () => expect(tipSchema.safeParse('1.5').success).toBe(false))
  it('rejects letters', () => expect(tipSchema.safeParse('abc').success).toBe(false))
})

describe('normalizeTip', () => {
  it('returns value as string', () => expect(normalizeTip('15')).toBe('15'))
  it('empty string becomes "0"', () => expect(normalizeTip('')).toBe('0'))
  it('non-numeric becomes "0"', () => expect(normalizeTip('abc')).toBe('0'))
  it('clamps to max 100', () => expect(normalizeTip('150')).toBe('100'))
  it('clamps negative to 0', () => expect(normalizeTip('-5')).toBe('0'))
})

describe('peopleSchema', () => {
  it('accepts empty string', () => expect(peopleSchema.safeParse('').success).toBe(true))
  it('accepts valid count', () => expect(peopleSchema.safeParse('2').success).toBe(true))
  it('accepts max 50', () => expect(peopleSchema.safeParse('50').success).toBe(true))
  it('rejects above 50', () => expect(peopleSchema.safeParse('51').success).toBe(false))
  it('rejects decimals', () => expect(peopleSchema.safeParse('1.5').success).toBe(false))
  it('rejects letters', () => expect(peopleSchema.safeParse('abc').success).toBe(false))
})

describe('normalizePeople', () => {
  it('returns value as string', () => expect(normalizePeople('5')).toBe('5'))
  it('empty string becomes "2"', () => expect(normalizePeople('')).toBe('2'))
  it('non-numeric becomes "2"', () => expect(normalizePeople('abc')).toBe('2'))
  it('"1" clamps to minimum "2"', () => expect(normalizePeople('1')).toBe('2'))
  it('clamps to max 50', () => expect(normalizePeople('51')).toBe('50'))
})
