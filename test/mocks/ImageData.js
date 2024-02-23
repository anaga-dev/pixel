export class ImageDataMock {
  #width = 0
  #height = 0
  #data = null
  #colorSpace = 'srgb'

  constructor(...args) {
    if (args.length < 2) {
      throw new TypeError(`Failed to construct 'ImageData': 2 arguments required, but only ${args.length} present.`)
    }
    const [first] = args
    if (first instanceof Uint8ClampedArray) {
      this.#constructorWithDataSize(...args)
    } else {
      this.#constructorWithSize(...args)
    }
  }

  #constructorWithDataSize(data, width, height, settings) {
    this.#width = width
    if (height === undefined) {
      this.#height = data.length / (width * 4)
    } else {
      this.#height = height
    }
    if (data.length !== this.#width * this.#height * 4) {
      throw new TypeError('Failed to construct ImageData: The input data length is not a multiple of (width * height * 4)')
    }
    this.#data = data
    this.#colorSpace = settings?.colorSpace || 'srgb'
  }

  #constructorWithSize(width, height, settings) {
    this.#width = width
    this.#height = height
    this.#data = new Uint8ClampedArray(width * height * 4)
    this.#colorSpace = settings?.colorSpace || 'srgb'
  }

  get width() {
    return this.#width
  }

  get height() {
    return this.#height
  }

  get data() {
    return this.#data
  }

  get colorSpace() {
    return this.#colorSpace
  }
}

export default ImageDataMock
