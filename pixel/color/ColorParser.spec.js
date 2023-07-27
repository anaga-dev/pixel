import ColorParser from './ColorParser.js'
import { expect } from 'chai'

describe('ColorParser', () => {
  it('should parse color', () => {
    expect(ColorParser.parse('#0f0')).to.be.deep.equal([0, 1, 0, 1])
    expect(ColorParser.parse('#f00f')).to.be.deep.equal([1, 0, 0, 1])
    expect(ColorParser.parse('#ff00ff')).to.be.deep.equal([1, 0, 1, 1])
    expect(ColorParser.parse('#000000')).to.be.deep.equal([0, 0, 0, 1])
    expect(ColorParser.parse('#000000ff')).to.be.deep.equal([0, 0, 0, 1])
    expect(ColorParser.parse('rgb(255, 0, 0)')).to.be.deep.equal([1, 0, 0, 1])
    expect(ColorParser.parse('rgb(255, 255, 0)')).to.be.deep.equal([1, 1, 0, 1])
    expect(ColorParser.parse('rgb(100%, 0%, 0%)')).to.be.deep.equal([1, 0, 0, 1])
    expect(ColorParser.parse('rgb(100% 0% 0%)')).to.be.deep.equal([1, 0, 0, 1])
    expect(ColorParser.parse('rgba(100% 0% 0% 100%)')).to.be.deep.equal([1, 0, 0, 1])
    expect(ColorParser.parse('rgba(100% 0% 0% 50%)')).to.be.deep.equal([1, 0, 0, 0.5])
    expect(ColorParser.parse('rgba(255 0 0 255)')).to.be.deep.equal([1, 0, 0, 1])
    expect(ColorParser.parse('rgba(0,0,0,0)')).to.be.deep.equal([0, 0, 0, 0])
  })
})
