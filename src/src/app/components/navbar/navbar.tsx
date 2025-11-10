import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiOutlineClipboardList, HiOutlineHome, HiOutlineCog } from 'react-icons/hi';
import { GiShoppingCart } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { getName } from '@services/storageService';
import { logout } from '@services/authService';

const NavLinks = [
    { name: 'Home', path: '/home', icon: HiOutlineHome },
    { name: 'Cadastro', path: '/register', icon: GiShoppingCart },
    { name: 'Histórico', path: '/history', icon: HiOutlineClipboardList },
    { name: 'Configurações', path: '/configuration', icon: HiOutlineCog },
];

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { instance } = useMsal();
    const navigate = useNavigate();

    const name = getName();

    const handleLogout = async () => {
        try {
            logout(instance);
            navigate('/');
        } catch (e) {
            console.error("Erro durante o logout:", e);
        }
    };

    return (
        <nav className="sticky top-0 z-10 bg-gray-800 shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    <div className="flex items-center">
                        <Link to="/home" className="flex items-center text-white text-xl font-bold tracking-wider">
                            <h1 className="text-1xl font-extrabold tracking-tight text-gray-100">
                                <span className="text-red-400">Scan Brazil</span>
                                <span className="mx-2 font-light text-gray-400">|</span>
                                Despesas
                            </h1>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-grow justify-center">
                        <div className="flex items-center space-x-4">
                            {NavLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition duration-150 ease-in-out hover:bg-gray-700 hover:text-white"
                                >
                                    <item.icon className="h-5 w-5 mr-1" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-3">
                        <span className="text-lg font-medium text-gray-100 truncate max-w-[150px]">
                            {name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-red-700"
                        >
                            <HiOutlineLogout className="h-5 w-5 mr-1" />
                            Sair
                        </button>
                    </div>

                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Abrir menu principal</span>
                            {isOpen ? (
                                <HiOutlineX className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <HiOutlineMenu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>

                </div>
            </div>

            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    <div className="text-white text-base font-medium px-3 py-2 border-b border-gray-700">
                        {name}!
                    </div>
                    {NavLinks.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-300 transition duration-150 ease-in-out hover:bg-gray-700 hover:text-white"
                        >
                            <item.icon className="h-6 w-6 mr-2" />
                            {item.name}
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center rounded-md bg-red-600 px-3 py-2 text-base font-medium text-white transition duration-150 ease-in-out hover:bg-red-700 mt-2"
                    >
                        <HiOutlineLogout className="h-6 w-6 mr-2" />
                        Sair
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;