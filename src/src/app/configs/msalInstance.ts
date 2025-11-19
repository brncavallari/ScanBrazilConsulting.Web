import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './msalConfig';

export const msalInstance = new PublicClientApplication(msalConfig);

export async function initializeMsal() {
  try {
    await msalInstance.initialize();
    await msalInstance.handleRedirectPromise();
    return msalInstance;
  } catch (error) {
    console.error("Erro ao inicializar o MSAL:", error);
    throw error;
  }
}