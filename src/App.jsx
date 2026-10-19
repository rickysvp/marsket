import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowUpRight, BarChart3, BookOpen, ChevronRight, CircleHelp,
  Compass, MoreHorizontal, Orbit, Search, Settings2, ShieldCheck, Sparkles,
  Trophy, WalletCards, X, Zap,
} from 'lucide-react'
import { categories, leaderboard, markets } from './mockData'
import { createSimulationState, executeTrade, loadSimulationState, saveSimulationState } from './simulationStore'

const navItems = [
  { label: '市场', path: '/markets', icon: Compass },
  { label: '我的持仓', path: '/portfolio', icon: BarChart3 },
  { label: '排行榜', path: '/leaderboard', icon: Trophy },
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
            {navItems.map(({ label, path: itemPath, icon: Icon }) => {
              const active = path === itemPath || (itemPath === '/markets' && path.startsWith('/markets'))
              return <button key={itemPath} className={`nav-item ${active ? 'nav-item--active' : ''}`} onClick={() => navigate(itemPath)} title={label}>
                <Icon size={16} strokeWidth={active ? 2.2 : 1.7} /><span>{label}</span>{active && <span className="nav-arrow">↗</span>}
              </button>
            })}
          </nav>
          <div className="topbar-actions"><button className={`account-trigger ${path === '/profile' ? 'account-trigger--active' : ''}`} onClick={() => navigate('/profile')} aria-label="我的账户"><span className="avatar-button">R</span><span className="avatar-label">我的账户</span></button></div>
        </header>
        {page}
        <Footer onNavigate={navigate} />
      </main>
    </div>
  )
}

function PageHeading({ kicker, title, description, children }) {
  return <div className="page-heading"><div><div className="eyebrow">{kicker}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{children}</div>
}

function Footer({ onNavigate }) {
  return <footer className="site-footer"><div className="site-footer__main"><button className="site-footer__brand" onClick={() => onNavigate('/markets')} aria-label="返回市场大厅"><span className="brand-orbit"><Orbit size={18} strokeWidth={1.7} /></span><span><strong>Marsket</strong><small>火星市场</small></span></button><p>面向中文用户的预测市场。<br />用数据理解未来，用判断参与市场。</p><div className="site-footer__links"><button onClick={() => onNavigate('/markets')}>市场</button><button onClick={() => onNavigate('/portfolio')}>我的持仓</button><button onClick={() => onNavigate('/leaderboard')}>排行榜</button><button onClick={() => onNavigate('/profile')}>我的账户</button></div></div><div className="site-footer__bottom"><span>© 2026 Marsket · 火星市场</span><span>Demo 数据 · 不产生真实交易 · 不构成投资建议</span></div></footer>
}

