import { describe, expect, it } from 'vitest'
import { addOrToggleSelection, removeSelection, setStake, getSlipSummary, markOddsChanged, confirmOdds, applyKeypad } from './slip.js'

const a = { id: 'a', eventId: 'f1', eventName: 'A VS B', marketName: '独赢', label: 'A', odds: 1.8 }
const b = { id: 'b', eventId: 'f2', eventName: 'C VS D', marketName: '独赢', label: 'C', odds: 2 }

describe('演示选择单', () => {
  it('重复点击切换选中，且可以移除', () => {
    expect(addOrToggleSelection([a], a)).toEqual([])
    expect(removeSelection([a, b], 'a')).toEqual([b])
  })
  it('金额不可为负，单注计算预估回报', () => {
    expect(setStake(-5)).toBe(0)
    expect(getSlipSummary([a], 'single', 100).returnAmount).toBe(180)
  })
  it('数字键盘支持小数与退格，不接受重复小数点', () => {
    expect(applyKeypad('12', '.')).toBe('12.')
    expect(applyKeypad('12.', '5')).toBe('12.5')
    expect(applyKeypad('12.5', '.')).toBe('12.5')
    expect(applyKeypad('12.5', 'backspace')).toBe('12.')
  })
  it('串场至少需要两场', () => {
    expect(getSlipSummary([a], 'parlay', 100).canPreview).toBe(false)
    expect(getSlipSummary([a, b], 'parlay', 100).returnAmount).toBe(360)
  })
  it('多场单注按每注金额分别计算并汇总', () => {
    expect(getSlipSummary([a, b], 'single', 100).returnAmount).toBe(380)
    expect(getSlipSummary([a, b], 'single', 100).stakeTotal).toBe(200)
  })
  it('赔率变化需要重新确认', () => {
    const changed = markOddsChanged([a], 'a', 1.9)
    expect(changed[0].needsConfirmation).toBe(true)
    expect(confirmOdds(changed)[0].needsConfirmation).toBe(false)
    expect(confirmOdds(changed)[0].odds).toBe(1.9)
  })
})
