import exifParser from '../index'

const buf = require('fs').readFileSync(process.argv[2])
const parser = exifParser.create(buf)
const result = parser.parse()

Object.keys(result.tags).forEach(function(name) {
  console.log(name + ': ' + result.tags[name])
})
