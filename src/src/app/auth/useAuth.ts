// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { getToken, getUserGroups } from '@services/storageService';
import { isAdmin, isUser } from '@services/authService';

export interface AuthState {
  isAuthenticated: boolean;
  userRoles: string[];
  isAdmin: boolean;
  isUser: boolean;
  isLoading: boolean;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userRoles: [],
    isAdmin: false,
    isUser: false,
    isLoading: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      
      if (token) {
        try {

          const userGroups = getUserGroups();
          const userRoles = userGroups ? userGroups : [];

          setAuthState({
            isAuthenticated: true,
            userRoles,
            isAdmin: isAdmin(userRoles),
            isUser: isUser(userRoles),
            isLoading: false
          });
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          setAuthState({
            isAuthenticated: false,
            userRoles: [],
            isAdmin: false,
            isUser: false,
            isLoading: false
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          userRoles: [],
          isAdmin: false,
          isUser: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
};