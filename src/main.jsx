import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AssetProvider } from './AssetContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AssetProvider>
        <App />
      </AssetProvider>
    </BrowserRouter>
  </StrictMode>,
)
