import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Coins, Package, Prohibit, User, Wrench } from '@phosphor-icons/react'
import { STATUSES, TYPES, useAssets } from '../AssetContext'

const statusIcons = { 'Available': CheckCircle, 'In Use': User, 'In Repair': Wrench, 'Retired': Prohibit }
const slug = s => s.replace(' ', '-').toLowerCase()

export default function Home() {
  const { assets, loading, error } = useAssets()
  const total = assets.reduce((sum, a) => sum + Number(a.price), 0)
  const counts = STATUSES.map(s => [s, assets.filter(a => a.status === s).length])

  return (
    <section>
      <div className="page-head">
        <h1>Dashboard</h1>
        <Link className="button ghost" to="/assets">View all assets <ArrowRight size={18} aria-hidden /></Link>
      </div>

      {error && <p className="error" role="alert">{error}</p>}
      {loading && !error && <p className="muted">Loading assets…</p>}

      <div className="stats">
        <div className="stat"><Package size={22} aria-hidden /><span className="num">{assets.length}</span>Total assets</div>
        {counts.map(([s, n]) => {
          const Icon = statusIcons[s]
          return <div className={`stat ${slug(s)}`} key={s}><Icon size={22} aria-hidden /><span className="num">{n}</span>{s}</div>
        })}
        <div className="stat"><Coins size={22} aria-hidden /><span className="num">{total.toLocaleString()}</span>Total value (SAR)</div>
      </div>

      {assets.length > 0 && (
        <div className="panel">
          <h2>Status breakdown</h2>
          <div className="bar" role="img" aria-label={counts.map(([s, n]) => `${s}: ${n}`).join(', ')}>
            {counts.map(([s, n]) => n > 0 && <span key={s} className={slug(s)} style={{ flexGrow: n }} />)}
          </div>
          <ul className="legend">
            {counts.map(([s, n]) => <li key={s}><i className={slug(s)} aria-hidden />{s} <b>{n}</b></li>)}
          </ul>
        </div>
      )}

      {assets.length > 0 && (
        <div className="grid-2">
          <div className="panel">
            <h2>Assets by type</h2>
            <ul className="type-list">
              {TYPES.map(t => {
                const n = assets.filter(a => a.type === t).length
                return (
                  <li key={t}>
                    <span>{t}</span>
                    <span className="meter" aria-hidden><span style={{ width: `${(n / assets.length) * 100}%` }} /></span>
                    <b className="mono">{n}</b>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="panel">
            <h2>Recently purchased</h2>
            <ul className="recent">
              {[...assets].sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate)).slice(0, 5).map(a => (
                <li key={a.id}>
                  <span><b className="mono">{a.tag}</b> <span className="muted">{a.brand} {a.model}</span></span>
                  <span className="mono muted">{a.purchaseDate}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
