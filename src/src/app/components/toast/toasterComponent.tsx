
// Usando DefaultToastOptions que inclui success, error, loading
export const toastConfig: DefaultToastOptions = {
  style: {
    background: '#1f2937',
    color: '#f3f4f6',
    border: '1px solid #374151',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    padding: '1rem',
    maxWidth: '420px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
  },
  success: {
    duration: 1000,
    style: {
      background: '#064e3b',
      color: '#ffffffff',
      border: '1px solid #047857',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#d1fae5',
    },
  },
  error: {
    duration: 2000,
    style: {
      background: '#7f1d1d',
      color: '#ffffffff',
      border: '1px solid #dc2626',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fecaca',
    },
  },
  loading: {
    style: {
      background: '#1e3a8a',
      color: '#dbeafe',
      border: '1px solid #1d4ed8',
    },
  },
};

export const toasterProps = {
  position: 'top-center' as const,
  reverseOrder: false,
  gutter: 10,
  containerStyle: {
    top: 60,
  },
};

import { Toaster, type DefaultToastOptions } from 'react-hot-toast';
import React from 'react';

export const ToasterComponent: React.FC = () => {
  return <Toaster {...toasterProps} toastOptions={toastConfig} />;
};

import toast from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (message: string, options?: any) => 
      toast.success(message, { ...toastConfig.success, ...options }),
    error: (message: string, options?: any) => 
      toast.error(message, { ...toastConfig.error, ...options }),
    loading: (message: string, options?: any) => 
      toast.loading(message, { ...toastConfig.loading, ...options }),
    dismiss: toast.dismiss,
    remove: toast.remove,
    promise: toast.promise,
  };
};