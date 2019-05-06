export default class DOMBufferStream {
  public view: DataView
  public littleEndian: boolean
  public arrayBuffer: ArrayBuffer
  public bigEndian: boolean
  public global: any
  public length: any
  public offset: number
  public parentOffset: number

  public constructor(
    arrayBuffer: ArrayBuffer,
    offset: number = 0,
    length: number,
    bigEndian: boolean,
    global: any,
    parentOffset: number
  ) {
    this.global = global
    length = length || arrayBuffer.byteLength - offset
    this.arrayBuffer = arrayBuffer.slice(offset, offset + length)
    this.view = new DataView(this.arrayBuffer, 0, this.arrayBuffer.byteLength)
    this.setBigEndian(bigEndian)
    this.offset = 0
    this.parentOffset = (parentOffset || 0) + offset
  }

  public setBigEndian(bigEndian: boolean) {
    this.littleEndian = !bigEndian
  }

  public nextUInt8() {
    const value = this.view.getUint8(this.offset)
    this.offset += 1
    return value
  }

  public nextInt8() {
    const value = this.view.getInt8(this.offset)
    this.offset += 1
    return value
  }

  public nextUInt16() {
    const value = this.view.getUint16(this.offset, this.littleEndian)
    this.offset += 2
    return value
  }

  public nextUInt32() {
    const value = this.view.getUint32(this.offset, this.littleEndian)
    this.offset += 4
    return value
  }

  public nextInt16() {
    const value = this.view.getInt16(this.offset, this.littleEndian)
    this.offset += 2
    return value
  }

  public nextInt32() {
    const value = this.view.getInt32(this.offset, this.littleEndian)
    this.offset += 4
    return value
  }

  public nextFloat() {
    const value = this.view.getFloat32(this.offset, this.littleEndian)
    this.offset += 4
    return value
  }

  public nextDouble() {
    const value = this.view.getFloat64(this.offset, this.littleEndian)
    this.offset += 8
    return value
  }

  public nextBuffer(length) {
    // this won't work in IE10
    const value = this.arrayBuffer.slice(this.offset, this.offset + length)
    this.offset += length
    return value
  }

  public remainingLength() {
    return this.arrayBuffer.byteLength - this.offset
  }

  public nextString(length) {
    let value = this.arrayBuffer.slice(this.offset, this.offset + length)
    value = String.fromCharCode.apply(null, new this.global.Uint8Array(value))
    this.offset += length
    return value
  }

  public mark() {
    const self = this
    return {
      openWithOffset(offset: number) {
        offset = (offset || 0) + this.offset
        return new DOMBufferStream(
          self.arrayBuffer,
          offset,
          self.arrayBuffer.byteLength - offset,
          !self.littleEndian,
          self.global,
          self.parentOffset
        )
      },
      offset: this.offset,
      getParentOffset() {
        return self.parentOffset
      },
    }
  }

  public offsetFrom(marker) {
    return (
      this.parentOffset +
      this.offset -
      (marker.offset + marker.getParentOffset())
    )
  }

  public skip(amount) {
    this.offset += amount
  }

  public branch(offset, length) {
    length =
      typeof length === 'number'
        ? length
        : this.arrayBuffer.byteLength - (this.offset + offset)
    return new DOMBufferStream(
      this.arrayBuffer,
      this.offset + offset,
      length,
      !this.littleEndian,
      this.global,
      this.parentOffset
    )
  }
}
