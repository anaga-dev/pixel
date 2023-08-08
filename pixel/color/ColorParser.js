import { NamedColors } from './NamedColors.js'
import { fromHSLA } from './ColorConverter.js'
import Color from './Color.js'

/**
 * Devuelve si el color es `currentcolor`.
 *
 * @param {string} color
 * @returns {boolean}
 */
export function isCurrentColor(color) {
  return color.toLowerCase() === 'currentcolor'
}

/**
 * Devuelve si el valor es 'none'.
 *
 * @param {string} value
 * @returns {boolean}
 */
export function isNone(value) {
  return value.toLowerCase() === 'none'
}

/**
 * Detecta si es un nombre de color consultando la tabla
 * de nombres de colores.
 *
 * @param {string} color
 * @param {Map<string, Color>} namedColors
 * @returns {boolean}
 */
export function isNamedColor(color, namedColors = NamedColors) {
  return namedColors.has(color)
}

/**
 * Devuelve si el color está escrito de forma hexadecimal.
 *
 * @param {string} color
 * @returns {boolean}
 */
export function isHex(color) {
  if (color.startsWith('#')) {
    return /^[a-f0-9]+$/i.test(color.slice(1))
        && color.length === 4 // #000
        || color.length === 5 // #0000
        || color.length === 7 // #000000
        || color.length === 9 // #00000000
  }
  return false
}

/**
 * Parsea el valor de un canal hexadecimal.
 *
 * @param {string} color Color
 * @param {number} index Índice del canal
 * @param {number} size Tamaño del canal
 * @returns {number}
 */
export function parseHexChannel(color, index, size) {
  if (size !== 1 && size !== 2) {
    throw new Error('Invalid hex channel size')
  }
  const value = color.slice(index, index + size)
  if (size === 1) {
    return parseInt(value + value, 16) / 0xFF
  }
  return parseInt(value, 16) / 0xFF
}

/**
 * Devuelve los canales de un color hexadecimal parseados
 *
 * @param {string} color Color
 * @param {number} quantity Número de canales
 * @param {number} size Tamaño del canal
 * @returns {Array<number>}
 */
export function parseHexChannels(color, quantity, size) {
  const channels = []
  for (let index = 1; index < (1 + quantity * size); index += size) {
    channels.push(parseHexChannel(color, index, size))
  }
  if (channels.length === 3) {
    channels.push(1)
  }
  return channels
}

/**
 * Parsea un color hexadecimal.
 *
 * @param {string} color
 * @returns {Array<number>}
 */
export function parseHex(color) {
  if (!isHex(color)) {
    throw new Error('Invalid hex color')
  }
  switch (color.length)
  {
    case 4: return parseHexChannels(color, 3, 1)
    case 5: return parseHexChannels(color, 4, 1)
    case 7: return parseHexChannels(color, 3, 2)
    case 9: return parseHexChannels(color, 4, 2)
    default:
      throw new Error('')
  }
}

export function parseNamedColor(color, namedColors = NamedColors) {
  return parseHex(namedColors.get(color))
}

export function isPercentage(value) {
  return /^[-+]?[0-9]+(?:\.[0-9]+)?%$/.test(value)
}

export function parsePercentage(value) {
  return parseFloat(value.slice(0, -1)) / 100
}

export function isValue(value) {
  return /^[-+]?[0-9]+(?:\.[0-9]+)?$/.test(value)
}

export function isChannel(value) {
  return isPercentage(value) || isValue(value) || isNone(value)
}

export function parseChannel(value, index) {
  if (isNone(value)) {
    return 0
  }
  if (isPercentage(value)) {
    return parsePercentage(value)
  }
  if (index < 3) {
    return parseFloat(value) / 255
  }
  // Estaríamos parseando el canal alpha.
  return Math.max(0, Math.min(1, parseFloat(value)))
}

