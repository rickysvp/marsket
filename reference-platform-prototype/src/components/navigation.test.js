import { describe, expect, it } from 'vitest'
import { navigation } from './navigation.js'
import { resolveRoute } from '../router.js'

describe('navigation', () => {
  it('contains the researched category groups', () => {
    expect(navigation.map((section) => section.label)).toEqual(['体育', '娱乐', '电子', '账户'])
    expect(navigation.find((section) => section.label === '娱乐').items.map((item) => item.label))
      .toEqual(['真人', '电竞', '棋牌', '彩票'])
  })

  it('points every item to a supported route', () => {
    for (const section of navigation) {
      for (const item of section.items) {
        expect(resolveRoute(item.path).page, item.path).not.toBe('not-found')
      }
    }
  })
})
