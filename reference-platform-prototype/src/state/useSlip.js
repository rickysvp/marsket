import { useState } from 'react'
import { addOrToggleSelection, removeSelection, setStake, markOddsChanged, confirmOdds } from './slip.js'

export function useSlip() {
  const [items, setItems] = useState([])
  const [mode, setMode] = useState('single')
  const [stake, updateStake] = useState(0)
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const select = (event, market, selection) => {
    const item = { id: selection.id, eventId: event.id, eventName: `${event.home} VS ${event.away}`, marketName: market.name, label: selection.line ? `${selection.label} ${selection.line}` : selection.label, odds: selection.odds }
    setItems((current) => addOrToggleSelection(current, item))
    setOpen(true)
    setNotice('')
    return true
  }
  const simulate = () => { if (items.length) { setItems((current) => markOddsChanged(current, current[0].id, Math.round((current[0].odds + 0.08) * 100) / 100)); setOpen(true) } }
  return { items, mode, setMode, stake, setStake: (value) => updateStake(setStake(value)), open, setOpen, notice, setNotice, select, remove: (id) => setItems((current) => removeSelection(current, id)), simulate, confirm: () => setItems((current) => confirmOdds(current)), clear: () => { setItems([]); updateStake(0) } }
}
