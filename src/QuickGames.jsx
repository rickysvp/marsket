import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, Clock3, LockKeyhole, ShieldCheck, Zap } from 'lucide-react'
import { quickAssets, quickModes } from './mockData'
import { createQuickRound, getQuickRoundStatus, placeQuickBet, settleQuickRound } from './simulationStore'

const durations = [1, 5, 15]

const money = (value) => `¥ ${Number(value).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`
const modeName = (mode) => quickModes.find((item) => item.id === mode)?.label || mode
const assetFor = (symbol) => quickAssets.find((item) => item.symbol === symbol) || quickAssets[0]

function countdown(round, now) {
  const status = getQuickRoundStatus(round, now)
  const target = status === 'open' ? round.locksAt : round.settlesAt
  const seconds = Math.max(0, Math.ceil((target - now) / 1000))
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

export function buildQuickRounds(now = Date.now()) {
  return quickAssets.flatMap((asset) => quickModes.flatMap((mode) => durations.map((duration) => createQuickRound({ asset, mode: mode.id, duration, now }))))
}

export function getQuickRoundById(roundId, now = Date.now()) {
  const [symbol, mode, duration, opensAt] = String(roundId).split('-')
  const asset = assetFor(symbol)
  if (!asset || !quickModes.some((item) => item.id === mode) || !durations.includes(Number(duration)) || !Number.isFinite(Number(opensAt))) return null
  return createQuickRound({ asset, mode, duration: Number(duration), now: Number(opensAt) + 1 })
}

function statusLabel(round, now) {
  const status = getQuickRoundStatus(round, now)
  return status === 'open' ? '开放下注' : status === 'locked' ? '已封盘' : '已结算'
}

function Filters({ filters, setFilters }) {
  return <div className="quick-filter-bar"><div className="quick-filter-group"><span>标的</span>{['ALL', ...quickAssets.map((asset) => asset.symbol)].map((value) => <button key={value} className={filters.asset === value ? 'active' : ''} onClick={() => setFilters({ ...filters, asset: value })}>{value === 'ALL' ? '全部' : value}</button>)}</div><div className="quick-filter-group"><span>玩法</span>{[['all', '全部玩法'], ...quickModes.map((item) => [item.id, item.label])].map(([value, label]) => <button key={value} className={filters.mode === value ? 'active' : ''} onClick={() => setFilters({ ...filters, mode: value })}>{label}</button>)}</div><div className="quick-filter-group"><span>周期</span>{[['all', '全部'], ...durations.map((value) => [String(value), `${value} 分钟`])].map(([value, label]) => <button key={value} className={filters.duration === value ? 'active' : ''} onClick={() => setFilters({ ...filters, duration: value })}>{label}</button>)}</div></div>
}

function QuickCard({ round, now, onNavigate }) {
  const asset = assetFor(round.symbol)
  const status = getQuickRoundStatus(round, now)
  return <button className="quick-card" onClick={() => onNavigate(`/quick-games/${round.id}`)}><div className="quick-card__top"><span className="quick-symbol">{asset.symbol}</span><span className={`quick-status quick-status--${status}`}>{status === 'open' ? <Clock3 size={13} /> : <LockKeyhole size={13} />}{statusLabel(round, now)}</span></div><div className="quick-card__title"><div><span className="eyebrow">{round.duration} MIN · {round.mode === 'hash' ? 'LOCAL HASH' : 'PRICE GAME'}</span><h3>{modeName(round.mode)}</h3></div><strong className="quick-countdown">{countdown(round, now)}</strong></div><div className="quick-card__prices"><span>开盘价 <b>{round.openPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}</b></span><span>当前价 <b>{asset.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</b></span></div><div className="quick-outcomes">{round.outcomes.slice(0, round.mode === 'direction' ? 2 : 6).map((outcome) => <span key={outcome}><b>{outcome}</b><small>{round.odds[outcome]}x</small></span>)}{round.outcomes.length > 6 && <em>+{round.outcomes.length - 6}</em>}</div><div className="quick-card__foot"><span>最低 ¥10 · 当前轮次</span><span>查看玩法 →</span></div></button>
}

export function QuickGamesPage({ onNavigate, onSettle, simulation }) {
  const [now, setNow] = useState(Date.now())
  const [filters, setFilters] = useState({ asset: 'ALL', mode: 'all', duration: 'all' })
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [])
  const rounds = useMemo(() => buildQuickRounds(now).filter((round) => (filters.asset === 'ALL' || round.symbol === filters.asset) && (filters.mode === 'all' || round.mode === filters.mode) && (filters.duration === 'all' || String(round.duration) === filters.duration)), [filters, now])
  useEffect(() => { (simulation?.quickBets || []).map((bet) => getQuickRoundById(bet.roundId, now)).filter(Boolean).filter((round) => getQuickRoundStatus(round, now) === 'settled').forEach(onSettle) }, [now, simulation, onSettle])
  return <div className="page quick-games-page"><div className="quick-games-head"><div><span className="eyebrow">SHORT-TERM MARKETS</span><h1>快速玩法</h1><p>选择一个标的和结算周期，参与短周期价格判断。</p></div><div className="quick-live"><span className="live-dot" />实时轮次同步</div></div><Filters filters={filters} setFilters={setFilters} /><div className="quick-games-toolbar"><span>进行中的轮次 <b>{rounds.length}</b></span><span>封盘前均可参与</span></div><div className="quick-grid">{rounds.map((round) => <QuickCard key={round.id} round={round} now={now} onNavigate={onNavigate} />)}</div><div className="disclaimer"><ShieldCheck size={14} /><span>快速玩法使用本地 Demo 数据，赔率和结果仅用于体验产品流程。</span></div></div>
}

export function QuickGameDetail({ roundId, simulation, authenticated, onNavigate, onRequireLogin, onBet, onSettle }) {
  const [now, setNow] = useState(Date.now())
  const [outcome, setOutcome] = useState('')
  const [stake, setStake] = useState('100')
  const [feedback, setFeedback] = useState('')
  const rounds = buildQuickRounds(now)
  const round = getQuickRoundById(roundId, now) || rounds[0]
  const status = getQuickRoundStatus(round, now)
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [])
  useEffect(() => { if (!outcome && round) setOutcome(round.outcomes[0]) }, [round, outcome])
  useEffect(() => { if (status === 'settled') onSettle(round) }, [status, round, onSettle])
  if (!round) return null
  const selectedOdds = round.odds[outcome] || round.odds[round.outcomes[0]]
  const payout = Number(stake || 0) * selectedOdds
  const submit = () => {
    if (status !== 'open') return setFeedback(status === 'locked' ? '本轮已封盘，等待结算' : '本轮已经结算')
    if (!authenticated) return onRequireLogin()
    const error = onBet({ round, outcome, stake, odds: selectedOdds })
    setFeedback(error || `已确认 ${outcome}，预计返还 ${money(payout)}`)
  }
  const history = (simulation.quickHistory || []).slice(0, 5)
  return <div className="page quick-detail-page"><button className="back-link" onClick={() => onNavigate('/quick-games')}><ArrowLeft size={15} /> 返回快速玩法</button><div className="quick-detail-layout"><main className="quick-detail-main"><div className="quick-detail-heading"><div><span className="eyebrow">{round.symbol} · {round.duration} MIN · {modeName(round.mode)}</span><h1>{round.mode === 'direction' ? `${round.symbol} 价格会向上还是向下？` : round.mode === 'digit' ? `${round.symbol} 结算价格尾数` : `${round.symbol} 本轮 Hash 尾字符`}</h1></div><div className={`detail-round-status quick-status--${status}`}>{statusLabel(round, now)}<strong>{countdown(round, now)}</strong></div></div><div className="quick-price-panel"><div><span>开盘价格</span><strong>{round.openPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong></div><div className="quick-price-arrow">→</div><div><span>当前参考价</span><strong className="lime-text">{assetFor(round.symbol).price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong></div><div className="quick-round-meta"><span>轮次 ID</span><b>{round.roundId}</b></div></div><section className="quick-detail-card"><div className="card-heading"><div><span className="eyebrow">SELECT OUTCOME</span><h2>选择结果</h2></div><span className="quick-odds-note">赔率锁定于封盘时</span></div><div className={`quick-detail-outcomes quick-detail-outcomes--${round.mode}`}>{round.outcomes.map((item) => <button key={item} className={outcome === item ? 'selected' : ''} onClick={() => setOutcome(item)} disabled={status !== 'open'}><strong>{item}</strong><span>{round.odds[item]}x</span>{outcome === item && <Check size={14} />}</button>)}</div></section><section className="quick-rules"><div><span className="eyebrow">ROUND RULES</span><h2>本轮规则</h2></div><p>{round.mode === 'direction' ? '以轮次结束时的价格相对开盘价的涨跌作为结果。' : round.mode === 'digit' ? '以结算价格小数点后第一位数字作为结果。' : '根据本地轮次 ID 生成确定性结果，作为 Demo 展示。'}</p><span>开盘后可下注 · 提前 10 秒封盘 · 结算后自动写入账户</span></section></main><aside className="quick-bet-panel"><div className="quick-bet-panel__head"><span className="eyebrow">PLACE ORDER</span><Zap size={18} /></div><div className="quick-selected"><span>当前选择</span><strong>{outcome || round.outcomes[0]}</strong><b>{selectedOdds}x</b></div><label className="amount-label">投入金额<span>可用 {money(simulation.balance)}</span></label><div className="amount-input"><span>¥</span><input type="number" min="10" value={stake} onChange={(event) => setStake(event.target.value)} /><span className="amount-unit">CNY</span></div><div className="quick-payout"><span>预计返还</span><strong>{money(payout)}</strong></div><button className="trade-submit" onClick={submit} disabled={status !== 'open'}>{status === 'open' ? '确认下注' : status === 'locked' ? '等待结算' : '本轮已结束'} <Zap size={16} fill="currentColor" /></button>{feedback && <div className={`trade-feedback ${feedback.includes('预计') || feedback.includes('已确认') ? 'success' : 'error'}`}>{feedback}</div>}<div className="trade-footnote"><ShieldCheck size={13} /> 余额和结果仅用于 Demo 账户</div></aside></div><section className="quick-history"><div><span className="eyebrow">RECENT ROUNDS</span><h2>最近轮次</h2>{history.length ? history.map((item) => <div className="quick-history-row" key={item.roundId}><span>{item.roundId.split('-').slice(0, 2).join(' · ')}</span><b>{item.result}</b></div>) : <span>结果将在结算后显示</span>}</div></section></div>
}

export function applyQuickBet(state, input) { return placeQuickBet(state, input) }
export { settleQuickRound }
