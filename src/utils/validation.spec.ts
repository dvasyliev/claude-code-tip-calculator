import { describe, it, expect } from 'vitest'
import {
  isValidBillInput, normalizeBill,
  isValidTipInput, normalizeTip,
  isValidPeopleInput, normalizePeople,
} from './validation'

describe('isValidBillInput', () => {
  it('accepts empty string', () => expect(isValidBillInput('')).toBe(true))
  it('accepts integers', () => expect(isValidBillInput('100')).toBe(true))
  it('accepts partial decimal "."', () => expect(isValidBillInput('.')).toBe(true))
  it('accepts partial decimal "1."', () => expect(isValidBillInput('1.')).toBe(true))
  it('accepts 1 decimal place', () => expect(isValidBillInput('1.5')).toBe(true))
  it('accepts 2 decimal places', () => expect(isValidBillInput('1.50')).toBe(true))
  it('accepts max value 100000', () => expect(isValidBillInput('100000')).toBe(true))
  it('rejects 3 decimal places', () => expect(isValidBillInput('1.555')).toBe(false))
  it('rejects above 100000', () => expect(isValidBillInput('100001')).toBe(false))
  it('rejects letters', () => expect(isValidBillInput('abc')).toBe(false))
  it('rejects negative sign', () => expect(isValidBillInput('-1')).toBe(false))
  it('rejects multiple dots', () => expect(isValidBillInput('1.2.3')).toBe(false))
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

describe('isValidTipInput', () => {
  it('accepts empty string', () => expect(isValidTipInput('')).toBe(true))
  it('accepts zero', () => expect(isValidTipInput('0')).toBe(true))
  it('accepts 100', () => expect(isValidTipInput('100')).toBe(true))
  it('accepts mid-range', () => expect(isValidTipInput('15')).toBe(true))
  it('rejects above 100', () => expect(isValidTipInput('101')).toBe(false))
  it('rejects decimals', () => expect(isValidTipInput('1.5')).toBe(false))
  it('rejects letters', () => expect(isValidTipInput('abc')).toBe(false))
})

describe('normalizeTip', () => {
  it('returns value as string', () => expect(normalizeTip('15')).toBe('15'))
  it('empty string becomes "0"', () => expect(normalizeTip('')).toBe('0'))
  it('non-numeric becomes "0"', () => expect(normalizeTip('abc')).toBe('0'))
  it('clamps to max 100', () => expect(normalizeTip('150')).toBe('100'))
  it('clamps negative to 0', () => expect(normalizeTip('-5')).toBe('0'))
})

describe('isValidPeopleInput', () => {
  it('accepts empty string', () => expect(isValidPeopleInput('')).toBe(true))
  it('accepts valid count', () => expect(isValidPeopleInput('2')).toBe(true))
  it('accepts max 50', () => expect(isValidPeopleInput('50')).toBe(true))
  it('rejects above 50', () => expect(isValidPeopleInput('51')).toBe(false))
  it('rejects decimals', () => expect(isValidPeopleInput('1.5')).toBe(false))
  it('rejects letters', () => expect(isValidPeopleInput('abc')).toBe(false))
})

describe('normalizePeople', () => {
  it('returns value as string', () => expect(normalizePeople('5')).toBe('5'))
  it('empty string becomes "2"', () => expect(normalizePeople('')).toBe('2'))
  it('non-numeric becomes "2"', () => expect(normalizePeople('abc')).toBe('2'))
  it('"1" clamps to minimum "2"', () => expect(normalizePeople('1')).toBe('2'))
  it('clamps to max 50', () => expect(normalizePeople('51')).toBe('50'))
})
