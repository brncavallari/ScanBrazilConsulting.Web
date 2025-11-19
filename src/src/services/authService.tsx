import axios from "axios";
import {  loginRequest } from "@configs/msalConfig";
import { deleteStorage } from '@services/storageService';
import { msalInstance } from '../app/configs/msalInstance';

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

export async function logout() {
    try {
        deleteStorage();

        await msalInstance.logoutPopup({
            postLogoutRedirectUri: "/",
        });
    } catch (err) {
        console.error("Erro durante o logout:", err);
    }
}

export const getUserInfos = async (token: string): Promise<any> => {
    try {
        const response = await fetch("https://graph.microsoft.com/beta/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Erro ao buscar grupos:", error.response?.data || error);
        throw error;
    }
};