import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { AssetProvider, assetReducer, searchAssets, seedAssets } from './AssetContext'

const renderApp = (path = '/') => render(
  <MemoryRouter initialEntries={[path]}>
    <AssetProvider><App /></AssetProvider>
  </MemoryRouter>,
)

describe('assetReducer', () => {
  it('adds with the next id', () => {
    const out = assetReducer(seedAssets, { type: 'add', asset: { tag: 'X' } })
    expect(out).toHaveLength(seedAssets.length + 1)
    expect(out.at(-1).id).toBe(6)
  })
  it('adds to an empty list with id 1', () => {
    expect(assetReducer([], { type: 'add', asset: { tag: 'X' } })[0].id).toBe(1)
  })
  it('updates by id', () => {
    const out = assetReducer(seedAssets, { type: 'update', asset: { ...seedAssets[0], brand: 'Acer' } })
    expect(out[0].brand).toBe('Acer')
    expect(seedAssets[0].brand).toBe('Dell')
  })
  it('removes by id', () => {
    expect(assetReducer(seedAssets, { type: 'remove', id: 1 }).some(a => a.id === 1)).toBe(false)
  })
  it('throws on unknown action', () => {
    expect(() => assetReducer([], { type: 'nope' })).toThrow()
  })
})

describe('searchAssets', () => {
  it('matches case-insensitively across fields', () => {
    expect(searchAssets(seedAssets, 'thinkpad').map(a => a.tag)).toEqual(['PC-003'])
    expect(searchAssets(seedAssets, 'sara')).toHaveLength(1)
  })
  it('filters by status', () => {
    expect(searchAssets(seedAssets, '', 'Retired').map(a => a.tag)).toEqual(['TAB-001'])
  })
  it('returns all for empty query', () => {
    expect(searchAssets(seedAssets, '  ')).toHaveLength(seedAssets.length)
  })
})

describe('UI', () => {
  it('navigates with the menu to About and shows the team', async () => {
    renderApp()
    await userEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(screen.getByRole('heading', { name: 'Team' })).toBeInTheDocument()
  })

  it('adds an asset through the form', async () => {
    renderApp('/assets/new')
    const u = userEvent.setup()
    await u.type(screen.getByLabelText(/Asset tag/), 'PC-099')
    await u.type(screen.getByLabelText(/Brand/), 'Asus')
    await u.type(screen.getByLabelText(/Model/), 'ZenBook')
    await u.type(screen.getByLabelText(/Serial/), 'AZ-1')
    await u.type(screen.getByLabelText(/Purchase date/), '2026-01-01')
    await u.type(screen.getByLabelText(/Price/), '3000')
    await u.click(screen.getByRole('button', { name: 'Add asset' }))
    expect(screen.getByText('PC-099')).toBeInTheDocument()
  })

  it('rejects a duplicate asset tag', async () => {
    renderApp('/assets/new')
    const u = userEvent.setup()
    await u.type(screen.getByLabelText(/Asset tag/), 'pc-001')
    await u.type(screen.getByLabelText(/Brand/), 'X')
    await u.type(screen.getByLabelText(/Model/), 'X')
    await u.type(screen.getByLabelText(/Serial/), 'X')
    await u.type(screen.getByLabelText(/Purchase date/), '2026-01-01')
    await u.type(screen.getByLabelText(/Price/), '1')
    await u.click(screen.getByRole('button', { name: 'Add asset' }))
    expect(screen.getByRole('alert')).toHaveTextContent('already exists')
  })

  it('edits an asset', async () => {
    renderApp('/assets/2/edit')
    const u = userEvent.setup()
    const brand = screen.getByLabelText(/Brand/)
    await u.clear(brand)
    await u.type(brand, 'Compaq')
    await u.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(screen.getByText(/Compaq/)).toBeInTheDocument()
  })

  it('searches and deletes an asset', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderApp('/assets')
    const u = userEvent.setup()
    await u.type(screen.getByLabelText('Search'), 'PC-002')
    const row = screen.getByText('PC-002').closest('tr')
    await u.click(within(row).getByRole('button', { name: 'Delete' }))
    expect(screen.queryByText('PC-002')).not.toBeInTheDocument()
    expect(screen.getByText('No assets found.')).toBeInTheDocument()
  })
})
