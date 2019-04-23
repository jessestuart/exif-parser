import BufferStream from '../lib/BufferStream'
import jpeg from '../lib/jpeg'

const buf = require('fs').readFileSync(__dirname + '/test.jpg')

test('test parseSections', () => {
  const expectedSections = [
    { type: 216, offset: 2, len: 0 },
    { type: 224, offset: 6, len: 14 },
    { type: 226, offset: 24, len: 3158 },
    { type: 225, offset: 3186, len: 200 },
    { type: 225, offset: 3390, len: 374 },
    { type: 219, offset: 3768, len: 65 },
    { type: 219, offset: 3837, len: 65 },
    { type: 192, offset: 3906, len: 15 },
    { type: 196, offset: 3925, len: 29 },
    { type: 196, offset: 3958, len: 179 },
    { type: 196, offset: 4141, len: 29 },
    { type: 196, offset: 4174, len: 179 },
    { type: 218, offset: 4355, len: 0 },
  ]

  let index = 0
  const jpegStream = new BufferStream(buf),
    start = jpegStream.mark()
  jpeg.parseSections(jpegStream, function(type: any, sectionStream: any) {
    expect(type).toStrictEqual(expectedSections[index].type)
    expect(sectionStream.offsetFrom(start)).toStrictEqual(
      expectedSections[index].offset
    )
    expect(sectionStream.remainingLength()).toStrictEqual(
      expectedSections[index].len
    )
    ++index
  })
  expect(index).toStrictEqual(expectedSections.length)
})

test('test getSizeFromSOFSection', () => {
  const size = jpeg.getSizeFromSOFSection(new BufferStream(buf, 3906, 15, true))
  expect(size.width).toStrictEqual(2)
  expect(size.height).toStrictEqual(1)
})

test('test getSectionName', () => {
  expect({ name: 'SOI' }).toEqual(jpeg.getSectionName(0xd8))
  expect({ name: 'APP', index: 15 }).toEqual(jpeg.getSectionName(0xef))
  expect({ name: 'DHT' }).toEqual(jpeg.getSectionName(0xc4))
})
