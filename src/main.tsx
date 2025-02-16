import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AccountManagerApp from './AccountManager.tsx'
import PairManagerApp from './PairManager.tsx'
import TabbedAppContainer from './TabbedAppContainer.tsx'
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';

const ProtectedAppContainer = withAuthenticationRequired(TabbedAppContainer);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH_DOMAIN}
      clientId={import.meta.env.VITE_AUTH_CLIENT_ID}
      authorizationParams={{
        redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI ?? window.location.origin,
      }}
    >
      <ProtectedAppContainer App1={PairManagerApp} App2={AccountManagerApp} />

    </Auth0Provider>
  </StrictMode>,
)
