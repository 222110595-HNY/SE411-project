import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlass, PencilSimple, Plus, Trash } from '@phosphor-icons/react'
import { STATUSES, searchAssets, useAssets } from '../AssetContext'
import * as api from '../api'

export default function AssetList() {
  const { assets, loading, error, removeAsset } = useAssets()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState({ content: [], page: { totalPages: 0 } })
  const [id, setId] = useState('')
  const [found, setFound] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.getAssetsPage(page).then(d => d.content.length === 0 && page > 0 ? setPage(page - 1) : setPageData(d)).catch(() => {})
  }, [page, assets])

  const findById = async e => {
    e.preventDefault()
    setFound(null)
    setNotFound(false)
    try {
      setFound(await api.getAsset(id))
    } catch {
      setNotFound(true)
    }
  }

  const remove = async a => {
    if (confirm(`Delete ${a.tag}?`)) {
      try {
        await removeAsset(a.id)
        setFound(null)
      } catch {
        alert('Could not delete the asset. Check the backend and try again.')
      }
    }
  }

  const filtering = query || status
  const shown = found ? [found] : filtering ? searchAssets(assets, query, status) : pageData.content

  return (
    <section>
      <div className="page-head">
        <h1>Assets</h1>
        <Link className="button primary" to="/assets/new"><Plus size={18} weight="bold" aria-hidden />Add asset</Link>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <form className="toolbar" onSubmit={findById}>
        <input type="number" min="1" required placeholder="Asset ID" aria-label="Asset ID" style={{ width: 'auto' }}
          value={id} onChange={e => setId(e.target.value)} />
        <button className="ghost" type="submit">Find by ID</button>
        {found && <button className="ghost" type="button" onClick={() => setFound(null)}>Show all</button>}
      </form>
      {notFound && <p className="error" role="alert">Asset not found.</p>}

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

      {loading ? (
        <div className="empty"><p>Loading assets…</p></div>
      ) : shown.length === 0 ? (
        <div className="empty">
          <p>No assets found.</p>
          {filtering && <button className="ghost" onClick={() => { setQuery(''); setStatus('') }}>Clear filters</button>}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Tag</th><th>Device</th><th>Serial</th><th>Assigned to</th><th>Status</th><th>Purchased</th><th className="right">Price (SAR)</th><th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {shown.map(a => (
                <tr key={a.id}>
                  <td data-label="ID" className="mono">{a.id}</td>
                  <td data-label="Tag" className="mono strong">{a.tag}</td>
                  <td data-label="Device"><div>{a.brand} {a.model}<div className="muted sub">{a.type}</div></div></td>
                  <td data-label="Serial" className="mono">{a.serial}</td>
                  <td data-label="Assigned to">{a.assignedTo || <span className="muted">Unassigned</span>}</td>
                  <td data-label="Status"><span className={`badge ${a.status.replace(' ', '-').toLowerCase()}`}>{a.status}</span></td>
                  <td data-label="Purchased" className="mono">{a.purchaseDate}</td>
                  <td data-label="Price (SAR)" className="mono right">{Number(a.price).toLocaleString()}</td>
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

      {!found && !filtering && (
        <div className="row-actions" style={{ justifyContent: 'center' }}>
          <button className="ghost small" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page + 1} of {pageData.page.totalPages}</span>
          <button className="ghost small" disabled={page + 1 >= pageData.page.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </section>
  )
}
