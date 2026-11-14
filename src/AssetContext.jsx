import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import * as api from './api'

export const TYPES = ['Laptop', 'Desktop', 'Server', 'Tablet']
export const STATUSES = ['Available', 'In Use', 'In Repair', 'Retired']

export const seedAssets = [
  { id: 1, tag: 'PC-001', type: 'Laptop', brand: 'Dell', model: 'Latitude 7440', serial: 'DL7440-A1', assignedTo: 'Sara Ali', status: 'In Use', purchaseDate: '2025-02-10', price: 4200 },
  { id: 2, tag: 'PC-002', type: 'Desktop', brand: 'HP', model: 'EliteDesk 800', serial: 'HP800-B7', assignedTo: '', status: 'Available', purchaseDate: '2024-09-01', price: 3100 },
  { id: 3, tag: 'PC-003', type: 'Laptop', brand: 'Lenovo', model: 'ThinkPad T14', serial: 'LNT14-C3', assignedTo: 'Omar Khalid', status: 'In Repair', purchaseDate: '2023-11-20', price: 3900 },
  { id: 4, tag: 'SRV-001', type: 'Server', brand: 'Dell', model: 'PowerEdge R650', serial: 'DPE650-Z9', assignedTo: 'IT Dept', status: 'In Use', purchaseDate: '2022-05-15', price: 28500 },
  { id: 5, tag: 'TAB-001', type: 'Tablet', brand: 'Apple', model: 'iPad Air', serial: 'AIPA-Q2', assignedTo: '', status: 'Retired', purchaseDate: '2020-03-03', price: 2600 },
]

export function assetReducer(assets, action) {
  switch (action.type) {
    case 'set':
      return action.assets
    case 'add': {
      const id = Math.max(0, ...assets.map(a => a.id)) + 1
      return [...assets, { ...action.asset, id }]
    }
    case 'update':
      return assets.map(a => (a.id === action.asset.id ? action.asset : a))
    case 'remove':
      return assets.filter(a => a.id !== action.id)
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

export function searchAssets(assets, query, status = '') {
  const q = query.trim().toLowerCase()
  return assets.filter(a =>
    (!status || a.status === status) &&
    (!q || [a.tag, a.type, a.brand, a.model, a.serial, a.assignedTo].some(v => String(v ?? '').toLowerCase().includes(q))))
}

const AssetContext = createContext(null)

export function AssetProvider({ children }) {
  const [assets, dispatch] = useReducer(assetReducer, [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const list = await api.listAssets()
      dispatch({ type: 'set', assets: list })
      setError('')
    } catch {
      setError('Could not reach the server. Start the backend on port 3000 and try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addAsset = useCallback(async asset => { await api.createAsset(asset); await refresh() }, [refresh])
  const editAsset = useCallback(async asset => { await api.updateAsset(asset.id, asset); await refresh() }, [refresh])
  const removeAsset = useCallback(async id => { await api.deleteAsset(id); await refresh() }, [refresh])

  return (
    <AssetContext.Provider value={{ assets, loading, error, addAsset, editAsset, removeAsset }}>
      {children}
    </AssetContext.Provider>
  )
}

export const useAssets = () => useContext(AssetContext)
