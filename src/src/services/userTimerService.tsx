import axios from 'axios';
import { getToken } from '@services/storageService';
import type { IUserData } from '@interfaces/IUser';

const API_URL = import.meta.env.VITE_API_URL;

export async function getUserTimerByEmailAsync() {
    const accessToken = getToken();

    try {
        const response = await axios.get(`${API_URL}/api/v1/UserTimer/byEmail`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Falha ao consultar Informações de Usuario.");
    }
}

export async function getUserTimersAsync() {
    const accessToken = getToken();

    try {
        const response = await axios.get(`${API_URL}/api/v1/UserTimer/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Falha ao consultar Informações de Usuario.");
    }
}

export async function updateUserTimerAsync(user: IUserData) {
    const accessToken = getToken();

    try {
        const response = await axios.put(`${API_URL}/api/v1/UserTimer/`, user, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Falha ao consultar Informações de Usuario.");
    }
}

export async function createOrUpdateUserTimerAsync(user: IUserData) {
    const accessToken = getToken();

    try {
        const response = await axios.post(`${API_URL}/api/v1/UserTimer/`, user, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Falha ao consultar Informações de Usuario.");
    }
}


export async function deleteUserAsync(id: string) {
    const accessToken = getToken();

    try {
        const response = await axios.delete(`${API_URL}/api/v1/UserTimer/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Falha ao Remover Usuario.");
    }
}