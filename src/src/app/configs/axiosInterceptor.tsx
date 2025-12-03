import axios from 'axios';
import { logout } from '@services/authService';

export function setupAxiosInterceptors() {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn('Token expirado ou inválido. Fazendo logout automático...');
        
        await logout();
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
}