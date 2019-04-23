import Parser from './lib/parser'

function getGlobal() {
  return (1, eval)('this')
}

export default {
  create(buffer: any, global?: any) {
    global = global || getGlobal()
    if (buffer instanceof ArrayBuffer) {
      const DOMBufferStream = require('./lib/dom-bufferstream')
      return new Parser(
        new DOMBufferStream(buffer, 0, buffer.byteLength, true, global)
      )
    } else {
      const NodeBufferStream = require('./lib/bufferstream')
      return new Parser(new NodeBufferStream(buffer, 0, buffer.length, true))
    }
  },
}
