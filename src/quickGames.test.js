import { describe, expect, it } from 'vitest'
import { createQuickRound, createSimulationState, getQuickRoundStatus, placeQuickBet, settleQuickRound } from './simulationStore'

const asset = { symbol: 'AAPL', name: 'Apple Inc.', price: 210.35 }

describe('quick game rounds', () => {
  it('creates deterministic rounds with a ten second lock window', () => {
    const now = Date.UTC(2026, 9, 19, 12, 0, 35)
    const first = createQuickRound({ asset, mode: 'direction', duration: 5, now })
    const second = createQuickRound({ asset, mode: 'direction', duration: 5, now: now + 1000 })

    expect(first.id).toBe(second.id)
    expect(first.locksAt).toBe(first.settlesAt - 10_000)
    expect(first.outcomes).toEqual(['UP', 'DOWN'])
    expect(first.odds.UP).toBeGreaterThan(1)
  })

  it('moves a round from open to locked to settled', () => {
    const now = Date.UTC(2026, 9, 19, 12, 0, 35)
    const round = createQuickRound({ asset, mode: 'digit', duration: 1, now })

    expect(getQuickRoundStatus(round, round.opensAt + 20_000)).toBe('open')
    expect(getQuickRoundStatus(round, round.locksAt)).toBe('locked')
    expect(getQuickRoundStatus(round, round.settlesAt)).toBe('settled')
    expect(round.outcomes).toHaveLength(10)
  })

  it('places a bet, settles it once, and prevents duplicate settlement', () => {
    const now = Date.UTC(2026, 9, 19, 12, 0, 35)
    const round = createQuickRound({ asset, mode: 'direction', duration: 1, now })
    const state = createSimulationState()
    const placed = placeQuickBet(state, { round, outcome: round.result, stake: 100, now: round.opensAt + 1_000 })

    expect(placed.error).toBeUndefined()
    expect(placed.state.balance).toBe(9900)
    const settled = settleQuickRound(placed.state, round, round.settlesAt)
    expect(settled.state.quickHistory).toHaveLength(1)
    expect(settled.state.balance).toBeGreaterThan(9900)
    const repeated = settleQuickRound(settled.state, round, round.settlesAt + 1)
    expect(repeated.state).toEqual(settled.state)
  })
})
