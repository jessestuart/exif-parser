const exif = require('./exif')
const date = require('./date')

const degreeTags = [
  {
    section: exif.GPSIFD,
    type: 0x0002,
    name: 'GPSLatitude',
    refType: 0x0001,
    refName: 'GPSLatitudeRef',
    posVal: 'N',
  },

  {
    section: exif.GPSIFD,
    type: 0x0004,
    name: 'GPSLongitude',
    refType: 0x0003,
    refName: 'GPSLongitudeRef',
    posVal: 'E',
  },
]

const dateTags = [
  {
    section: exif.SubIFD,
    type: 0x0132,
    name: 'ModifyDate',
  },

  {
    section: exif.SubIFD,
    type: 0x9003,
    name: 'DateTimeOriginal',
  },

  {
    section: exif.SubIFD,
    type: 0x9004,
    name: 'CreateDate',
  },

  {
    section: exif.SubIFD,
    type: 0x0132,
    name: 'ModifyDate',
  },
]

export default {
  castDegreeValues(getTagValue, setTagValue) {
    degreeTags.forEach(function(t) {
      const degreeVal = getTagValue(t)
      if (degreeVal) {
        const degreeRef = getTagValue({
          section: t.section,
          type: t.refType,
          name: t.refName,
        })
        const degreeNumRef = degreeRef === t.posVal ? 1 : -1
        const degree =
          (degreeVal[0] + degreeVal[1] / 60 + degreeVal[2] / 3600) *
          degreeNumRef
        setTagValue(t, degree)
      }
    })
  },
  castDateValues(getTagValue, setTagValue) {
    dateTags.forEach(function(t) {
      const dateStrVal = getTagValue(t)
      if (dateStrVal) {
        // some easy checks to determine two common date formats
        const timestamp = date.parseExifDate(dateStrVal)
        if (typeof timestamp !== 'undefined') {
          setTagValue(t, timestamp)
        }
      }
    })
  },
  simplifyValue(values, format) {
    if (Array.isArray(values)) {
      values = values.map(function(value) {
        if (format === 10 || format === 5) {
          return value[0] / value[1]
        }
        return value
      })
      if (values.length === 1) {
        values = values[0]
      }
    }
    return values
  },
}
