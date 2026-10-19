import { describe, expect, it } from 'vitest'
import { createSimulationState, executeTrade } from './simulationStore.js'

describe('Marsket simulation ledger', () => {
  it('buys a position and debits virtual cash', () => {
    const initial = createSimulationState()
    const result = executeTrade(initial, { marketId: 'btc-150k', side: 'YES', action: 'buy', amount: 100, price: 0.42 })

    expect(result.error).toBeUndefined()
    expect(result.state.balance).toBe(9958)
    expect(result.state.positions['btc-150k'].YES).toEqual({ shares: 100, averagePrice: 0.42 })
    expect(result.state.activities[0].type).toBe('买入')
  })

  it('rejects a trade that exceeds available virtual cash', () => {
    const initial = createSimulationState()
    const result = executeTrade(initial, { marketId: 'btc-150k', side: 'YES', action: 'buy', amount: 30000, price: 0.42 })

    expect(result.error).toBe('虚拟余额不足')
    expect(result.state).toEqual(initial)
  })

  it('sells only shares that are currently held', () => {
    const initial = createSimulationState()
    const bought = executeTrade(initial, { marketId: 'btc-150k', side: 'YES', action: 'buy', amount: 100, price: 0.42 }).state
    const sold = executeTrade(bought, { marketId: 'btc-150k', side: 'YES', action: 'sell', amount: 40, price: 0.58 })

    expect(sold.error).toBeUndefined()
    expect(sold.state.balance).toBe(9981.2)
    expect(sold.state.positions['btc-150k'].YES.shares).toBe(60)
  })

  it('supports buying and selling a virtual US stock position', () => {
    const initial = createSimulationState()
    const bought = executeTrade(initial, { marketId: 'aapl-stock', side: 'AAPL', instrument: 'stock', action: 'buy', amount: 500, price: 210 }).state
    const sold = executeTrade(bought, { marketId: 'aapl-stock', side: 'AAPL', instrument: 'stock', action: 'sell', amount: 1, price: 215 })

    expect(bought.balance).toBe(9500)
    expect(bought.positions['aapl-stock'].AAPL).toEqual({ shares: 2.380952380952381, averagePrice: 210 })
    expect(sold.state.balance).toBe(9715)
    expect(sold.state.positions['aapl-stock'].AAPL.shares).toBeCloseTo(1.38095, 4)
  })
})
