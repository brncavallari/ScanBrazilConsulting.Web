import axios from 'axios';
import type { RefoundPayload } from '@interfaces/IExpenses';
import { getToken } from '@services/storageService';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function createExpenses(
    data: RefoundPayload,
    files: File[]) {
    const accessToken = getToken();

    const formData = new FormData();

    const expensesObject = {
        totalSpent: data.totalSpent,
        advance: data.advance,
        expenses: data.expense,
    };

    formData.append('data', JSON.stringify(expensesObject));

    files.forEach((file) => {
        formData.append(`files`, file, file.name);
    });

    for (const [key, value] of formData.entries()) {
        console.log("FILE:" + key, value);
    }

    try {
        const response = await axios.post(`${API_URL}/expenses`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }
        throw error;
    }
}
