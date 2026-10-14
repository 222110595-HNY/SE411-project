import { useEffect, useRef } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { Desktop, Info, ListBullets, PlusCircle, SquaresFour } from '@phosphor-icons/react'
import Home from './pages/Home'
import AssetList from './pages/AssetList'
import AssetForm from './pages/AssetForm'
import About from './pages/About'

const links = [
  { to: '/', label: 'Dashboard', Icon: SquaresFour, end: true },
  { to: '/assets', label: 'Assets', Icon: ListBullets, end: true },
  { to: '/assets/new', label: 'Add Asset', Icon: PlusCircle },
  { to: '/about', label: 'About', Icon: Info },
]

export default function App() {
  const { pathname } = useLocation()
  const main = useRef(null)
  useEffect(() => { main.current?.focus() }, [pathname])

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand"><Desktop size={24} weight="duotone" aria-hidden /> <span>Asset Manager</span></div>
          <nav aria-label="Main">
            {links.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end}><Icon size={20} aria-hidden />{label}</NavLink>
            ))}
          </nav>
        </aside>
        <main id="main" ref={main} tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assets" element={<AssetList />} />
            <Route path="/assets/new" element={<AssetForm />} />
            <Route path="/assets/:id/edit" element={<AssetForm />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<p>Page not found.</p>} />
          </Routes>
        </main>
      </div>
    </>
  )
}
