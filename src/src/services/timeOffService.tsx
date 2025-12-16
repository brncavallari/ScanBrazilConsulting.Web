import axios from 'axios';
import { getToken } from '@services/storageService';
import type { ITimeOff, ITimeOffData } from '@interfaces/ITimeOff';

const API_URL = import.meta.env.VITE_API_URL;

export async function createTimeOffAsync(timeOff: ITimeOffData) {
    const accessToken = getToken();

    try {
        const response = await axios.post(`${API_URL}/api/v1/TimeOff/`, timeOff, {
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

export async function getTimeOffsAsync() {
    const accessToken = getToken();

    try {
        const response = await axios.get(`${API_URL}/api/v1/TimeOff/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Falha ao consultar Aprovações.");
    }
}

export async function getTimeOffsByEmailAsync() {
    const accessToken = getToken();

    try {
        const response = await axios.get(`${API_URL}/api/v1/TimeOff/byEmail`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Falha ao consultar Aprovações.");
    }
}

export async function getTimeOffByEmailAsync() {
    const accessToken = getToken();

    try {
        const response = await axios.get(`${API_URL}/api/v1/TimeOff/byEmail`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Falha ao consultar Aprovações.");
    }
}

export const getTimeOffByProtocolAsync = async (protocol: string): Promise<ITimeOff> => {
    const accessToken = getToken();

    try {
        const response = await axios.get(`${API_URL}/api/v1/TimeOff/${protocol}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Falha ao consultar Protocolo.");
    }
};

export const approveTimeOffAsync = async (protocol: string, description: string, userEmail: string) => {
    const accessToken = getToken();

    try {
        const response = await axios.post(
            `${API_URL}/api/v1/TimeOff/${protocol}/approve`,
            { 
                description: description, 
                userEmail: userEmail 
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
            }
        );

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        // Adicione mais detalhes do erro para debug
        console.error('Erro ao aprovar solicitação:', error);
        throw new Error(`Falha ao Aprovar Solicitação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
};

export const rejectTimeOffAsync = async (protocol: string, description: string) => {
    const accessToken = getToken();

    try {
        const response = await axios.post(
            `${API_URL}/api/v1/TimeOff/${protocol}/reject`,
            { description },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            }
        );

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Falha ao Rejeitar Solicitação");
    }
};

export const deleteTimeOffByProtocolAsync = async (protocol: string): Promise<void> => {
    const accessToken = getToken();

    try {
        await axios.delete(`${API_URL}/api/v1/TimeOff/${protocol}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
        });

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Não autorizado. Access Token inválido ou expirado. Requer novo login.");
        }

        throw new Error("Erro ao Remover Solicitação por protocolo");
    }
};