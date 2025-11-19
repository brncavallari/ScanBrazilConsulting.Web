// src/app/components/route/protectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { getToken } from '@services/storageService';

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { instance } = useMsal();
    const location = useLocation(); 
    const [isChecking, setIsChecking] = useState(true);
    
    const tokenExists = getToken();

    useEffect(() => {
        const tokenOnNavigation = getToken();

        if (!tokenOnNavigation) {
            instance.logoutRedirect({ postLogoutRedirectUri: '/' });
        }
        setIsChecking(false);
    }, [location.pathname, instance]);
    
    if (isChecking) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
                <p>Verificando autenticação...</p>
            </div>
        );
    }

    if (!tokenExists) {
        try {
            instance.logoutRedirect({ postLogoutRedirectUri: '/' });
        } catch (error) {
            console.error('Erro no logout:', error);
        }

        return (
            <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
                <p>Redirecionando para Login...</p>
            </div>
        );
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;