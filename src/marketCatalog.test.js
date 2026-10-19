import { describe, expect, it } from 'vitest'
import { categories, markets } from './mockData'

describe('Marsket market catalog', () => {
  it('includes crypto, US stocks, sports, and esports categories', () => {
    expect(categories.map((item) => item.id)).toEqual(expect.arrayContaining(['crypto', 'stocks', 'sports', 'esports']))
    expect(markets.some((market) => market.kind === 'stock' && market.symbol === 'AAPL')).toBe(true)
    expect(markets.some((market) => market.category === 'esports')).toBe(true)
  })
})
