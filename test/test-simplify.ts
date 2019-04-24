import simplify from '../src/lib/simplify'

interface ExifValues {
  DateTimeOriginal?: any
  CreateDate?: any
  ModifyDate?: any
}

describe('simplify module', () => {
  test('test castDateValues', () => {
    const values = {
      CreateDate: '1970-01-01T00:00:00-05:00',
      DateTimeOriginal: '1970:01:01 00:00:00',
      ModifyDate: '1970-01-01T00:00:00-05:00',
    }

    const setValues: ExifValues = {}
    function getTagValue(tag) {
      return values[tag.name]
    }
    function setTagValue(tag, value) {
      setValues[tag.name] = value
    }
    simplify.castDateValues(getTagValue, setTagValue)
    expect(Object.keys(setValues).length).toStrictEqual(3)
    expect(setValues.DateTimeOriginal).toStrictEqual(0)
    expect(setValues.CreateDate).toStrictEqual(5 * 3600)
    expect(setValues.ModifyDate).toStrictEqual(5 * 3600)
  })
})
