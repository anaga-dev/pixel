export function isFractionDigits(fractionDigits) {
  return (
    Number.isFinite(fractionDigits) &&
    Number.isSafeInteger(fractionDigits) &&
    fractionDigits >= 0
  )
}

export default isFractionDigits
