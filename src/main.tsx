import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AccountManagerApp from './AccountManager.tsx'
import PairManagerApp from './PairManager.tsx'
import TabbedAppContainer from './TabbedAppContainer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TabbedAppContainer App1={PairManagerApp} App2={AccountManagerApp} />
  </StrictMode>,
)
