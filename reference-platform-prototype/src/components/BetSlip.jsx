import { Check, RefreshCw, Trash2, X } from 'lucide-react'
import { getSlipSummary } from '../state/slip.js'

export default function BetSlip({ slip }) {
  const summary = getSlipSummary(slip.items, slip.mode, slip.stake)
  const changed = slip.items.some((item) => item.needsConfirmation)
  return <aside className="bet-slip">
    <header className="bet-slip__header"><div><span className="eyebrow">SELECTION SLIP</span><h2>选择单 <small>{slip.items.length}</small></h2></div><button className="icon-button" aria-label="关闭选择单" onClick={() => slip.setOpen(false)}><X size={18} /></button></header>
    <div className="bet-slip__tabs"><button className={slip.mode === 'single' ? 'is-active' : ''} onClick={() => slip.setMode('single')}>单注</button><button className={slip.mode === 'parlay' ? 'is-active' : ''} onClick={() => slip.setMode('parlay')}>串场</button></div>
    {slip.items.length ? <div className="bet-slip__items">{slip.items.map((item) => <div className="slip-item" key={item.id}><button aria-label={`移除 ${item.eventName}`} onClick={() => slip.remove(item.id)}><X size={15} /></button><div><strong>{item.eventName}</strong><span>{item.marketName} · {item.label}</span>{item.needsConfirmation && <em>赔率已由 {item.acceptedOdds.toFixed(2)} 更新，需重新确认</em>}</div><b>{item.odds.toFixed(2)}</b></div>)}</div> : <div className="bet-slip__empty">选择一个演示赔率，体验选择流程。</div>}
    {slip.mode === 'parlay' && slip.items.length < 2 && <p className="slip-hint">串场至少选择两场不同赛事</p>}
    {changed && <button className="slip-confirm" onClick={slip.confirm}><Check size={15} /> 接受新赔率</button>}
    <div className="bet-slip__form"><label>{slip.mode === 'single' && slip.items.length > 1 ? '每注演示金额' : '演示金额'} <input aria-label="演示金额" type="number" min="0" value={slip.stake || ''} placeholder="输入金额" onChange={(event) => slip.setStake(event.target.value)} /></label><div className="slip-quick">{[50, 100, 500].map((amount) => <button key={amount} onClick={() => slip.setStake(amount)}>¥{amount}</button>)}<button onClick={() => slip.setStake(1000)}>MAX</button></div><div className="slip-keypad" aria-label="演示数字键盘">{['1','2','3','4','5','6','7','8','9','.','0','backspace'].map((key) => <button key={key} aria-label={key === 'backspace' ? '退格' : key} onClick={() => slip.pressKey(key)}>{key === 'backspace' ? '⌫' : key}</button>)}</div><div className="slip-result"><span>{slip.mode === 'single' && slip.items.length > 1 ? `总投入 ¥ ${summary.stakeTotal.toFixed(2)} · 预估总回报` : '预估回报'}</span><strong>¥ {summary.returnAmount.toFixed(2)}</strong></div><button className="slip-submit" disabled={!summary.canPreview || Number(slip.stake) <= 0 || changed} onClick={() => slip.setNotice('仅供原型演示：未创建订单或产生资金交易。')}>查看演示结果</button>{slip.notice && <p className="slip-notice">{slip.notice}</p>}<button className="slip-simulate" onClick={slip.simulate} disabled={!slip.items.length}><RefreshCw size={14} /> 模拟赔率更新</button><button className="slip-clear" onClick={slip.clear}><Trash2 size={14} /> 清空选择</button></div>
    <footer>示例赔率与金额仅用于功能演示</footer>
  </aside>
}
