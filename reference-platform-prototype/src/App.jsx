import { useEffect, useState } from 'react'
import { resolveRoute } from './router.js'

export default function App() {
  const [route, setRoute] = useState(() => resolveRoute(window.location.pathname))
  useEffect(() => {
    const update = () => setRoute(resolveRoute(window.location.pathname))
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])
  return <main><h1>竞界</h1><p>多品类互动原型 · {route.page}</p></main>
}
