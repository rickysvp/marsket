import { Bell, ChevronRight, CircleHelp, Cog, CreditCard, Gift, History, LifeBuoy, ShieldCheck, UserRound, Wallet, X } from 'lucide-react'
import { useState } from 'react'
import { navigate } from '../router.js'

const groups = [
  ['常用功能', [['记录', '/records', History], ['优惠广场', null, Gift], ['消息中心', null, Bell], ['VIP 权益', null, Gift]]],
  ['钱包', [['充值', null, Wallet], ['提现', null, CreditCard], ['资金记录', null, History], ['卡片管理', null, CreditCard]]],
  ['设置与帮助', [['游戏设置', 'settings:game', Cog], ['系统设置', 'settings:system', ShieldCheck], ['帮助中心', null, LifeBuoy]]],
]

export default function AccountPage() {
  const [notice, setNotice] = useState('')
  const [panel, setPanel] = useState('')
  const [oddsFormat, setOddsFormat] = useState('欧洲盘')
  const [theme, setTheme] = useState('自动')
  const [scores, setScores] = useState(true)
  const [language, setLanguage] = useState('简体中文')
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh')
  const open = (name, path) => {
    if (path?.startsWith('settings:')) { setPanel(path.split(':')[1]); setNotice(''); return }
    if (path) { navigate(path); return }
    setNotice(`${name}为演示入口，暂不采集个人信息或执行资金操作。`)
  }
  return <div className="account-page"><div className="account-hero"><div className="account-avatar"><UserRound size={27} /></div><div><span className="eyebrow">MY SPACE</span><h1>我的竞界</h1><p>演示账户 · 不连接真实用户资料</p></div></div><div className="balance-panel"><span>演示余额</span><strong>¥ 0.00</strong><small>此处仅展示界面，不支持充值、提现或账户绑定。</small></div>
    {notice && <div className="account-notice"><CircleHelp size={16} />{notice}<button onClick={() => setNotice('')}>关闭</button></div>}
    {groups.map(([heading, links]) => <section className="account-group" key={heading}><h2>{heading}</h2><div>{links.map(([name, path, Icon]) => <button key={name} onClick={() => open(name, path)}><Icon size={19} /><span>{name}</span><ChevronRight size={16} /></button>)}</div></section>)}
    {panel && <section className="account-settings"><div className="account-settings__heading"><div><span className="eyebrow">DEMO PREFERENCES</span><h2>{panel === 'game' ? '游戏设置' : '系统设置'}</h2></div><button aria-label="关闭设置" onClick={() => setPanel('')}><X size={17} /></button></div>{panel === 'game' ? <div className="account-settings__rows"><label>赔率格式<select value={oddsFormat} onChange={(event) => setOddsFormat(event.target.value)}><option>欧洲盘</option><option>香港盘</option><option>马来盘</option></select></label><label>现场比分<button onClick={() => setScores(!scores)}>{scores ? '显示' : '隐藏'}</button></label><p>偏好仅在本次原型会话中展示，不改变真实赛事或订单。</p></div> : <div className="account-settings__rows"><label>主题<select value={theme} onChange={(event) => setTheme(event.target.value)}><option>自动</option><option>浅色</option><option>深色</option></select></label><label>语言<select value={language} onChange={(event) => setLanguage(event.target.value)}><option>简体中文</option><option>English</option></select></label><label>时区<select value={timezone} onChange={(event) => setTimezone(event.target.value)}><option value="Asia/Ho_Chi_Minh">GMT+07:00</option><option value="America/New_York">GMT-04:00</option><option value="UTC">UTC</option></select></label><p>设置仅为交互演示，不写入账户资料。</p></div>}</section>}
  </div>
}
