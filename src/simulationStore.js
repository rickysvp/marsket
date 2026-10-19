const STARTING_BALANCE = 10000

export function createSimulationState() {
  return {
    balance: STARTING_BALANCE,
    positions: {},
    activities: [],
  }
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
    return saved ? { ...createSimulationState(), ...JSON.parse(saved) } : createSimulationState()
  } catch {
    return createSimulationState()
  }
}

export function saveSimulationState(state, storage = globalThis.localStorage) {
  storage?.setItem('marsket-simulation-state', JSON.stringify(state))
}
