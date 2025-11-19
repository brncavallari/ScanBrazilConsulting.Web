// // axios-interceptor.ts
// import axios from 'axios';
// import { logout } from '@services/authService';
// import { msalConfig } from '../../app/configs/msalConfig';

// export function setupAxiosInterceptors() {
//   axios.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       if (axios.isAxiosError(error) && error.response?.status === 401) {
//         console.warn('Token expirado ou inválido. Fazendo logout automático...');
        
//         // Chama o logout
//         await logout(msalConfig);
        
//         // Opcional: Redirecionar para página de login
//         window.location.href = '/login';
//       }
//       return Promise.reject(error);
//     }
//   );
// }