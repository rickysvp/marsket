const STARTING_BALANCE = 10000

export function createSimulationState() {
  return {
    balance: STARTING_BALANCE,
    positions: {},
    activities: [],
    quickBets: [],
    quickHistory: [],
    quickSettled: [],
  }
}

function stableHash(value) {
  let hash = 2166136261
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function getQuickRoundStatus(round, now = Date.now()) {
  if (now < round.locksAt) return 'open'
  if (now < round.settlesAt) return 'locked'
  return 'settled'
}

export function createQuickRound({ asset, mode, duration, now = Date.now() }) {
  const durationMs = Number(duration) * 60_000
  const opensAt = Math.floor(now / durationMs) * durationMs
  const id = `${asset.symbol}-${mode}-${duration}-${opensAt}`
  const drift = ((stableHash(`${id}:price`) % 1401) - 700) / 100_000
  const openPrice = Number(asset.price)
  const closePrice = Number((openPrice * (1 + drift)).toFixed(2))
  const outcomes = mode === 'direction' ? ['UP', 'DOWN'] : mode === 'digit' ? Array.from({ length: 10 }, (_, index) => String(index)) : [...Array.from({ length: 10 }, (_, index) => String(index)), ...'ABCDEF']
  const result = mode === 'direction'
    ? closePrice >= openPrice ? 'UP' : 'DOWN'
    : mode === 'digit'
      ? String(Math.abs(Math.round(closePrice * 10)) % 10)
      : '0123456789ABCDEF'[stableHash(`${id}:result`) % 16]
  const baseOdds = mode === 'direction' ? 1.9 : mode === 'digit' ? 9.5 : 15.2
  const pools = Object.fromEntries(outcomes.map((outcome) => [outcome, 1000 + (stableHash(`${id}:${outcome}`) % 240)]))
  const totalPool = Object.values(pools).reduce((sum, value) => sum + value, 0)
  const odds = Object.fromEntries(outcomes.map((outcome) => [outcome, Number(Math.max(1.01, (totalPool / pools[outcome]) * (baseOdds / (totalPool / 1000))).toFixed(2))]))
  return {
    id, asset: asset.name, symbol: asset.symbol, mode, duration, roundId: id,
    opensAt, locksAt: opensAt + durationMs - 10_000, settlesAt: opensAt + durationMs,
    openPrice, closePrice, status: getQuickRoundStatus({ locksAt: opensAt + durationMs - 10_000, settlesAt: opensAt + durationMs }, now),
    result, outcomes, odds, pools,
  }
}

export function placeQuickBet(state, { round, outcome, stake, odds, now = Date.now() }) {
  const numericStake = Number(stake)
  if (!Number.isFinite(numericStake) || numericStake <= 0) return { state, error: '请输入有效金额' }
  const status = getQuickRoundStatus(round, now)
  if (status === 'locked') return { state, error: '本轮已封盘' }
  if (status === 'settled') return { state, error: '本轮已结束' }
  if (!round.outcomes.includes(outcome)) return { state, error: '请选择有效结果' }
  if (numericStake > state.balance) return { state, error: '虚拟余额不足' }
  const next = structuredClone(state)
  next.balance -= numericStake
  next.quickBets ??= []
  next.quickBets.unshift({ id: `${round.id}-${now}-${next.quickBets.length}`, roundId: round.id, outcome, stake: numericStake, odds: Number(odds ?? round.odds[outcome]), createdAt: new Date(now).toISOString(), status: 'open' })
  return { state: next }
}

export function settleQuickRound(state, round, now = Date.now()) {
  if (now < round.settlesAt || state.quickSettled?.includes(round.id)) return { state }
  const next = structuredClone(state)
  next.quickBets ??= []
  next.quickHistory ??= []
  next.quickSettled ??= []
  let payoutTotal = 0
  const bets = next.quickBets.filter((bet) => bet.roundId === round.id)
  next.quickBets = next.quickBets.map((bet) => {
    if (bet.roundId !== round.id || bet.status !== 'open') return bet
    const payout = bet.outcome === round.result ? Number((bet.stake * bet.odds).toFixed(2)) : 0
    payoutTotal += payout
    return { ...bet, status: 'settled', payout, result: round.result, settledAt: new Date(now).toISOString() }
  })
  next.balance += payoutTotal
  next.quickHistory.unshift({ roundId: round.id, result: round.result, settledAt: new Date(now).toISOString(), bets })
  next.quickSettled.push(round.id)
  return { state: next }
}

export function executeTrade(state, { marketId, side, instrument = 'prediction', action, amount, price }) {
  const numericAmount = Number(amount)
  const numericPrice = Number(price)

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return { state, error: '请输入有效的模拟金额' }
  }

  const position = state.positions[marketId]?.[side]
  const isStock = instrument === 'stock'
  const quantity = isStock && action === 'buy' ? numericAmount / numericPrice : numericAmount
  const cost = isStock ? numericAmount * (action === 'sell' ? 1 : 1) : numericAmount * numericPrice

  if (action === 'buy' && cost > state.balance) {
    return { state, error: '虚拟余额不足' }
  }

  if (action === 'sell' && (!position || position.shares < numericAmount)) {
    return { state, error: '可卖持仓不足' }
  }

  const next = structuredClone(state)
  const marketPosition = next.positions[marketId] ?? {}
  const current = marketPosition[side]

  if (action === 'buy') {
    const shares = (current?.shares ?? 0) + quantity
    const totalCost = (current?.shares ?? 0) * (current?.averagePrice ?? 0) + cost
    marketPosition[side] = { shares, averagePrice: totalCost / shares }
    next.balance -= cost
  } else {
    const shares = current.shares - quantity
    if (shares <= 0) {
      delete marketPosition[side]
    } else {
      marketPosition[side] = current
      marketPosition[side].shares = shares
    }
    next.balance += isStock ? numericAmount * numericPrice : cost
  }

  if (Object.keys(marketPosition).length) next.positions[marketId] = marketPosition
  else delete next.positions[marketId]

  next.activities.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    marketId,
    side,
    action: action === 'buy' ? '买入' : '卖出',
    type: action === 'buy' ? '买入' : '卖出',
    amount: numericAmount,
    price: numericPrice,
    total: cost,
    createdAt: new Date().toISOString(),
  })

  return { state: next }
}

export function loadSimulationState(storage = globalThis.localStorage) {
  if (!storage) return createSimulationState()
  try {
    const saved = storage.getItem('marsket-simulation-state')
    const parsed = saved ? JSON.parse(saved) : {}
    return { ...createSimulationState(), ...parsed, quickBets: parsed.quickBets ?? [], quickHistory: parsed.quickHistory ?? [], quickSettled: parsed.quickSettled ?? [] }
  } catch {
    return createSimulationState()
  }
}

export function saveSimulationState(state, storage = globalThis.localStorage) {
  storage?.setItem('marsket-simulation-state', JSON.stringify(state))
}