function MarketsHome({ onNavigate }) {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const filtered = useMemo(() => markets.filter((market) => (category === 'all' || market.category === category) && market.title.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort === 'volume' ? parseFloat(b.volume.replace(/[^0-9.]/g, '')) - parseFloat(a.volume.replace(/[^0-9.]/g, '')) : sort === 'change' ? b.change - a.change : Number(b.hot) - Number(a.hot)), [category, search, sort])
  const featured = markets.filter((market) => market.hot).slice(0, 3)
  return <div className="page page--markets">
    <PageHeading kicker="MARKETS" title={<>今天，大家在<br /><em>预测什么？</em></>} description="把世界的不确定性，变成清晰、可参与的市场。"
      children={<div className="heading-note"><span className="pulse-line" /><span>LIVE FEED</span><strong>同步中</strong></div>} />
    <div className="market-intro-grid">
      <div className="orbit-panel"><div className="orbit-panel__grid" /><div className="orbit-panel__copy"><span className="panel-tag">MARKET / TODAY</span><h2>市场共识<br /><span>正在形成</span></h2><p>来自全球用户的判断，聚合成一张关于未来的市场地图。</p></div><div className="planet planet--one" /><div className="planet planet--two" /><div className="orbit orbit--one" /><div className="orbit orbit--two" /><div className="signal-chip"><span className="signal-chip__number">24</span><span>小时成交<br />+12.8%</span></div></div>
      <div className="signal-column"><div className="section-label"><span>FEATURED MARKETS / 精选</span></div>{featured.map((market, index) => <button className="signal-row" key={market.id} onClick={() => onNavigate(`/markets/${market.id}`)}><span className="signal-index">0{index + 1}</span><span className="signal-row__copy"><strong>{market.title}</strong><small>{market.categoryLabel} · {market.volume}</small></span><span className="signal-row__prob">{market.kind === 'stock' ? `$${market.price.toFixed(2)}` : `${market.yes}%`}<small>{market.kind === 'stock' ? market.symbol : 'YES'}</small></span><ChevronRight size={15} /></button>)}<div className="signal-note"><Sparkles size={14} /><span>精选市场按成交量、活跃度与用户关注度综合生成</span></div></div>
    </div>
    <div className="section-toolbar"><div className="category-tabs">{categories.map((item) => <button key={item.id} onClick={() => setCategory(item.id)} className={category === item.id ? 'active' : ''}>{item.label}<span>{item.count}</span></button>)}</div><div className="market-tools"><label className="search-field"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索市场" />{search && <button onClick={() => setSearch('')}><X size={13} /></button>}</label><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">精选排序</option><option value="volume">交易热度</option><option value="change">变化幅度</option></select></div></div>
    <div className="market-list"><div className="list-header"><span>市场 / MARKET</span><span>概率 / 价格</span><span>24H</span><span>成交量 / VOLUME</span><span>截止 / 状态</span></div>{filtered.length ? filtered.map((market, index) => <MarketRow market={market} key={market.id} index={index} onClick={() => onNavigate(`/markets/${market.id}`)} />) : <div className="empty-state"><CircleHelp size={28} /><strong>没有找到匹配的市场</strong><span>试试其他关键词或切换分类</span></div>}</div>
    <div className="disclaimer"><ShieldCheck size={14} /><span>市场数据仅用于 Demo 展示，详情以页面数据为准。</span></div>
  </div>
}

function MarketRow({ market, index, onClick }) {
  const positive = market.change >= 0
  const stock = market.kind === 'stock'
  return <button className="market-row" onClick={onClick}><span className="market-row__name"><span className="market-row__index">{String(index + 1).padStart(2, '0')}</span><span><small>{market.eyebrow}</small><strong>{market.title}</strong><em>{market.categoryLabel}</em></span></span><span className="market-row__prob">{stock ? <><strong>${market.price.toFixed(2)}</strong><small>{market.symbol}</small></> : <><span className="prob-bar"><i style={{ width: `${market.yes}%` }} /></span><strong>{market.yes}%</strong><small>YES</small></>}</span><span className={`change ${positive ? 'positive' : 'negative'}`}>{positive ? '+' : ''}{market.change}%</span><span className="market-row__volume">{market.volume}<small><span className="live-dot live-dot--small" /> 活跃</small></span><span className="market-row__end">{market.end}<ChevronRight size={15} /></span></button>
}

