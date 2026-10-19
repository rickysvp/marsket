import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowUpRight, BarChart3, Bell, BookOpen, ChevronRight, CircleHelp,
  Compass, MoreHorizontal, Orbit, Search, Settings2, ShieldCheck, Sparkles,
  Trophy, UserRound, WalletCards, X, Zap,
} from 'lucide-react'
import { categories, leaderboard, markets } from './mockData'
import { createSimulationState, executeTrade, loadSimulationState, saveSimulationState } from './simulationStore'

const navItems = [
  { label: '市场观测', path: '/markets', icon: Compass },
  { label: '我的持仓', path: '/portfolio', icon: BarChart3 },
  { label: '星际榜单', path: '/leaderboard', icon: Trophy },
  { label: '个人设置', path: '/profile', icon: UserRound },
]

function useRoute() {
  const [path, setPath] = useState(window.location.pathname || '/markets')
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/markets')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return { path, navigate }
}

function formatMoney(value) {
  return `¥ ${Number(value).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`
}

function formatTime(value) {
  return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

function Sparkline({ values, positive = true, large = false }) {
  const width = 160
  const height = large ? 80 : 42
  const min = Math.min(...values)
  const max = Math.max(...values)
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width
    const y = height - ((value - min) / Math.max(max - min, 1)) * (height - 8) - 4
    return `${x},${y}`
  }).join(' ')
  return (
    <svg className={`sparkline ${large ? 'sparkline--large' : ''}`} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`fill-${positive ? 'up' : 'down'}-${large ? 'large' : 'small'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={positive ? '#c8ff4d' : '#ff735f'} stopOpacity=".22" />
          <stop offset="1" stopColor={positive ? '#c8ff4d' : '#ff735f'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#fill-${positive ? 'up' : 'down'}-${large ? 'large' : 'small'})`} />
      <polyline points={points} fill="none" stroke={positive ? '#c8ff4d' : '#ff735f'} strokeWidth={large ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function App() {
  const { path, navigate } = useRoute()
  const [simulation, setSimulation] = useState(() => loadSimulationState())

  useEffect(() => saveSimulationState(simulation), [simulation])

  const trade = (input) => {
    const result = executeTrade(simulation, input)
    if (result.error) return result.error
    setSimulation(result.state)
    return null
  }

  const activeId = path.startsWith('/markets/') ? path.split('/')[2] : null
  const activeMarket = markets.find((market) => market.id === activeId)
  const page = activeMarket ? <MarketDetail market={activeMarket} simulation={simulation} onTrade={trade} onNavigate={navigate} />
    : path === '/portfolio' ? <Portfolio simulation={simulation} onNavigate={navigate} />
      : path === '/leaderboard' ? <Leaderboard />
        : path === '/profile' ? <Profile simulation={simulation} onReset={() => setSimulation(createSimulationState())} />
          : <MarketsHome onNavigate={navigate} />

  return (
    <div className="app-shell">
      <main className="main-canvas">
        <header className="topbar">
          <button className="brand-lockup" onClick={() => navigate('/markets')} aria-label="返回市场大厅">
            <div className="brand-orbit"><Orbit size={23} strokeWidth={1.7} /></div>
            <div><div className="brand-name">Marsket</div><div className="brand-cn">火星市场</div></div>
          </button>
          <nav className="primary-nav" aria-label="主导航">
            <div className="nav-caption">MISSION CONTROL</div>
            {navItems.map(({ label, path: itemPath, icon: Icon }) => {
              const active = path === itemPath || (itemPath === '/markets' && path.startsWith('/markets'))
              return <button key={itemPath} className={`nav-item ${active ? 'nav-item--active' : ''}`} onClick={() => navigate(itemPath)} title={label}>
                <Icon size={16} strokeWidth={active ? 2.2 : 1.7} /><span>{label}</span>{active && <span className="nav-arrow">↗</span>}
              </button>
            })}
          </nav>
          <div className="breadcrumb"><span>MISSION /</span><strong>{activeMarket ? 'MARKET DETAIL' : path === '/markets' ? 'MARKET OBSERVATORY' : path.slice(1).toUpperCase()}</strong></div>
          <div className="topbar-actions"><span className="topbar-clock">观测时间 2026.10.19 · 14:32</span><button className="icon-btn"><Bell size={17} /><span className="notification-dot" /></button><button className="avatar-button">R</button></div>
        </header>
        {page}
      </main>
    </div>
  )
}

function PageHeading({ kicker, title, description, children }) {
  return <div className="page-heading"><div><div className="eyebrow">{kicker}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{children}</div>
}

function MarketsHome({ onNavigate }) {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const filtered = useMemo(() => markets.filter((market) => (category === 'all' || market.category === category) && market.title.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort === 'volume' ? parseFloat(b.volume.replace(/[^0-9.]/g, '')) - parseFloat(a.volume.replace(/[^0-9.]/g, '')) : sort === 'change' ? b.change - a.change : Number(b.hot) - Number(a.hot)), [category, search, sort])
  const featured = markets.filter((market) => market.hot)
  return <div className="page page--markets">
    <PageHeading kicker="MARKET OBSERVATORY / 01" title={<>今天，人类正在<br /><em>相信什么？</em></>} description="把世界的不确定性，变成可以观察的共识。"
      children={<div className="heading-note"><span className="pulse-line" /><span>LIVE FEED</span><strong>同步中</strong></div>} />
    <div className="market-intro-grid">
      <div className="orbit-panel"><div className="orbit-panel__grid" /><div className="orbit-panel__copy"><span className="panel-tag">MARS / DAY 284</span><h2>共识<br /><span>正在形成</span></h2><p>来自全球观测员的实时信号，聚合成一张关于未来的地图。</p></div><div className="planet planet--one" /><div className="planet planet--two" /><div className="orbit orbit--one" /><div className="orbit orbit--two" /><div className="signal-chip"><span className="signal-chip__number">24</span><span>小时信号<br />+12.8%</span></div></div>
      <div className="signal-column"><div className="section-label"><span>TOP SIGNALS / 精选</span><span>01—03</span></div>{featured.map((market, index) => <button className="signal-row" key={market.id} onClick={() => onNavigate(`/markets/${market.id}`)}><span className="signal-index">0{index + 1}</span><span className="signal-row__copy"><strong>{market.title}</strong><small>{market.categoryLabel} · {market.volume}</small></span><span className="signal-row__prob">{market.yes}%<small>YES</small></span><ChevronRight size={15} /></button>)}<div className="signal-note"><Sparkles size={14} /><span>精选市场由活跃度、流动性与观测员关注度综合生成</span></div></div>
    </div>
    <div className="section-toolbar"><div className="category-tabs">{categories.map((item) => <button key={item.id} onClick={() => setCategory(item.id)} className={category === item.id ? 'active' : ''}>{item.label}<span>{item.count}</span></button>)}</div><div className="market-tools"><label className="search-field"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索市场" />{search && <button onClick={() => setSearch('')}><X size={13} /></button>}</label><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">精选排序</option><option value="volume">交易热度</option><option value="change">变化幅度</option></select></div></div>
    <div className="market-list"><div className="list-header"><span>市场 / MARKET</span><span>概率 / PROBABILITY</span><span>24H</span><span>观测量 / VOLUME</span><span>截止</span></div>{filtered.length ? filtered.map((market, index) => <MarketRow market={market} key={market.id} index={index} onClick={() => onNavigate(`/markets/${market.id}`)} />) : <div className="empty-state"><CircleHelp size={28} /><strong>没有找到匹配的市场</strong><span>试试其他关键词或切换分类</span></div>}</div>
    <div className="disclaimer"><ShieldCheck size={14} /><span>本页所有数据均为演示用途，模拟资金不具备任何现实价值。市场数据为本地仿真，不构成投资建议。</span></div>
  </div>
}

function MarketRow({ market, index, onClick }) {
  const positive = market.change >= 0
  return <button className="market-row" onClick={onClick}><span className="market-row__name"><span className="market-row__index">{String(index + 1).padStart(2, '0')}</span><span><small>{market.eyebrow}</small><strong>{market.title}</strong><em>{market.categoryLabel}</em></span></span><span className="market-row__prob"><span className="prob-bar"><i style={{ width: `${market.yes}%` }} /></span><strong>{market.yes}%</strong><small>YES</small></span><span className={`change ${positive ? 'positive' : 'negative'}`}>{positive ? '+' : ''}{market.change}%</span><span className="market-row__volume">{market.volume}<small><span className="live-dot live-dot--small" /> 活跃</small></span><span className="market-row__end">{market.end}<ChevronRight size={15} /></span></button>
}

function MarketDetail({ market, simulation, onTrade, onNavigate }) {
  const [side, setSide] = useState('YES')
  const [action, setAction] = useState('buy')
  const [amount, setAmount] = useState('100')
  const [feedback, setFeedback] = useState('')
  const held = simulation.positions[market.id]?.[side]?.shares ?? 0
  const handleSubmit = () => { const error = onTrade({ marketId: market.id, side, action, amount, price: market.yes / 100 }); setFeedback(error || `${action === 'buy' ? '买入' : '卖出'} ${side} 成功，已写入模拟账本`); if (!error) setAmount('100') }
  return <div className="page page--detail"><button className="back-link" onClick={() => onNavigate('/markets')}>← 返回市场大厅</button><div className="detail-grid"><div className="detail-main"><div className="detail-meta"><span className="panel-tag">{market.categoryLabel.toUpperCase()} / OBSERVATION</span><span className="market-status"><span className="live-dot" /> LIVE MARKET</span></div><h1>{market.title}</h1><p className="detail-subtitle">{market.subtitle}</p><div className="detail-stats"><div><span>YES 概率</span><strong className="lime-text">{market.yes}%</strong></div><div><span>NO 概率</span><strong>{100 - market.yes}%</strong></div><div><span>24H 变化</span><strong className={market.change >= 0 ? 'positive' : 'negative'}>{market.change >= 0 ? '+' : ''}{market.change}%</strong></div><div><span>观测量</span><strong>{market.volume}</strong></div></div><div className="chart-card"><div className="chart-card__top"><div><span className="eyebrow">PROBABILITY / 30D</span><strong>{market.yes}.00%</strong></div><div className="chart-legend"><span><i className="legend-dot legend-dot--lime" />YES</span><span><i className="legend-dot legend-dot--coral" />NO</span></div></div><Sparkline values={market.spark.concat([market.yes - 2, market.yes + 1])} positive={market.change >= 0} large /><div className="chart-axis"><span>SEP 20</span><span>OCT 01</span><span>OCT 19</span></div></div><div className="detail-info-grid"><div><span>来源</span><strong>{market.source}</strong></div><div><span>截止时间</span><strong>{market.end} · 23:59 UTC</strong></div><div><span>结算方式</span><strong>官方数据源最终值</strong></div></div></div><aside className="trade-card"><div className="trade-card__head"><span className="eyebrow">SIMULATION TERMINAL</span><span className="terminal-lamp"><span className="live-dot" /> DEMO</span></div><div className="trade-tabs"><button className={action === 'buy' ? 'active' : ''} onClick={() => setAction('buy')}>买入</button><button className={action === 'sell' ? 'active sell-active' : ''} onClick={() => setAction('sell')}>卖出</button></div><div className="outcome-toggle"><button className={side === 'YES' ? 'selected yes-selected' : ''} onClick={() => setSide('YES')}><span>YES</span><strong>{market.yes}¢</strong></button><button className={side === 'NO' ? 'selected no-selected' : ''} onClick={() => setSide('NO')}><span>NO</span><strong>{100 - market.yes}¢</strong></button></div><label className="amount-label">{action === 'buy' ? '模拟投入金额' : '卖出份额'}<span>可用 {formatMoney(simulation.balance)}</span></label><div className="amount-input"><span>¥</span><input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} /><span className="amount-unit">{action === 'buy' ? 'CNY' : 'SHARES'}</span></div><div className="trade-summary"><span>预估份额 <strong>{(Number(amount || 0) / (side === 'YES' ? market.yes : 100 - market.yes) * 100).toFixed(2)}</strong></span><span>当前持有 <strong>{held.toFixed(2)}</strong></span></div><button className={`trade-submit ${action === 'sell' ? 'trade-submit--sell' : ''}`} onClick={handleSubmit}>{action === 'buy' ? '模拟买入' : '模拟卖出'} {side}<Zap size={16} fill="currentColor" /></button>{feedback && <div className={`trade-feedback ${feedback.includes('成功') ? 'success' : 'error'}`}>{feedback}</div>}<div className="trade-footnote"><ShieldCheck size={13} /> 虚拟资金 · 不产生真实交易</div></aside></div></div>
}

