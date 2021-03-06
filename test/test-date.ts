import {
  parseDateWithSpecFormat,
  parseDateWithTimezoneFormat,
  parseExifDate,
} from '../src/lib/date'

const MINUTES = 60
const HOURS = MINUTES * 60
const DAYS = HOURS * 24
const YEARS = DAYS * 365
const LEAP_YEARS = DAYS * 366

describe('date parser', () => {
  test('test parse unix epoch without timezone', () => {
    const dateStr = '1970:01:01 00:00:00'
    const timestamp = parseDateWithSpecFormat(dateStr)
    expect(timestamp).toBe(0)
  })

  test('test parse given date without timezone', () => {
    const dateStr = '1990:02:14 14:30:14'
    const timestamp = parseDateWithSpecFormat(dateStr)
    // Between 1970 and 1990 there were 5 leap years: 1972, 1976, 1980, 1984, 1988
    const expectedTimestamp =
      15 * YEARS +
      5 * LEAP_YEARS +
      (31 + 13) * DAYS +
      14 * HOURS +
      30 * MINUTES +
      14

    expect(timestamp).toStrictEqual(expectedTimestamp)
  })

  test('test parse invalid date without timezone should not return anything', () => {
    const dateStr = '1990:AA:14 14:30:14'
    const timestamp = parseDateWithSpecFormat(dateStr)
    expect(timestamp).toBeNaN()
  })

  test('test parse given date with timezone', () => {
    const dateStr = '2004-09-04T23:39:06-08:00'
    const timestamp = parseDateWithTimezoneFormat(dateStr)
    const yearsFromEpoch = 2004 - 1970
    // 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000
    const leapYearsCount = 8
    // 2004 is a leap year as well, hence 29 days for february
    const dayCount = 31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 3
    const expectedTimestamp =
      (yearsFromEpoch - leapYearsCount) * YEARS +
      leapYearsCount * LEAP_YEARS +
      dayCount * DAYS +
      23 * HOURS +
      39 * MINUTES +
      6 +
      8 * HOURS // for timezone

    expect(timestamp).toStrictEqual(expectedTimestamp)
  })

  test('test parse invalid date with timezone', () => {
    const dateStr = '2004-09-04T23:39:06A08:00'
    const timestamp = parseDateWithTimezoneFormat(dateStr)

    expect(timestamp).toBeNaN()
  })

  test('test parseExifDate', () => {
    expect(parseExifDate('1970:01:01 00:00:00')).toStrictEqual(0)
    expect(parseExifDate('1970-01-01T00:00:00-01:00')).toStrictEqual(3600)
  })
})
