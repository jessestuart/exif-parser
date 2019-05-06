import NodeBufferStream from './lib/bufferstream'
import DOMBufferStream from './lib/dom-bufferstream'
import Parser from './lib/parser'

// function getGlobal() {
//   return (1, eval)('this')
// }

export default class ExifParser {
  public static create(buffer: any, global?: any) {
    global = global
    if (buffer instanceof ArrayBuffer) {
      return new Parser(
        new DOMBufferStream(buffer, 0, buffer.byteLength, true, global)
      )
    } else {
      return new Parser(new NodeBufferStream(buffer, 0, buffer.length, true))
    }
  }
}
