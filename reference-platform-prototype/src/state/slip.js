export function addOrToggleSelection(items, item) {
  return items.some((entry) => entry.id === item.id) ? items.filter((entry) => entry.id !== item.id) : [...items.filter((entry) => entry.eventId !== item.eventId), { ...item, acceptedOdds: item.odds, needsConfirmation: false }]
}
export function removeSelection(items, id) { return items.filter((item) => item.id !== id) }
export function setStake(value) { return Math.max(0, Number(value) || 0) }
export function getSlipSummary(items, mode, stake) {
  const valid = mode === 'parlay' ? items.length >= 2 : items.length >= 1
  const chosen = mode === 'parlay' ? items : items.slice(0, 1)
  const multiple = chosen.reduce((total, item) => total * item.odds, 1)
  return { canPreview: valid, returnAmount: valid && stake > 0 ? Math.round(stake * multiple * 100) / 100 : 0, multiple }
}
export function markOddsChanged(items, id, odds) { return items.map((item) => item.id === id ? { ...item, odds, needsConfirmation: true } : item) }
export function confirmOdds(items) { return items.map((item) => ({ ...item, acceptedOdds: item.odds, needsConfirmation: false })) }
