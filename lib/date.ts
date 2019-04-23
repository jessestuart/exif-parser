import _ from 'lodash'

const parseNumber = (s: any) => parseInt(s, 10)

// in seconds
const hours = 3600
const minutes = 60

// take date (year, month, day) and time (hour, minutes, seconds) digits in UTC
// and return a timestamp in seconds
function parseDateTimeParts(dateParts, timeParts) {
  dateParts = dateParts.map(_.toNumber)
  timeParts = timeParts.map(_.toNumber)
  const year = dateParts[0]
  const month = dateParts[1] - 1
  const day = dateParts[2]
  const hours = timeParts[0]
  const minutes = timeParts[1]
  const seconds = timeParts[2]
  const date = Date.UTC(year, month, day, hours, minutes, seconds, 0)
  const timestamp = date / 1000
  if (!_.isNumber(timestamp) || _.isNaN(timestamp)) {
    return null
  }
  return timestamp
}

// parse date with "2004-09-04T23:39:06-08:00" format,
// one of the formats supported by ISO 8601, and
// convert to utc timestamp in seconds
function parseDateWithTimezoneFormat(dateTimeStr: string) {
  const dateParts = dateTimeStr.substr(0, 10).split('-')
  const timeParts = dateTimeStr.substr(11, 8).split(':')
  const timezoneStr = dateTimeStr.substr(19, 6)
  const timezoneParts = timezoneStr.split(':').map(parseNumber)
  const timezoneOffset = timezoneParts[0] * hours + timezoneParts[1] * minutes

  let timestamp = parseDateTimeParts(dateParts, timeParts)
  // minus because the timezoneOffset describes
  // how much the described time is ahead of UTC
  timestamp -= timezoneOffset

  console.log({ timestamp })
  if (!_.isNumber(timestamp) || _.isNaN(timestamp)) {
    return null
  }
  return timestamp
}

// parse date with "YYYY:MM:DD hh:mm:ss" format, convert to utc timestamp in seconds
function parseDateWithSpecFormat(dateTimeStr: string) {
  const parts = dateTimeStr.split(' '),
    dateParts = parts[0].split(':'),
    timeParts = parts[1].split(':')

  const timestamp = parseDateTimeParts(dateParts, timeParts)
  console.log({ timestamp })

  if (!_.isNumber(timestamp) || _.isNaN(timestamp)) {
    return null
  }
  return timestamp
}

function parseExifDate(dateTimeStr) {
  // some easy checks to determine two common date formats

  // is the date in the standard "YYYY:MM:DD hh:mm:ss" format?
  const isSpecFormat =
    dateTimeStr.length === 19 && dateTimeStr.charAt(4) === ':'
  // is the date in the non-standard format,
  // "2004-09-04T23:39:06-08:00" to include a timezone?
  const isTimezoneFormat =
    dateTimeStr.length === 25 && dateTimeStr.charAt(10) === 'T'

  console.log({ isSpecFormat, isTimezoneFormat, dateTimeStr })
  if (isTimezoneFormat) {
    return parseDateWithTimezoneFormat(dateTimeStr)
  } else if (isSpecFormat) {
    return parseDateWithSpecFormat(dateTimeStr)
  }
  return null
}

export { parseDateWithSpecFormat, parseDateWithTimezoneFormat, parseExifDate }
