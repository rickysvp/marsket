import { ArrowUpRight, CircleHelp, Grid2X2, List, Search } from 'lucide-react'
import { useState } from 'react'
import { filterGames, rankSlotGames } from '../data/games.js'
import { navigate } from '../router.js'

const themes = {
  casino: { eyebrow: 'LIVE CASINO', title: '真人娱乐', desc: '桌台、路单与多种真人游戏的演示目录', hero: '沉浸桌台，尽在眼前。', tabs: ['优选', '好路', '百家乐', '多台', '龙虎', '骰宝', '真人秀', '轮盘'] },
  board: { eyebrow: 'BOARD & ARCADE', title: '棋牌游艺', desc: '捕鱼、麻将、扑克和多人牌局', hero: '多一种玩法，多一份乐趣。', tabs: ['全部', '捕鱼', '麻将', '扑克', '牛牛', '百人', '其他'] },
  slots: { eyebrow: 'SLOT COLLECTION', title: '老虎机', desc: '探索风格各异的演示游戏', hero: '每次旋转，都有新发现。', tabs: ['全部', '热门', '新品', '推荐', '热赔率', '冷赔率', '最高回报'] },
}
const providerIds = { 'EVOLUTION': 'evo', 'AG LIVE': 'ag', 'SA GAMING': 'sa', JDB: 'jdb', KY: 'ky', 'PG SOFT': 'pg', PRAGMATIC: 'pp' }

export function GameCard({ game, casino = false, list = false }) {
  return <button className={`game-card game-card--${game.cover} ${casino ? 'game-card--table' : ''} ${list ? 'game-card--list' : ''}`} onClick={() => navigate(`/games/${game.providerId}/${game.id}`)}>
    <div className="game-card__art"><span className="game-card__icon">{game.type === 'casino' ? '♠' : game.type === 'slots' ? '✦' : '◈'}</span>{casino && <div className="road-map" aria-label="演示路单">{Array.from({ length: 24 }, (_, i) => <i className={i % 3 ? 'is-blue' : 'is-red'} key={i} />)}</div>}<span className="game-card__tag">{game.available ? game.tag : '暂不可用'}</span></div>
    <div className="game-card__info"><div><strong>{game.name}</strong><small>{game.provider} · {game.category}</small></div><ArrowUpRight size={17} /></div>
    {game.type === 'slots' && <div className="game-card__stats"><span>RTP {game.rtp}%</span><span>波动 {game.volatility}</span><span>{game.lines} 线</span></div>}
    {game.type === 'casino' && <div className="game-card__stats"><span className={`table-dot ${game.available ? '' : 'table-dot--offline'}`} /> {game.table} · {game.available ? `${game.speed} · 演示中` : '暂不可用'}</div>}
  </button>
}

export default function GameLobbies({ type }) {
  const data = themes[type]
  const [category, setCategory] = useState(type === 'casino' ? '优选' : '全部')
  const [provider, setProvider] = useState('all')
  const [query, setQuery] = useState('')
  const [layout, setLayout] = useState('grid')
  const [speed, setSpeed] = useState('全部')
  const [road, setRoad] = useState('全路')
  const base = filterGames({ type })
  const common = filterGames({ type, providerId: provider === 'all' ? undefined : provider, query })
  const categorized = common.filter((game) => {
    if (type === 'casino') {
      if (category === '优选') return ['热门', '推荐'].includes(game.tag)
      if (category === '好路') return ['好路', '百家乐', '多台'].includes(game.category)
      return game.category === category
    }
    if (type === 'slots') return !['热门', '新品', '推荐'].includes(category) || game.tag === category
    return category === '全部' || game.category === category
  })
  const narrowed = type === 'casino' && category === '好路' ? categorized.filter((game) => (speed === '全部' || game.speed === speed) && (road === '全路' || game.roadStyle === road)) : categorized
  const visible = type === 'slots' ? rankSlotGames(narrowed, category) : narrowed
  const availableProviders = [...new Set(base.map((game) => game.provider))]
  const reset = () => { setCategory(type === 'casino' ? '优选' : '全部'); setProvider('all'); setQuery(''); setSpeed('全部'); setRoad('全路') }
  return <div className="games-page">
    <section className={`games-hero games-hero--${type}`}><div><span>{data.eyebrow} / 竞界原创演示</span><h1>{data.hero}</h1><p>{data.desc}</p><button onClick={() => document.querySelector('.games-catalog')?.scrollIntoView({ behavior: 'smooth' })}>探索游戏 <ArrowUpRight size={17} /></button></div><div className="games-hero__symbol">{type === 'casino' ? '♠' : type === 'board' ? '◈' : '✦'}</div></section>
    <div className="games-heading"><div><span className="eyebrow">{data.eyebrow}</span><h2>{data.title} <small>{base.length} 款游戏</small></h2></div><span>示例内容 · 无真实游戏服务</span></div>
    <div className="games-tabs">{data.tabs.map((name) => <button key={name} className={category === name ? 'is-active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div>
    {type === 'casino' && category === '好路' && <div className="road-filters"><span>桌台速度</span>{['全部', '经典', '极速'].map((name) => <button key={name} className={speed === name ? 'is-active' : ''} onClick={() => setSpeed(name)}>{name}</button>)}<span>路单</span>{['全路', '庄路', '闲路'].map((name) => <button key={name} className={road === name ? 'is-active' : ''} onClick={() => setRoad(name)}>{name}</button>)}</div>}
    <div className="games-catalog"><div className="games-controls"><label><Search size={16} /><input placeholder="搜索游戏或供应商" value={query} onChange={(event) => setQuery(event.target.value)} /></label><select aria-label="供应商" value={provider} onChange={(event) => setProvider(event.target.value)}><option value="all">全部供应商</option>{availableProviders.map((name) => <option value={providerIds[name]} key={name}>{name}</option>)}</select><div className="games-controls__view"><button aria-label="网格视图" className={layout === 'grid' ? 'is-active' : ''} onClick={() => setLayout('grid')}><Grid2X2 size={16} /></button><button aria-label="列表视图" className={layout === 'list' ? 'is-active' : ''} onClick={() => setLayout('list')}><List size={16} /></button></div></div>
      {type === 'slots' && <p className="games-data-note"><CircleHelp size={14} /> 热/冷赔率按独立的演示热度排序；最高回报按示例 RTP 排序。RTP、波动性、中奖线与奖池是不同指标。</p>}
      {visible.length ? <div className={`game-grid ${layout === 'list' ? 'game-grid--list' : ''}`}>{visible.map((game) => <GameCard game={game} key={`${game.providerId}/${game.id}`} casino={type === 'casino'} list={layout === 'list'} />)}</div> : <div className="empty-state"><Search size={30} /><strong>没有找到游戏</strong><span>试试其他分类、供应商或搜索词。</span><button onClick={reset}>重置筛选</button></div>}
    </div>
  </div>
}
