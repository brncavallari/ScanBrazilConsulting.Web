import { PublicClientApplication, type IPublicClientApplication } from "@azure/msal-browser";
import axios from "axios";
import { msalConfig, loginRequest } from "@configs/msalConfig";
import { deleteStorage } from '@services/storageService';

export const msalInstance = new PublicClientApplication(msalConfig);

export const signIn = async () => {
    try {
        const response = await msalInstance.loginPopup(loginRequest);
        return response.account;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
};

export const getUserGroups = async (token: string) => {
    try {
        const response = await axios.get("https://graph.microsoft.com/v1.0/me/memberOf", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.value.map((group: any) => ({
            id: group.id,
            name: group.displayName,
            type: group["@odata.type"],
        }));
    } catch (error: any) {
        console.error("Erro ao buscar grupos:", error.response?.data || error);
        throw error;
    }
};

export async function logout(instance: IPublicClientApplication) {
    try {
        deleteStorage();

        await instance.logoutPopup({
            postLogoutRedirectUri: "/",
        });
    } catch (err) {
        console.error("Erro durante o logout:", err);
    }
}