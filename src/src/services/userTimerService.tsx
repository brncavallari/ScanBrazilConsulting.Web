import axios from 'axios';
import { getToken, getUserName } from '@services/storageService';

const API_URL = import.meta.env.VITE_API_URL;

export async function getUserTimerAsync() {
    const accessToken = getToken();

    const userName = getUserName()
    try {
        const response = await axios.get(`${API_URL}/api/v1/UserTimer?Email=${userName}`, {
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