export function isRGBA(color) {
  const matches = color.match(/^(rgba?)\((.*?)\)$/i)
  if (matches) {
    const [, model, values] = matches
    const channels = values.split(/\s*[,/ ]\s*/g)
    if (model === 'rgba' && channels.length < 4) {
      return false
    }
    return channels.every(channel => isChannel(channel))
  }
  return false
}

export function parseRGBA(color) {
  const matches = color.match(/^(rgba?)\((.*?)\)$/i)
  if (matches) {
    const [, model, values] = matches
    const channels = values.split(/\s*[,/ ]\s*/g)
    if (!channels.every((channel) => isChannel(channel))) {
      throw new Error('Invalid channel values')
    }
    if (model === 'rgba' && channels.length < 4) {
      throw new Error('Invalid amount of channels')
    }
    const parsedChannels = channels.map((channel, index) => parseChannel(channel, index))
    if (parsedChannels.length === 3) {
      parsedChannels.push(1)
    }
    return parsedChannels
  }
  throw new Error('Invalid rgb or rgba value')
}

export function isHSLA(color) {
  const matches = color.match(/^(hsla?)\((.*?)\)$/i)
  if (matches) {
    const [, model, values] = matches
    const channels = values.split(/\s*[,/ ]\s*/g)
    if (model === 'hsla' && channels.length < 4) {
      return false
    }
    return channels.every((channel) => isChannel(channel))
  }
  return false
}

export function parseHSLA(color) {
  const matches = color.match(/^(hsla?)\((.*?)\)$/i)
  if (matches) {
    const [, model, values] = matches
    // TODO: we should rethink this because it allows lots of wild stuff.
    const channels = values.split(/\s*[,/ ]\s*/g)
    if (!channels.every((channel) => isChannel(channel))) {
      throw new Error('Invalid channel values')
    }
    if (model === 'hsla' && channels.length < 4) {
      throw new Error('Invalid amount of channels')
    }
    const parsedChannels = channels.map((channel, index) => parseChannel(channel, index))
    if (parsedChannels.length === 3) {
      parsedChannels.push(1)
    }
    return fromHSLA([0, 0, 0, 0], parsedChannels)
  }
  throw new Error('Invalid rgb or rgba value')
}

/**
 * Parses a color.
 *
 * @param {string} color
 * @param {NamedColors} namedColors
 * @returns {Color}
 */
export function parse(color, namedColors = NamedColors) {
  if (isCurrentColor(color)) {
    throw new Error('Error: currentcolor needs to be computed, try using window.getComputedStyle')
  } else if (isNamedColor(color, namedColors)) {
    return parseNamedColor(color, namedColors)
  } else if (isHex(color)) {
    return parseHex(color)
  } else if (isRGBA(color)) {
    return parseRGBA(color)
  } else if (isHSLA(color)) {
    return parseHSLA(color)
  } else {
    throw new Error('Unsupported color definition')
  }
}

/*
parse('#0f0')
parse('#f00f')
parse('#ff00ff')
parse('#000000')
parse('#000000ff')
parse('rgb(255, 0, 0)')
parse('rgb(255, 255, 0)')
parse('rgb(100%, 0%, 0%)')
parse('rgb(100% 0% 0%)')
parse('rgba(100% 0% 0% 100%)')
parse('rgba(255 0 0 255)')
parse('rgba(0,0,0,0)')
parse('hsl(360,0,0)')
parse('hsla(20,50%,100%,1)')
parse('hsla(40,50%,50%,100%)')
parse('hsla(40,50%,50%,1)')
*/

export default {
  isCurrentColor,
  isNamedColor,
  isHex,
  parseHexChannel,
  parseHexChannels,
  parseHex,
  parseNamedColor,
  isPercentage,
  parsePercentage,
  isValue,
  isChannel,
  parseChannel,
  isRGBA,
  parseRGBA,
  isHSLA,
  parseHSLA,
  parse
}