function Portfolio({ simulation, onNavigate }) {
  const positionEntries = Object.entries(simulation.positions).flatMap(([marketId, sides]) => Object.entries(sides).map(([side, position]) => ({ market: markets.find((item) => item.id === marketId), side, ...position }))).filter((item) => item.market)
  const totalInvested = simulation.activities.filter((item) => item.action === '买入').reduce((sum, item) => sum + item.total, 0)
  return <div className="page page--portfolio"><PageHeading kicker="MY FLIGHT PATH / 02" title={<>我的<br /><em>观测轨迹</em></>} description="每一次选择，都是对未来的一次微小投票。" children={<button className="secondary-button"><WalletCards size={15} /> 账本已同步</button>} /><div className="portfolio-overview"><div className="balance-tile"><span className="eyebrow">虚拟总资产 / SIMULATED NAV</span><strong>{formatMoney(simulation.balance + totalInvested)}</strong><div><span className="positive"><ArrowUpRight size={14} /> +¥ 428.00</span><small>+4.28% 自初始观测</small></div><div className="balance-planet" /></div><div className="mini-stat"><span>可用余额</span><strong>{formatMoney(simulation.balance)}</strong><small>可随时模拟交易</small></div><div className="mini-stat"><span>持仓市场</span><strong>{positionEntries.length}<small> 个</small></strong><small>分布在 {new Set(positionEntries.map((item) => item.market.category)).size} 个主题</small></div><div className="mini-stat"><span>累计观测</span><strong>{simulation.activities.length}</strong><small>笔模拟订单</small></div></div><div className="portfolio-grid"><section className="content-card"><div className="card-heading"><div><span className="eyebrow">OPEN POSITIONS</span><h2>当前持仓</h2></div><button className="text-button" onClick={() => onNavigate('/markets')}>发现新市场 <ChevronRight size={14} /></button></div>{positionEntries.length ? <div className="position-list">{positionEntries.map((item) => <button key={`${item.market.id}-${item.side}`} className="position-row" onClick={() => onNavigate(`/markets/${item.market.id}`)}><span className="position-dot">{item.side}</span><span className="position-copy"><strong>{item.market.title}</strong><small>{item.market.categoryLabel} · 均价 {Math.round(item.averagePrice * 100)}¢</small></span><span className="position-shares"><strong>{item.shares.toFixed(2)}</strong><small>份额</small></span><span className="positive position-pnl">+¥ {(item.shares * (item.market.yes / 100 - item.averagePrice)).toFixed(2)}<small>未实现</small></span><ChevronRight size={15} /></button>)}</div> : <div className="empty-state empty-state--compact"><BarChart3 size={25} /><strong>还没有模拟持仓</strong><span>去市场大厅选择一个你愿意相信的未来</span><button className="secondary-button" onClick={() => onNavigate('/markets')}>开始观测</button></div>}</section><section className="content-card activity-card"><div className="card-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>最近活动</h2></div><MoreHorizontal size={18} /></div>{simulation.activities.length ? simulation.activities.slice(0, 5).map((activity) => <div className="activity-row" key={activity.id}><span className={`activity-icon ${activity.action === '买入' ? 'buy' : 'sell'}`}>{activity.action === '买入' ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}</span><span><strong>{activity.action} {activity.side}</strong><small>{formatTime(activity.createdAt)}</small></span><b>{formatMoney(activity.total)}</b></div>) : <div className="activity-empty">模拟订单会显示在这里</div>}</section></div><div className="disclaimer"><ShieldCheck size={14} /><span>虚拟总资产仅用于产品体验演示，不具备现实货币价值。持仓盈亏按当前仿真概率估算。</span></div></div>
}