function MarketDetail({ market, simulation, onTrade, onNavigate }) {
  const isStock = market.kind === 'stock'
  const [side, setSide] = useState('YES')
  const [action, setAction] = useState('buy')
  const [amount, setAmount] = useState('100')
  const [feedback, setFeedback] = useState('')
  const tradeSide = isStock ? market.symbol : side
  const tradePrice = isStock ? market.price : (side === 'YES' ? market.yes : 100 - market.yes) / 100
  const held = simulation.positions[market.id]?.[tradeSide]?.shares ?? 0
  const handleSubmit = () => { const error = onTrade({ marketId: market.id, side: tradeSide, instrument: isStock ? 'stock' : 'prediction', action, amount, price: tradePrice }); setFeedback(error || `${action === 'buy' ? '买入' : '卖出'} ${tradeSide} 成功，已写入账户记录`); if (!error) setAmount('100') }
  const estimatedShares = isStock ? (action === 'buy' ? Number(amount || 0) / market.price : Number(amount || 0)) : Number(amount || 0) / tradePrice
  return <div className="page page--detail"><button className="back-link" onClick={() => onNavigate('/markets')}>← 返回市场大厅</button><div className="detail-grid"><div className="detail-main"><div className="detail-meta"><span className="panel-tag">{market.categoryLabel.toUpperCase()} / MARKET</span><span className="market-status"><span className="live-dot" /> {isStock ? 'QUOTE MARKET' : 'LIVE MARKET'}</span></div><h1>{market.title}</h1><p className="detail-subtitle">{market.subtitle}</p><div className="detail-stats">{isStock ? <><div><span>当前价格</span><strong className="lime-text">${market.price.toFixed(2)}</strong></div><div><span>24H 变化</span><strong className={market.change >= 0 ? 'positive' : 'negative'}>{market.change >= 0 ? '+' : ''}{market.change}%</strong></div><div><span>虚拟股代码</span><strong>{market.symbol}</strong></div><div><span>成交量</span><strong>{market.volume}</strong></div></> : <><div><span>YES 概率</span><strong className="lime-text">{market.yes}%</strong></div><div><span>NO 概率</span><strong>{100 - market.yes}%</strong></div><div><span>24H 变化</span><strong className={market.change >= 0 ? 'positive' : 'negative'}>{market.change >= 0 ? '+' : ''}{market.change}%</strong></div><div><span>成交量</span><strong>{market.volume}</strong></div></>}</div><div className="chart-card"><div className="chart-card__top"><div><span className="eyebrow">{isStock ? 'PRICE / 30D' : 'PROBABILITY / 30D'}</span><strong>{isStock ? `$${market.price.toFixed(2)}` : `${market.yes}.00%`}</strong></div><div className="chart-legend"><span><i className="legend-dot legend-dot--lime" />{isStock ? market.symbol : 'YES'}</span>{!isStock && <span><i className="legend-dot legend-dot--coral" />NO</span>}</div></div><Sparkline values={market.spark.concat(isStock ? [market.price * 1.01] : [market.yes - 2, market.yes + 1])} positive={market.change >= 0} large /><div className="chart-axis"><span>30 天前</span><span>15 天前</span><span>现在</span></div></div><div className="detail-info-grid"><div><span>数据来源</span><strong>{market.source}</strong></div><div><span>{isStock ? '交易状态' : '截止时间'}</span><strong>{isStock ? '美股交易时段' : `${market.end} · 23:59 UTC`}</strong></div><div><span>{isStock ? '产品类型' : '结算方式'}</span><strong>{isStock ? '价格跟踪产品' : '官方数据源最终值'}</strong></div></div></div><aside className="trade-card"><div className="trade-card__head"><span className="eyebrow">{isStock ? 'VIRTUAL STOCK' : 'PREDICTION MARKET'}</span><span className="terminal-lamp"><span className="live-dot" /> DEMO</span></div><div className="trade-tabs"><button className={action === 'buy' ? 'active' : ''} onClick={() => setAction('buy')}>买入</button><button className={action === 'sell' ? 'active sell-active' : ''} onClick={() => setAction('sell')}>卖出</button></div>{isStock ? <div className="stock-quote"><span className="stock-quote__symbol">{market.symbol}</span><span><strong>${market.price.toFixed(2)}</strong><small className={market.change >= 0 ? 'positive' : 'negative'}>{market.change >= 0 ? '+' : ''}{market.change}% 今日</small></span></div> : <div className="outcome-toggle"><button className={side === 'YES' ? 'selected yes-selected' : ''} onClick={() => setSide('YES')}><span>YES</span><strong>{market.yes}¢</strong></button><button className={side === 'NO' ? 'selected no-selected' : ''} onClick={() => setSide('NO')}><span>NO</span><strong>{100 - market.yes}¢</strong></button></div>}<label className="amount-label">{isStock ? (action === 'buy' ? '买入金额' : '卖出股数') : (action === 'buy' ? '投入金额' : '卖出份额')}<span>可用 {formatMoney(simulation.balance)}</span></label><div className="amount-input"><span>{isStock ? (action === 'buy' ? '¥' : '#') : '¥'}</span><input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} /><span className="amount-unit">{isStock ? (action === 'buy' ? 'CNY' : 'SHARES') : action === 'buy' ? 'CNY' : 'SHARES'}</span></div><div className="trade-summary"><span>{isStock ? '预计股数' : '预估份额'} <strong>{estimatedShares.toFixed(2)}</strong></span><span>当前持有 <strong>{held.toFixed(2)}</strong></span></div><button className={`trade-submit ${action === 'sell' ? 'trade-submit--sell' : ''}`} onClick={handleSubmit}>{action === 'buy' ? '买入' : '卖出'} {tradeSide}<Zap size={16} fill="currentColor" /></button>{feedback && <div className={`trade-feedback ${feedback.includes('成功') ? 'success' : 'error'}`}>{feedback}</div>}<div className="trade-footnote"><ShieldCheck size={13} /> 本次操作记录在 Demo 账户中</div></aside></div></div>
}

