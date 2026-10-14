import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { STATUSES, TYPES, useAssets } from '../AssetContext'

const empty = { tag: '', type: TYPES[0], brand: '', model: '', serial: '', assignedTo: '', status: STATUSES[0], purchaseDate: '', price: '' }

export default function AssetForm() {
  const { id } = useParams()
  const { assets, dispatch } = useAssets()
  const navigate = useNavigate()
  const existing = id && assets.find(a => a.id === Number(id))
  const [form, setForm] = useState(existing || empty)
  const [tagError, setTagError] = useState('')
  const tagInput = useRef(null)

  if (id && !existing) return <p>Asset not found.</p>

  const set = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = e => {
    e.preventDefault()
    const asset = { ...form, tag: form.tag.trim(), price: Number(form.price) }
    if (assets.some(a => a.tag.toLowerCase() === asset.tag.toLowerCase() && a.id !== asset.id)) {
      setTagError(`Asset tag "${asset.tag}" already exists. Use a different tag.`)
      return tagInput.current.focus()
    }
    dispatch({ type: existing ? 'update' : 'add', asset })
    navigate('/assets')
  }

  const field = (name, label, props = {}) => (
    <label><span>{label}{props.required && <span className="req" aria-hidden> *</span>}</span>
      <input name={name} value={form[name]} onChange={set} {...props} />
    </label>
  )
  const select = (name, label, options) => (
    <label>{label}<select name={name} value={form[name]} onChange={set}>{options.map(o => <option key={o}>{o}</option>)}</select></label>
  )

  return (
    <section>
      <div className="page-head"><h1>{existing ? `Edit ${existing.tag}` : 'Add asset'}</h1></div>
      <form onSubmit={submit} className="form panel">
        <fieldset>
          <legend>Identification</legend>
          <div className="field">
            <label htmlFor="tag"><span>Asset tag<span className="req" aria-hidden> *</span></span></label>
            <input id="tag" ref={tagInput} name="tag" value={form.tag} required placeholder="e.g. PC-010"
              aria-invalid={!!tagError} aria-describedby={tagError ? 'tag-error' : undefined}
              onChange={e => { set(e); setTagError('') }} />
            {tagError && <span id="tag-error" className="error" role="alert">{tagError}</span>}
          </div>
          {select('type', 'Type', TYPES)}
          {field('serial', 'Serial number', { required: true })}
        </fieldset>
        <fieldset>
          <legend>Device</legend>
          {field('brand', 'Brand', { required: true })}
          {field('model', 'Model', { required: true })}
        </fieldset>
        <fieldset>
          <legend>Assignment</legend>
          {field('assignedTo', 'Assigned to', { placeholder: 'Leave empty if unassigned' })}
          {select('status', 'Status', STATUSES)}
        </fieldset>
        <fieldset>
          <legend>Purchase</legend>
          {field('purchaseDate', 'Purchase date', { type: 'date', required: true })}
          {field('price', 'Price (SAR)', { type: 'number', min: 0, step: '0.01', required: true, inputMode: 'decimal' })}
        </fieldset>
        <p className="muted hint"><span aria-hidden>*</span> Required field</p>
        <div className="form-actions">
          <button type="button" className="ghost" onClick={() => navigate('/assets')}>Cancel</button>
          <button type="submit" className="primary">{existing ? 'Save changes' : 'Add asset'}</button>
        </div>
      </form>
    </section>
  )
}
