import { Bell, Headphones, Menu, Plus, Search } from 'lucide-react'
import { navigate } from '../router.js'

export default function Topbar({ onToggleNav, onToggleMedia }) {
  return <header className="topbar">
    <div className="topbar__brand-zone">
      <button className="icon-button mobile-only" aria-label="打开导航" onClick={onToggleNav}><Menu size={21} /></button>
      <button className="brand" onClick={() => navigate('/sports')} aria-label="竞界首页"><span className="brand__mark">J</span><span className="brand__word">竞界<span className="brand__dot">.</span></span></button>
      <span className="brand__tag">PLAY THE MOMENT</span>
    </div>
    <div className="topbar__actions">
      <span className="topbar__demo">交互演示</span>
      <button className="icon-button desktop-only" aria-label="搜索" onClick={() => document.querySelector('[data-global-search]')?.focus()}><Search size={19} /></button>
      <button className="icon-button desktop-only" aria-label="通知演示" title="暂无通知"><Bell size={18} /></button>
      <button className="icon-button" aria-label="媒体面板" onClick={onToggleMedia}><Headphones size={19} /></button>
      <button className="balance-chip" onClick={() => navigate('/account')}><span>演示余额</span><strong>¥ 0.00</strong><Plus size={15} /></button>
      <button className="avatar" onClick={() => navigate('/account')} aria-label="我的">访</button>
    </div>
  </header>
}
