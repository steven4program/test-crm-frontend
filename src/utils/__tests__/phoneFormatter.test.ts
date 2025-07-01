import { describe, it, expect } from 'vitest'
import { formatPhoneNumber } from '../phoneFormatter'

describe('formatPhoneNumber', () => {
  it('should format a basic US phone number', () => {
    expect(formatPhoneNumber('+12345678901')).toBe('+1 (234) 567-8901')
  })

  it('should format a phone number without country code', () => {
    expect(formatPhoneNumber('2345678901')).toBe('(234) 567-8901')
  })

  it('should handle already formatted phone numbers', () => {
    expect(formatPhoneNumber('+1 (234) 567-8890')).toBe('+1 (234) 567-8890')
  })

  it('should handle phone numbers with dashes and spaces', () => {
    expect(formatPhoneNumber('234-567-8901')).toBe('(234) 567-8901')
    expect(formatPhoneNumber('234 567 8901')).toBe('(234) 567-8901')
  })

  it('should return original string for invalid phone numbers', () => {
    expect(formatPhoneNumber('123')).toBe('123')
    expect(formatPhoneNumber('invalid')).toBe('invalid')
    expect(formatPhoneNumber('')).toBe('')
  })

  it('should handle null and undefined gracefully', () => {
    expect(formatPhoneNumber(null)).toBe('')
    expect(formatPhoneNumber(undefined)).toBe('')
  })
})