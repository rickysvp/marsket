export function addOrToggleSelection(items, item) {
  return items.some((entry) => entry.id === item.id) ? items.filter((entry) => entry.id !== item.id) : [...items.filter((entry) => entry.eventId !== item.eventId), { ...item, acceptedOdds: item.odds, needsConfirmation: false }]
}
export function removeSelection(items, id) { return items.filter((item) => item.id !== id) }
export function setStake(value) { return Math.max(0, Number(value) || 0) }
export function applyKeypad(current, key) {
  const value = String(current ?? '')
  if (key === 'backspace') return value.slice(0, -1)
  if (key === '.') return value.includes('.') ? value : `${value || '0'}.`
  if (!/^\d$/.test(key)) return value
  if (value.replace('.', '').length >= 8) return value
  if (value.includes('.') && value.split('.')[1].length >= 2) return value
  return value === '0' ? key : `${value}${key}`
}
export function getSlipSummary(items, mode, stake) {
  const valid = mode === 'parlay' ? items.length >= 2 : items.length >= 1
  const multiple = mode === 'parlay' ? items.reduce((total, item) => total * item.odds, 1) : items.reduce((total, item) => total + item.odds, 0)
  const stakeTotal = valid ? stake * (mode === 'parlay' ? 1 : items.length) : 0
  return { canPreview: valid, returnAmount: valid && stake > 0 ? Math.round(stake * multiple * 100) / 100 : 0, multiple, stakeTotal }
}
export function markOddsChanged(items, id, odds) { return items.map((item) => item.id === id ? { ...item, odds, needsConfirmation: true } : item) }
export function confirmOdds(items) { return items.map((item) => ({ ...item, acceptedOdds: item.odds, needsConfirmation: false })) }