function Portfolio({ simulation, onNavigate }) {
  const positionEntries = Object.entries(simulation.positions).flatMap(([marketId, sides]) => Object.entries(sides).map(([side, position]) => ({ market: markets.find((item) => item.id === marketId), side, ...position }))).filter((item) => item.market)
  const totalInvested = simulation.activities.filter((item) => item.action === '买入').reduce((sum, item) => sum + item.total, 0)
  return <div className="page page--portfolio"><PageHeading kicker="MY PORTFOLIO" title={<>我的<br /><em>持仓组合</em></>} description="管理你的预测仓位和美股虚拟股。" children={<button className="secondary-button"><WalletCards size={15} /> 账本已同步</button>} /><div className="portfolio-overview"><div className="balance-tile"><span className="eyebrow">总资产 / NET ASSET VALUE</span><strong>{formatMoney(simulation.balance + totalInvested)}</strong><div><span className="positive"><ArrowUpRight size={14} /> +¥ 428.00</span><small>+4.28% 组合收益</small></div><div className="balance-planet" /></div><div className="mini-stat"><span>可用余额</span><strong>{formatMoney(simulation.balance)}</strong><small>可随时交易</small></div><div className="mini-stat"><span>持仓品种</span><strong>{positionEntries.length}<small> 个</small></strong><small>预测市场与虚拟股票</small></div><div className="mini-stat"><span>累计交易</span><strong>{simulation.activities.length}</strong><small>笔交易记录</small></div></div><div className="portfolio-grid"><section className="content-card"><div className="card-heading"><div><span className="eyebrow">OPEN POSITIONS</span><h2>持仓明细</h2></div><button className="text-button" onClick={() => onNavigate('/markets')}>发现新市场 <ChevronRight size={14} /></button></div>{positionEntries.length ? <div className="position-list">{positionEntries.map((item) => { const currentPrice = item.market.kind === 'stock' ? item.market.price : (item.side === 'YES' ? item.market.yes : 100 - item.market.yes) / 100; const unit = item.market.kind === 'stock' ? `$${item.averagePrice.toFixed(2)}` : `${Math.round(item.averagePrice * 100)}¢`; const currentUnit = item.market.kind === 'stock' ? `$${currentPrice.toFixed(2)}` : `${Math.round(currentPrice * 100)}¢`; const marketValue = item.shares * currentPrice; const pnl = marketValue - item.shares * item.averagePrice; return <button key={`${item.market.id}-${item.side}`} className="position-row" onClick={() => onNavigate(`/markets/${item.market.id}`)}><span className="position-dot">{item.side}</span><span className="position-copy"><strong>{item.market.title}</strong><small>{item.market.categoryLabel} · 成本 {unit} · 现价 {currentUnit}</small></span><span className="position-shares"><strong>{item.shares.toFixed(2)}</strong><small>{item.market.kind === 'stock' ? '股' : '份额'}</small></span><span className="position-value"><strong>{item.market.kind === 'stock' ? `$${marketValue.toFixed(2)}` : formatMoney(marketValue)}</strong><small>当前市值</small></span><span className={`position-pnl ${pnl >= 0 ? 'positive' : 'negative'}`}>{pnl >= 0 ? '+' : ''}{item.market.kind === 'stock' ? `$${pnl.toFixed(2)}` : formatMoney(pnl)}<small>未实现</small></span><ChevronRight size={15} /></button> })}</div> : <div className="empty-state empty-state--compact"><BarChart3 size={25} /><strong>还没有持仓</strong><span>去市场大厅选择预测市场或购买美股虚拟股票</span><button className="secondary-button" onClick={() => onNavigate('/markets')}>开始交易</button></div>}</section><section className="content-card activity-card"><div className="card-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>最近活动</h2></div><MoreHorizontal size={18} /></div>{simulation.activities.length ? simulation.activities.slice(0, 5).map((activity) => <div className="activity-row" key={activity.id}><span className={`activity-icon ${activity.action === '买入' ? 'buy' : 'sell'}`}>{activity.action === '买入' ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}</span><span><strong>{activity.action} {activity.side}</strong><small>{formatTime(activity.createdAt)}</small></span><b>{formatMoney(activity.total)}</b></div>) : <div className="activity-empty">交易记录会显示在这里</div>}</section></div><div className="disclaimer"><ShieldCheck size={14} /><span>当前页面为 Demo 展示，数据用于体验产品流程。</span></div></div>
}

