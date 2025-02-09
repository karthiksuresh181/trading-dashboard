import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AccountManager from './AccountManager.tsx'
import TradingPairs from './TradingPairs.tsx'
import TabbedAppContainer from './TabbedAppContainer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TabbedAppContainer App1={TradingPairs} App2={AccountManager} />
  </StrictMode>,
)
