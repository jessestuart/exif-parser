import { DateTime } from 'luxon'

import _ from 'lodash'

/**
 *
 * Parse date with "2004-09-04T23:39:06-08:00" format,
 * one of the formats supported by ISO 8601, and
 * convert to UTC timestamp in seconds.
 *
 * @param {string} dateTimeStr
 * @returns {number}
 */
export const parseDateWithTimezoneFormat = (dateTimeStr: string): number => {
  return DateTime.fromISO(dateTimeStr).toSeconds()
}

/**
 * Parse date with `YYYY:MM:DD hh:mm:ss` format & convert to UTC timestamp in
 * seconds.
 *
 * @param {string} dateTimeStr
 * @returns {undefined}
 */
export const parseDateWithSpecFormat = (dateTimeStr: string): number => {
  return DateTime.fromFormat(dateTimeStr, 'yyyy:MM:dd hh:mm:ss', {
    zone: 'utc',
  }).toSeconds()
}

/**
 * Some easy checks to determine two common date formats.
 */
export const parseExifDate = (dateTimeStr: string): number | null => {
  // Is the date in the "standard" `YYYY:MM:DD hh:mm:ss` format?
  const isSpecFormat =
    dateTimeStr.length === 19 && dateTimeStr.charAt(4) === ':'
  // Is the date in the ISO format?
  const isTimezoneFormat =
    dateTimeStr.length === 25 && dateTimeStr.charAt(10) === 'T'

  let timestamp: number
  if (isTimezoneFormat) {
    timestamp = parseDateWithTimezoneFormat(dateTimeStr)
  } else if (isSpecFormat) {
    timestamp = parseDateWithSpecFormat(dateTimeStr)
  }
  return _.isNaN(timestamp) ? null : timestamp
}
