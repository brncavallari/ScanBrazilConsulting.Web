import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { getToken } from '@services/storageService';

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { instance } = useMsal();
    const location = useLocation(); 
    
    const tokenExists = getToken();

    useEffect(() => {
        const tokenOnNavigation = getToken();

        if (!tokenOnNavigation) {
            instance.logoutRedirect({ postLogoutRedirectUri: '/' });
        }
        
    }, [location.pathname, instance]);
    
  if (!tokenExists) {
        try {
            instance.logoutRedirect({ postLogoutRedirectUri: '/' });
        } catch (error) {
            window.location.replace('/');
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
