import axios from 'axios';
import { logout } from '@services/authService';

export function setupAxiosInterceptors() {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn('Token expirado ou inválido. Fazendo logout automático...');
        
        // Agora chama o logout SEM parâmetros
        await logout();
        
        // Redirecionar para página inicial (que é o login)
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
}