import React from 'react';
import { useAuth } from '../auth/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  adminOnly?: boolean;
  userOnly?: boolean;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  requiredRole, 
  adminOnly, 
  userOnly, 
  fallback = null 
}) => {
  const { userRoles, isAdmin, isUser, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center p-4">Carregando...</div>;
  }

  let hasPermission = false;

  if (requiredRole) {
    hasPermission = userRoles.includes(requiredRole);
  } else if (adminOnly) {
    hasPermission = isAdmin;
  } else if (userOnly) {
    hasPermission = isUser;
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};