function Leaderboard() { return <div className="page"><PageHeading kicker="RANKINGS" title={<>谁对未来<br /><em>判断更准？</em></>} description="用户之间的收益排名，每周一更新。" children={<div className="rank-period"><span className="live-dot" /> 本周排名 · W42</div>} /><div className="leaderboard-layout"><div className="podium"><div className="podium-kicker">TOP TRADERS / 本周榜首</div><div className="podium-constellation"><div className="star star-a" /><div className="star star-b" /><div className="star star-c" /><div className="constellation-line line-a" /><div className="constellation-line line-b" /><div className="podium-avatar">北</div><div className="podium-ring" /></div><div className="podium-name">北极星_07</div><div className="podium-return">+42.80%</div><div className="podium-score">净值 ¥ 14,280</div><div className="podium-citation">“先看数据，再做判断。”</div></div><div className="ranking-table"><div className="ranking-table__head"><span>RANK / 用户</span><span>周收益</span><span>净值</span></div>{leaderboard.map((person) => <div className={`ranking-row ${person.rank === 1 ? 'ranking-row--top' : ''}`} key={person.rank}><span className={`rank-number ${person.accent || ''}`}>{String(person.rank).padStart(2, '0')}</span><span className="rank-person"><span className={`rank-avatar ${person.accent || ''}`}>{person.avatar}</span><strong>{person.name}</strong></span><span className="positive">{person.return}</span><span>{person.score}</span></div>)}<div className="your-rank"><span>你的当前位置</span><strong>—</strong><span>完成一次交易后加入榜单</span></div></div></div><div className="disclaimer"><Trophy size={14} /><span>榜单只代表虚拟交易表现，不代表真实投资能力或未来收益。</span></div></div> }

