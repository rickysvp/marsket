import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import MediaPanel from './MediaPanel.jsx'

export default function Shell({ path, children, sidePanel, mediaTitle, mediaSubtitle }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false)
  return <div className={`app-shell ${collapsed ? 'app-shell--compact' : ''}`}>
    <Topbar onToggleNav={() => setMobileNavOpen((value) => !value)} onToggleMedia={() => setMobileMediaOpen((value) => !value)} />
    <Sidebar path={path} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
    <main className="workspace">{children}</main>
    {sidePanel || <MediaPanel title={mediaTitle} subtitle={mediaSubtitle} mobileOpen={mobileMediaOpen} onClose={() => setMobileMediaOpen(false)} />}
  </div>
}
