import { hue, saturation, lightness } from './Color.js'
import isFractionDigits from '@/pixel/validation/isFractionDigits.js'

/**
 * Stringifies a channel as a hexadecimal string.
 *
 * @param {number} channel
 * @returns {string}
 */
export function stringifyHexChannel(channel) {
  return Math.round(channel * 0xFF).toString(16).padStart(2, 0)
}

/**
 * Stringifies a channel as a percentage string.
 *
 * @param {number} channel
 * @param {number} [fractionDigits]
 * @returns {string}
 */
export function stringifyPercentageChannel(channel, fractionDigits) {
  if (isFractionDigits(fractionDigits)) {
    return `${(channel * 100).toFixed(fractionDigits)}%`
  }
  return `${(channel * 100)}%`
}

/**
 * Stringifies a channel as a byte string.
 *
 * @param {number} channel
 * @param {number} [fractionDigits]
 * @returns {string}
 */
export function stringifyByteChannel(channel, fractionDigits) {
  if (isFractionDigits(fractionDigits)) {
    return (channel * 0xFF).toFixed(fractionDigits)
  }
  return (channel * 0xFF)
}

/**
 * Stringifies a channel as a string.
 *
 * @param {number} channel
 * @param {number} [fractionDigits]
 * @returns {string}
 */
export function stringifyChannel(channel, fractionDigits) {
  if (isFractionDigits(fractionDigits)) {
    return channel.toFixed(fractionDigits)
  }
  return channel.toString()
}

/**
 * Map function that stringifies a channel as a string.
 *
 * @param {number} channel
 * @param {number} index
 * @returns {string}
 */
export function stringifyRGBAChannel(channel, index) {
  if (index < 3) {
    return stringifyByteChannel(channel)
  }
  return stringifyChannel(channel)
}

/**
 * Map function that stringifies a channel as a string.
 *
 * @param {number} channel
 * @param {number} index
 * @param {Color} color
 * @returns {string}
 */
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

/**
 * Stringifies a color as a CSS hexadecimal string.
 *
 * @param {Color} color
 * @returns {string}
 */
export function stringifyHex(color) {
  return '#' + color.map(stringifyHexChannel).join('')
}

/**
 * Stringifies a color as a CSS rgba string.
 *
 * @param {Color} color
 * @returns {string}
 */
export function stringifyRGBA(color) {
  return `rgba(${color.map(stringifyRGBAChannel).join(', ')})`
}

/**
 * Stringifies a color as a CSS rgb string.
 *
 * @param {Color} color
 * @returns {string}
 */
export function stringifyRGB(color) {
  return `rgb(${color.slice(0, 3).map(stringifyRGBAChannel).join(', ')})`
}

/**
 * Stringifies a color as a CSS hsla string.
 *
 * @param {Color} color
 * @returns {string}
 */
export function stringifyHSLA(color) {
  return `hsla(${color.map(stringifyHSLAChannel).join(', ')})`
}

/**
 * Stringifies a color as a CSS hsl string.
 *
 * @param {Color} color
 * @returns {string}
 */
export function stringifyHSL(color) {
  return `hsl(${color.slice(0, 3).map(stringifyHSLAChannel).join(', ')})`
}

/**
 * Stringifies a color as a CSS string.
 *
 * @param {Color} color
 * @param {ColorFormat} [format='hex']
 * @returns {string}
 */
export function stringify(color, format = 'hex') {
  switch (format) {
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
