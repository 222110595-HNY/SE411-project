const BASE = import.meta.env?.VITE_API_URL || '/api/v1/assets'

async function request(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
  return res
}

export async function getAssetsPage(page) {
  const res = await request(`${BASE}?page=${page}&size=3`)
  return res.json()
}

export async function listAssets(page = 0, size = 1000) {
  const res = await request(`${BASE}?page=${page}&size=${size}`)
  const data = await res.json()
  return Array.isArray(data) ? data : (data.content ?? [])
}

export async function getAsset(id) {
  const res = await request(`${BASE}/${id}`)
  return res.json()
}

export async function createAsset(asset) {
  const body = { ...asset }
  delete body.id
  await request(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function deleteAsset(id) {
  await request(`${BASE}/${id}`, { method: 'DELETE' })
}

export async function updateAsset(id, asset) {
  const body = { ...asset }
  delete body.id
  await request(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
