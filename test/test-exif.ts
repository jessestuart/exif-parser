import { readFileSync } from 'fs'

import BufferStream from '../src/lib/bufferstream'
import exif from '../src/lib/exif'
import expectedTags from './expected-exif-tags.json'

const buf = readFileSync(__dirname + '/starfish.jpg')

describe('exif module', () => {
  test('test parseTags', () => {
    let index = 0
    exif.parseTags(
      new BufferStream(buf, 24, 23960),
      (ifdSection, tagType, value, format) => {
        const t = expectedTags[index]

        expect(t.ifdSection).toStrictEqual(ifdSection)
        expect(t.tagType).toStrictEqual(tagType)
        expect(t.format).toStrictEqual(format)
        if (typeof t.value === 'string' && t.value.indexOf('b:') === 0) {
          expect(Buffer.isBuffer(value)).toBeTruthy()
          expect(parseInt(t.value.substr(2), 10)).toEqual(value.length)
        } else {
          expect(t.value).toEqual(value)
        }
        ++index
      }
    )
    expect(index).toStrictEqual(expectedTags.length)
  })
})
