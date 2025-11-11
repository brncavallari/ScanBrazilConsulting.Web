import { type Configuration, type RedirectRequest } from '@azure/msal-browser';

const tenantId = import.meta.env.VITE_TENANT_ID;
const clientId = import.meta.env.VITE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_MSAL_REDIRECT_URI || window.location.origin;

if (!tenantId || !clientId) {
    throw new Error("As variáveis de ambiente VITE_TENANT_ID e VITE_CLIENT_ID devem ser definidas e acessíveis.");
}

export const msalConfig: Configuration = {
    auth: {
        clientId: clientId!,
        authority: `https://login.microsoftonline.com/${tenantId}/v2.0`,
        redirectUri: redirectUri,
    }
};

export const loginRequest: RedirectRequest = {
    scopes: ["User.Read", "User.Read.All"],
    prompt: 'select_account'
};

export const API_URL = import.meta.env.VITE_API_URL;
