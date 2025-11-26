import axios from 'axios';
import { getToken } from '@services/storageService';
import type { UploadWorkTimer } from '@interfaces/IWorkTimer';

const API_URL = import.meta.env.VITE_API_URL;

export async function uploadWorkTimerAsync(
    data: UploadWorkTimer) {

    const accessToken = getToken();

    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("fileName", data.fileName ?? "");
    formData.append("year", data.year);
    formData.append("month", data.month);

    try {
        const response = await axios.post(`${API_URL}/api/v1/WorkTimerImported/file/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Falha ao realizar a operação.");
    }
}

export async function getWorkTimerImportedAsync() {
    const accessToken = getToken();

    try {
        const response = await axios.get(`${API_URL}/api/v1/WorkTimerImported/`, {
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


export async function removeWorkTimerImported(id:string) {
    const accessToken = getToken();

    try {
        const response = await axios.delete(`${API_URL}/api/v1/WorkTimerImported/${id}`, {
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