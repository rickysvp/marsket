import { useEffect, useState } from 'react'
import { resolveRoute } from './router.js'
import Shell from './components/Shell.jsx'
import './styles/tokens.css'
import './styles/layout.css'
import './styles/responsive.css'

export default function App() {
  const [route, setRoute] = useState(() => resolveRoute(window.location.pathname))
  useEffect(() => {
    const update = () => setRoute(resolveRoute(window.location.pathname))
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])
  return <Shell path={window.location.pathname} mediaTitle={route.page === 'live-directory' ? '体育直播' : '精选赛事'}>
    <div className="page-placeholder"><span className="eyebrow">INTERACTIVE PROTOTYPE</span><h1>{route.page}</h1><p>多品类互动原型的页面内容正在逐步接入。</p></div>
  </Shell>
}