function Profile({ simulation, onReset }) {
  const [resetOpen, setResetOpen] = useState(false)
  const holdings = Object.entries(simulation.positions).flatMap(([marketId, sides]) => Object.entries(sides).map(([side, position]) => {
    const market = markets.find((item) => item.id === marketId)
    if (!market) return null
    const lastPrice = market.kind === 'stock' ? market.price : (side === 'YES' ? market.yes : 100 - market.yes) / 100
    const marketValue = position.shares * lastPrice
    const costValue = position.shares * position.averagePrice
    return { market, side, shares: position.shares, averagePrice: position.averagePrice, lastPrice, marketValue, pnl: marketValue - costValue }
  })).filter(Boolean)
  const totalValue = holdings.reduce((sum, item) => sum + item.marketValue, 0)
  const totalPnl = holdings.reduce((sum, item) => sum + item.pnl, 0)
  const stockCount = holdings.filter((item) => item.market.kind === 'stock').length
  const predictionCount = holdings.length - stockCount
  const totalTrades = simulation.activities.length
  const cashRatio = Math.round((simulation.balance / Math.max(simulation.balance + totalValue, 1)) * 100)
  const positionRatio = 100 - cashRatio
  const resetAccount = () => { onReset(); setResetOpen(false) }

  return <div className="page page--account">
    <PageHeading kicker="ACCOUNT" title={<>我的<br /><em>账户</em></>} description="账户资料、资产概览与交易活动。" children={<span className="account-verified"><ShieldCheck size={14} /> 账户已验证</span>} />
    <section className="account-header-card"><div className="account-user"><div className="profile-avatar">R</div><div><span className="eyebrow">USER ID / USER-042</span><h2>Ricky</h2><p>注册于 2026 年 10 月 · Marsket Demo</p></div></div><div className="account-header-actions"><span><i className="live-dot" /> 数据已同步</span><button className="account-edit"><Settings2 size={15} /> 账户设置</button></div></section>
    <div className="account-kpi-grid"><div className="account-kpi account-kpi--primary"><span>总资产估值</span><strong>{formatMoney(simulation.balance + totalValue)}</strong><small>现金余额 + 持仓市值</small></div><div className="account-kpi"><span>可用余额</span><strong>{formatMoney(simulation.balance)}</strong><small>可用于下一笔交易</small></div><div className="account-kpi"><span>累计交易</span><strong>{totalTrades}</strong><small>笔交易记录</small></div><div className="account-kpi"><span>账户持仓</span><strong>{holdings.length}</strong><small>{predictionCount} 个预测 · {stockCount} 支虚拟股</small></div></div>
    <div className="account-content-grid">
       <section className="account-card account-card--wide asset-overview-card"><div className="account-card__heading"><div><span className="eyebrow">ASSET OVERVIEW</span><h2>资产概览</h2></div><span className="holdings-count">账户净值</span></div><div className="asset-overview-total"><strong>{formatMoney(simulation.balance + totalValue)}</strong><span>当前账户总资产</span></div><div className="asset-bar"><span className="asset-bar__cash" style={{ width: `${cashRatio}%` }} /><span className="asset-bar__positions" style={{ width: `${positionRatio}%` }} /></div><div className="asset-legend"><div><span><i className="asset-dot asset-dot--cash" />可用现金</span><strong>{formatMoney(simulation.balance)} <small>{cashRatio}%</small></strong></div><div><span><i className="asset-dot asset-dot--positions" />持仓市值</span><strong>{formatMoney(totalValue)} <small>{positionRatio}%</small></strong></div></div><div className="asset-summary-grid"><div><span>未实现盈亏</span><strong className={totalPnl >= 0 ? 'positive' : 'negative'}>{totalPnl >= 0 ? '+' : ''}{formatMoney(totalPnl)}</strong></div><div><span>资产类别</span><strong>{predictionCount} 预测 · {stockCount} 支虚拟股</strong></div><div><span>账户单位</span><strong>CNY ¥</strong></div></div><div className="holdings-note"><ShieldCheck size={13} /> 数据用于 Demo 体验</div></section>
      <aside className="account-card recent-trades-card"><div className="account-card__heading"><div><span className="eyebrow">RECENT TRADES</span><h2>最近交易</h2></div><MoreHorizontal size={17} /></div>{simulation.activities.length ? simulation.activities.slice(0, 6).map((activity) => <div className="account-trade-row" key={activity.id}><span className={`account-trade-icon ${activity.action === '买入' ? 'buy' : 'sell'}`}>{activity.action === '买入' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}</span><span><strong>{activity.action} {activity.side}</strong><small>{formatTime(activity.createdAt)}</small></span><b>{formatMoney(activity.total)}</b></div>) : <div className="account-empty account-empty--small"><span>暂无交易记录</span></div>}</aside>
      <section className="account-card account-card--wide account-breakdown"><div className="account-card__heading"><div><span className="eyebrow">ACCOUNT BREAKDOWN</span><h2>账户与交易设置</h2></div><Settings2 size={17} /></div><div className="breakdown-grid"><div><span>账户状态</span><strong className="positive"><i className="live-dot" /> 正常</strong><small>Demo 账户</small></div><div><span>默认市场</span><strong>全部市场</strong><small>加密货币、美股、体育、电竞</small></div><div><span>结算货币</span><strong>CNY ¥</strong><small>账户金额显示单位</small></div><div><span>交易功能</span><strong>已开启</strong><small>市场数据与账户记录</small></div></div></section>
      <section className="account-card account-card--wide account-about"><div><span className="eyebrow">ABOUT MARSKET</span><h2>关于火星市场</h2><p>一个面向中文用户的预测市场：预测 BTC 和美股价格涨跌，参与体育与电子竞技赛事，也可以购买美股虚拟股，建立自己的组合。</p></div><div className="profile-badges"><span><Compass size={14} /> 多品类市场</span><span><ShieldCheck size={14} /> 数据清晰透明</span><span><Zap size={14} /> 简单快速交易</span></div></section>
      <section className="account-card account-danger"><div><span className="eyebrow">DATA CONTROLS</span><h2>重置账户</h2><p>清除全部持仓和交易记录，恢复初始余额。</p></div>{resetOpen ? <div className="reset-confirm"><span>确定清除全部数据？</span><button onClick={resetAccount}>确定</button><button onClick={() => setResetOpen(false)}>取消</button></div> : <button className="danger-button" onClick={() => setResetOpen(true)}>重置数据</button>}</section>
    </div>
  </div>
}

export default App
