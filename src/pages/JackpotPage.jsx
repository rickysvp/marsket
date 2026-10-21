import { ArrowUpRight, Coins, Trophy } from 'lucide-react'
import { useState } from 'react'
import { filterGames } from '../data/games.js'
import { navigate } from '../router.js'

const format = (value) => `¥ ${value.toLocaleString('zh-CN')}`
export default function JackpotPage() {
  const games = filterGames({ type:'slots' }).filter((game) => game.jackpot)
  const providers = ['全部', ...new Set(games.map((game) => game.provider))]
  const [provider, setProvider] = useState('全部')
  const visible = provider === '全部' ? games : games.filter((game) => game.provider === provider)
  const total = visible.reduce((sum,game) => sum + game.jackpot,0)
  return <div className="games-page"><section className="jackpot-hero"><div><span className="eyebrow">JACKPOT SHOWCASE</span><h1>奖池中心</h1><p>浏览不同供应商与游戏的演示奖池数据</p><strong>{format(total)}</strong><small>当前筛选奖池示例总额 · 非实时数据</small></div><Coins size={98} /></section><div className="games-heading"><div><span className="eyebrow">PROVIDERS</span><h2>供应商奖池</h2></div><span>金额均为演示数据</span></div><div className="games-tabs">{providers.map((name) => <button key={name} className={provider === name ? 'is-active' : ''} onClick={() => setProvider(name)}>{name}</button>)}</div><div className="jackpot-list">{visible.map((game,index) => <button key={`${game.providerId}/${game.id}`} onClick={() => navigate(`/games/${game.providerId}/${game.id}`)}><span className="jackpot-list__rank"><Trophy size={18} /></span><span><strong>{game.name}</strong><small>{game.provider} · RTP {game.rtp}%</small></span><b>{format(game.jackpot)}</b><ArrowUpRight size={17} /></button>)}</div></div>
}
