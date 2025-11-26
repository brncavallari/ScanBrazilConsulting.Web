import React, { useEffect } from 'react';
import { FaWindows } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '@configs/msalConfig';
import { createStorage, getToken, deleteStorage } from '@services/storageService';
import { msalInstance } from '../../configs/msalInstance';

const Login: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const tokenExists = getToken();

        if (tokenExists) {
            navigate('/home');
        }
    }, [navigate]);

    const handleLogin = async () => {
        try {
            let activeAccount = msalInstance.getActiveAccount();

            if (!activeAccount) {
                const response = await msalInstance.loginPopup(loginRequest);

                if (!response.account) {
                    throw new Error("Nenhuma conta retornada após login.");
                }

                msalInstance.setActiveAccount(response.account);
                activeAccount = response.account;
            }

            const tokenResponse = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: activeAccount,
            }).catch(async (error: any) => {
                console.log(error);
            });

            if (tokenResponse && tokenResponse.accessToken) {
                
                createStorage(
                    tokenResponse,
                    activeAccount?.idTokenClaims?.groups as string[]
                );

                navigate("/home");
            } else {
                throw new Error("Falha ao obter token de acesso.");
            }

        } catch (err) {
            console.error("Erro ao efetuar login:", err);
            deleteStorage();
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-500 via-gray-950 to-black flex items-center justify-center p-6">

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-400/15 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="relative rounded-3xl bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-red-300 via-red-800 to-red-700 p-8 text-center">

                        <div className="flex items-center justify-center space-x-3 mb-2">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <img
                                    src="/android-chrome-512x512.png"
                                    alt="Logo Scan Brazil"
                                    className="w-14 h-14 object-contain"
                                />
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                Scan Brazil Consulting
                            </h1>
                        </div>

                    </div>


                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Bem-vindo
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Faça login para acessar o sistema
                            </p>
                        </div>

                        <button
                            onClick={handleLogin}
                            className="group relative w-full bg-[#0078D4] hover:bg-[#106EBE] rounded-xl py-4 px-6 text-white font-semibold shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#0078D4]/30 border border-[#0078D4]/20"
                        >
                            <div className="flex items-center justify-center">
                                <FaWindows className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                                <span className="text-base">Entrar com Microsoft</span>
                            </div>

                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>

                        <div className="mt-8 p-4 bg-gray-700/50 rounded-xl border border-gray-600/30">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300 font-medium">Acesso Corporativo</p>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                        Credenciais gerenciadas pelo Azure Active Directory da empresa
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-gray-900/50 border-t border-gray-700/30">
                        <p className="text-center text-xs text-gray-500">
                            Sistema interno • Versão 1.0 • {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
