import {
  Asterisk, ChevronDown, Circle, CircleDashed, CircleDot, CircleDotDashed,
  Club, Coins, Dices, Flame, Gamepad2, Gem, Goal, History, PanelLeftClose,
  PlaySquare, Spade, Ticket, Trophy, UserRound, Zap,
} from 'lucide-react'
import { useState } from 'react'
import { navigation } from './navigation.js'
import { navigate } from '../router.js'

const icons = { Asterisk, Circle, CircleDashed, CircleDot, CircleDotDashed, Club, Coins, Dices, Flame, Gamepad2, Gem, Goal, History, PlaySquare, Spade, Ticket, Trophy, UserRound, Zap }

export default function Sidebar({ path, collapsed, onCollapse, mobileOpen, onCloseMobile }) {
  const [openGroups, setOpenGroups] = useState({ 体育: true, 娱乐: true, 电子: true, 账户: true })
  const go = (next) => { navigate(next); onCloseMobile() }
  return <>
    {mobileOpen && <button className="nav-scrim mobile-only" aria-label="关闭导航" onClick={onCloseMobile} />}
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}>
      <div className="sidebar__top"><span>探索</span><button className="sidebar__collapse" aria-label="收合导航" onClick={onCollapse}><PanelLeftClose size={17} /></button></div>
      <nav aria-label="主导航">
        {navigation.map((group) => {
          const GroupIcon = icons[group.icon] || Circle
          return <section className="nav-group" key={group.label}>
            <button className="nav-group__heading" onClick={() => setOpenGroups((old) => ({ ...old, [group.label]: !old[group.label] }))} aria-expanded={Boolean(openGroups[group.label])}>
              <GroupIcon size={17} /><span>{group.label}</span><ChevronDown className={openGroups[group.label] ? '' : 'is-closed'} size={15} />
            </button>
            {openGroups[group.label] && <div className="nav-group__items">{group.items.map((item) => {
              const Icon = icons[item.icon] || Circle
              const active = path === item.path || (item.path !== '/sports' && path.startsWith(`${item.path}/`))
              return <button key={item.path} className={`nav-item ${active ? 'nav-item--active' : ''}`} title={item.label} aria-current={active ? 'page' : undefined} onClick={() => go(item.path)}><Icon size={18} strokeWidth={1.8} /><span>{item.label}</span></button>
            })}</div>}
          </section>
        })}
      </nav>
      <div className="sidebar__foot"><span className="online-dot" /><span>体验模式</span><small>v0.1</small></div>
    </aside>
  </>
}