function Leaderboard() { return <div className="page"><PageHeading kicker="DEEP SPACE RANKING / 03" title={<>谁在<br /><em>读懂未来？</em></>} description="观察员之间的模拟表现排名，每周一更新。" children={<div className="rank-period"><span className="live-dot" /> 本周观测周期 · W42</div>} /><div className="leaderboard-layout"><div className="podium"><div className="podium-kicker">TOP OBSERVERS / 本周榜首</div><div className="podium-constellation"><div className="star star-a" /><div className="star star-b" /><div className="star star-c" /><div className="constellation-line line-a" /><div className="constellation-line line-b" /><div className="podium-avatar">北</div><div className="podium-ring" /></div><div className="podium-name">北极星_07</div><div className="podium-return">+42.80%</div><div className="podium-score">虚拟净值 ¥ 14,280</div><div className="podium-citation">“我不预测结果，我只观察信号。”</div></div><div className="ranking-table"><div className="ranking-table__head"><span>RANK / 观测员</span><span>周收益</span><span>模拟净值</span></div>{leaderboard.map((person) => <div className={`ranking-row ${person.rank === 1 ? 'ranking-row--top' : ''}`} key={person.rank}><span className={`rank-number ${person.accent || ''}`}>{String(person.rank).padStart(2, '0')}</span><span className="rank-person"><span className={`rank-avatar ${person.accent || ''}`}>{person.avatar}</span><strong>{person.name}</strong></span><span className="positive">{person.return}</span><span>{person.score}</span></div>)}<div className="your-rank"><span>你的当前位置</span><strong>—</strong><span>完成一次模拟交易后加入榜单</span></div></div></div><div className="disclaimer"><Trophy size={14} /><span>榜单只代表虚拟交易表现，不代表真实投资能力或未来收益。</span></div></div> }

