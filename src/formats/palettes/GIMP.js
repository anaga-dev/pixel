import Color from '../../color/Color'
import ColorParser from '../../color/ColorParser'

/**
 * Loads a GIMP palette file
 *
 * @param {Blob} blob
 * @returns {Promise<Array<Color>>}
 */
export async function load(blob)
{
  const text = await blob.text()
  console.log(text)
  const lines = text.split('\n')
  const [start] = lines
  if (!start.startsWith('GIMP Palette'))
    throw new Error('Invalid palette file')

  const colors = lines.filter(
    (line) => line && !line.startsWith('#') && !line.startsWith('GIMP')
  )

  if (colors.length === 0)
    throw new Error('No colors found in palette file')

  const palette = colors.map((color) => {
    const [r, g, b, hex] = color.split(/\s+/)
    console.log(r, g, b, hex)
    return `#${hex}`
  })

  return palette
}

/**
 * Saves a GIMP palette file
 *
 * @param {Palette} palette
 * @returns {Promise<string>}
 */
export async function save(palette)
{
  let text = 'GIMP Palette\n'
  text += '#Palette Name:\n'
  text += '#Description:\n'
  text += `#Colors: ${palette.length}\n`
  text += palette.map((serializedColor) => {
    const [r, g, b] = ColorParser.parse(serializedColor)
    return `${~~(r * 0xFF)} ${~~(g * 0xFF)} ${~~(b * 0xFF)} ${serializedColor.slice(1)}`
  }).join('\n')
  return text
}

export default {
  load,
  save
}
