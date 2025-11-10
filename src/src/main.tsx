import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '../src/app/configs/msalConfig.ts'; 

const msalInstance = new PublicClientApplication(msalConfig);

async function initializeMsal() {
  try {
    await msalInstance.initialize();
    await msalInstance.handleRedirectPromise();
  } catch (error) {
    console.error("Erro ao inicializar o MSAL:", error);
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </StrictMode>
  );
}

initializeMsal();
