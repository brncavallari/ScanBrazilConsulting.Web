import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { MsalProvider } from '@azure/msal-react';
import { msalInstance, initializeMsal } from '../src/app/configs/msalInstance.ts'; 
import { setupAxiosInterceptors } from '../src/app/configs/axiosInterceptor.tsx';

async function bootstrapApp() {
  try {
    // Inicializa o MSAL
    await initializeMsal();
    
    setupAxiosInterceptors();

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </StrictMode>
    );
  } catch (error) {
    console.error("Erro ao inicializar a aplicação:", error);
  }
}

bootstrapApp();