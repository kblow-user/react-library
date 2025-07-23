import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-hv7g61akuh4vyglo.jp.auth0.com"
        clientId="UVde83yS8FLJNZvriDKI896WQ3DlDAYq"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://localhost:8443/api",
          scope: "openid profile email"
        }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