function Profile({ simulation, onReset }) { const [resetOpen, setResetOpen] = useState(false); return <div className="page"><PageHeading kicker="PERSONAL OBSERVATORY / 04" title={<>你的<br /><em>观测站</em></>} description="管理你的模拟身份与数据偏好。" /><div className="profile-grid"><section className="profile-card profile-card--hero"><div className="profile-avatar">R</div><div><span className="eyebrow">OBSERVER ID / MARS-042</span><h2>Ricky 的观测站</h2><p>加入火星市场 · 第 18 个观测日</p></div><div className="profile-orbit"><Orbit size={56} /></div></section><section className="profile-card"><div className="card-heading"><div><span className="eyebrow">SIMULATION ACCOUNT</span><h2>模拟账户</h2></div><Settings2 size={18} /></div><div className="profile-setting"><span>初始虚拟余额</span><strong>¥ 10,000</strong></div><div className="profile-setting"><span>当前虚拟余额</span><strong>{formatMoney(simulation.balance)}</strong></div><div className="profile-setting"><span>本地数据状态</span><strong className="positive"><span className="live-dot" /> 已同步</strong></div></section><section className="profile-card profile-card--wide"><div className="card-heading"><div><span className="eyebrow">ABOUT THE STATION</span><h2>关于火星市场</h2></div><BookOpen size={18} /></div><p className="profile-copy">Marsket 是一个面向中文用户的未来观测实验场。我们把来自世界各处的观点、数据与不确定性，放在同一张桌面上。这里的一切交易都是模拟的，唯一真实的是：你对未来的判断。</p><div className="profile-badges"><span><Compass size={14} /> 真实世界数据灵感</span><span><ShieldCheck size={14} /> 虚拟资金隔离</span><span><Zap size={14} /> 轻量快速观测</span></div></section><section className="profile-card danger-card"><div><span className="eyebrow">DATA CONTROLS</span><h2>重置模拟账户</h2><p>清除所有虚拟持仓和活动记录，恢复至初始余额。</p></div>{resetOpen ? <div className="reset-confirm"><span>确定清除全部数据？</span><button onClick={() => { onReset(); setResetOpen(false) }}>确定</button><button onClick={() => setResetOpen(false)}>取消</button></div> : <button className="danger-button" onClick={() => setResetOpen(true)}>重置数据</button>}</section></div></div> }

export default App
