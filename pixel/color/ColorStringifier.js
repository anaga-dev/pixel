import { hue } from './Color.js'

export function stringifyHexChannel(channel) {
  return Math.round(channel * 0xFF).toString(16).padStart(2, 0)
}

export function stringifyPercentageChannel(channel) {
  return `${(channel * 100).toFixed(2)}%`
}

export function stringifyByteChannel(channel) {
  return (channel * 0xFF).toFixed(2)
}

export function stringifyChannel(channel) {
  return channel.toFixed(2)
}

export function stringifyRGBAChannel(channel, index) {
  if (index < 4) {
    return stringifyByteChannel(channel)
  }
  return stringifyChannel(channel)
}

export function stringifyHSLAChannel(channel, index, color) {
  if (index === 0) {
    return stringifyChannel(hue(color))
  } else if (index === 1) {
    return stringifyPercentageChannel(saturation(color))
  } else if (index === 2) {
    return stringifyPercentageChannel(lightness(color))
  }
  return stringifyChannel(channel)
}

export function stringifyHex(color) {
  return '#' + color.map(stringifyHexChannel).join('')
}

export function stringifyRGBA(color) {
  return `rgba(${color.map(stringifyRGBAChannel).join(',')})`
}

export function stringifyRGB(color) {
  return `rgb(${color.slice(0, 3).map(stringifyRGBAChannel).join(',')})`
}

export function stringifyHSLA(color) {
  return `hsla(${color.map(stringifyHSLAChannel).join(',')})`
}

export function stringifyHSL(color) {
  return `hsla(${color.slice(0, 3).map(stringifyHSLAChannel).join(',')})`
}

export function stringify(color, model = 'hex') {
  switch (model) {
    default:
    case 'rgba':
      return stringifyRGBA(color)
    case 'rgb':
      return stringifyRGB(color)
    case 'hsla':
      return stringifyHSLA(color)
    case 'hsl':
      return stringifyHSL(color)
    case 'hex':
      return stringifyHex(color)
  }
}

export default {
  stringifyByteChannel,
  stringifyChannel,
  stringifyHSL,
  stringifyHSLA,
  stringifyHSLAChannel,
  stringifyHex,
  stringifyHexChannel,
  stringifyPercentageChannel,
  stringifyRGB,
  stringifyRGBA,
  stringifyRGBAChannel,
  stringify
}
