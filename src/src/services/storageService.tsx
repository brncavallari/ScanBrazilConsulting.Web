import type { AuthenticationResult } from "@azure/msal-browser";
import LocalStorageKeys from "../app/constants/localStorageKeys";

export const getName = () => localStorage.getItem(LocalStorageKeys.AUTH_NAME) ?? "Visitante";
export const getUserName = () => localStorage.getItem(LocalStorageKeys.AUTH_USERNAME) ?? "";
export const getToken = () => localStorage.getItem(LocalStorageKeys.AUTH_TOKEN);


export async function deleteStorage() {
    localStorage.removeItem(LocalStorageKeys.AUTH_TOKEN);
    localStorage.removeItem(LocalStorageKeys.AUTH_NAME);
    localStorage.removeItem(LocalStorageKeys.AUTH_GROUPS);
}

export async function createStorage(response: AuthenticationResult, groups: string[]) {
    if (!response || !response.accessToken || !response.account) {
        return;
    }

    localStorage.setItem(LocalStorageKeys.AUTH_TOKEN,  response.accessToken);
    localStorage.setItem(LocalStorageKeys.AUTH_USERNAME,  response.account.username ?? "");
    localStorage.setItem(LocalStorageKeys.AUTH_NAME, response.account.name ?? response.account.username ?? "");
    localStorage.setItem(LocalStorageKeys.AUTH_GROUPS, JSON.stringify(groups));
}

export const getUserGroups = (): string[] | null => {
    try {
        const groups = localStorage.getItem(LocalStorageKeys.AUTH_GROUPS);
        return groups ? JSON.parse(groups) : null;
    } catch (error) {
        console.error('Erro ao recuperar grupos:', error);
        return null;
    }
};