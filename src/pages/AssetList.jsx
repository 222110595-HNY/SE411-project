import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlass, PencilSimple, Plus, Trash } from '@phosphor-icons/react'
import { STATUSES, searchAssets, useAssets } from '../AssetContext'

export default function AssetList() {
  const { assets, dispatch } = useAssets()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const shown = searchAssets(assets, query, status)

  const remove = a => {
    if (confirm(`Delete ${a.tag}?`)) dispatch({ type: 'remove', id: a.id })
  }

  return (
    <section>
      <div className="page-head">
        <h1>Assets</h1>
        <Link className="button primary" to="/assets/new"><Plus size={18} weight="bold" aria-hidden />Add asset</Link>
      </div>

      <div className="toolbar">
        <div className="search">
          <MagnifyingGlass size={18} aria-hidden />
          <input type="search" placeholder="Search tag, brand, model, serial, user…" aria-label="Search"
            value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select aria-label="Filter by status" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {shown.length === 0 ? (
        <div className="empty">
          <p>No assets found.</p>
          {(query || status) && <button className="ghost" onClick={() => { setQuery(''); setStatus('') }}>Clear filters</button>}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Tag</th><th>Device</th><th>Serial</th><th>Assigned to</th><th>Status</th><th>Purchased</th><th className="right">Price (SAR)</th><th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {shown.map(a => (
                <tr key={a.id}>
                  <td data-label="Tag" className="mono strong">{a.tag}</td>
                  <td data-label="Device"><div>{a.brand} {a.model}<div className="muted sub">{a.type}</div></div></td>
                  <td data-label="Serial" className="mono">{a.serial}</td>
                  <td data-label="Assigned to">{a.assignedTo || <span className="muted">Unassigned</span>}</td>
                  <td data-label="Status"><span className={`badge ${a.status.replace(' ', '-').toLowerCase()}`}>{a.status}</span></td>
                  <td data-label="Purchased" className="mono">{a.purchaseDate}</td>
                  <td data-label="Price (SAR)" className="mono right">{a.price.toLocaleString()}</td>
                  <td><div className="row-actions">
                    <Link className="button ghost small" to={`/assets/${a.id}/edit`}><PencilSimple size={16} aria-hidden />Edit</Link>
                    <button className="danger small" onClick={() => remove(a)}><Trash size={16} aria-hidden />Delete</button></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="muted" aria-live="polite">{shown.length} of {assets.length} assets</p>
    </section>
  )
}
