import React, { useEffect } from 'react';
import { FaWindows } from 'react-icons/fa';
import { GiShoppingCart } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@configs/msalConfig';
import { createStorage, getToken, deleteStorage } from '@services/storageService';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { instance } = useMsal();

    useEffect(() => {
        const tokenExists = getToken();

        if (tokenExists) {
            navigate('/home');
        }
    }, [navigate]);

    const handleLogin = async () => {
        try {
            let activeAccount = instance.getActiveAccount();

            if (!activeAccount) {
                const response = await instance.loginPopup(loginRequest);

                if (!response.account) {
                    throw new Error("Nenhuma conta retornada após login.");
                }

                instance.setActiveAccount(response.account);
                activeAccount = response.account;
            }

            const tokenResponse = await instance.acquireTokenSilent({
                ...loginRequest,
                account: activeAccount,
            }).catch(async (error) => {
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
        <div className="flex h-screen w-screen items-center justify-center bg-gray-950">
            <div className="w-full max-w-sm rounded-2xl bg-gray-800 p-8 shadow-2xl">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-100">
                        <span className="text-red-400">Scan Brazil</span>
                        <span className="mx-2 font-light text-gray-500">|</span>
                        Despesas
                    </h1>
                    <GiShoppingCart className="mx-auto mt-4 text-6xl text-gray-500" />
                </div>


                <button
                    onClick={handleLogin}
                    className="flex w-full items-center justify-center rounded-lg bg-[#0078D4] px-4 py-3 text-lg font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-[#005a9e] focus:outline-none focus:ring-4 focus:ring-[#0078D4]/50"
                    aria-label="Entrar com a conta Microsoft"
                >
                    <FaWindows className="mr-3 h-5 w-5" />
                    Login
                </button>

                <p className="mt-8 text-center text-xs text-gray-400">
                    *O acesso é restrito e gerenciado pelo Active Directory.
                </p>
            </div>
        </div>
    );
};

export default Login;
