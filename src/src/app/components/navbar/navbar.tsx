import React, { useState } from 'react';
import { HiOutlineLogout, HiOutlineHome, HiChevronDown, HiOutlineClock } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { getName } from '@services/storageService';
import { logout } from '@services/authService';
import { BsClockHistory } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { CiImport } from "react-icons/ci";
import { useAuth } from '../../auth/useAuth';
import { AiOutlineSignature } from "react-icons/ai";

const NavLinks = [
    { name: 'Home', path: '/home', icon: HiOutlineHome },
];

const Navbar: React.FC = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const name = getName();

    const handleLogout = async () => {
        try {
            logout();
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
                                Consulting
                            </h1>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-grow justify-center">
                        <div className="flex items-center space-x-4">
                            {NavLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-300 transition duration-150 ease-in-out hover:bg-gray-700 hover:text-white"
                                >
                                    <item.icon className="h-5 w-5 mr-1" />
                                    {item.name}
                                </Link>
                            ))}

                            <div className="relative">
                                <div
                                    onClick={() => navigate('/worktimer')}
                                    className="flex items-center space-x-1 px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md cursor-pointer"
                                >
                                    <BsClockHistory className="h-4 w-5 mr-1" />
                                    <span>Horas</span>
                                    <HiChevronDown
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenu(openMenu === 'Horas' ? null : 'Horas');
                                        }}
                                        className={`h-5 w-5 transition-transform duration-200 ${openMenu === 'Horas' ? 'rotate-180' : ''
                                            }`}
                                    />
                                </div>

                                {openMenu === 'Horas' && (
                                    <div className="absolute left-0 mt-3 w-40 bg-gray-700 rounded-md shadow-lg z-50">
                                        <Link
                                            to="/worktimer/history"
                                            className="flex items-center gap-2 px-4 py-2 text-base text-white hover:bg-gray-600 rounded-md"
                                            onClick={() => setOpenMenu(null)}
                                        >
                                            <HiOutlineClock className="h-5 w-5 mr-1" />
                                            Histórico
                                        </Link>

                                        {isAdmin && (
                                            <>
                                                <Link
                                                    to="/worktimer/import"
                                                    className="flex items-center gap-2 px-4 py-2 text-base text-white hover:bg-gray-600 rounded-md"
                                                    onClick={() => setOpenMenu(null)}
                                                >
                                                    <CiImport className="h-5 w-5 mr-1" />
                                                    Importar
                                                </Link>
                                                <Link
                                                    to="/worktimer/approve"
                                                    className="flex items-center gap-2 px-4 py-2 text-base text-white hover:bg-gray-600 rounded-md"
                                                    onClick={() => setOpenMenu(null)}
                                                >
                                                    <AiOutlineSignature className="h-5 w-5 mr-1" />
                                                    Aprovações
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Usuarios */}
                            <div className='relative'>
                                {isAdmin ? (
                                    <div
                                        onClick={() => navigate('/users')}
                                        className="flex items-center space-x-1 px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md cursor-pointer"
                                    >
                                        <FaRegUser className="h-4 w-5 mr-1" />
                                        <span>Usuarios</span>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>

                            {/* Menu Despesas */}
                            {/* <div className="relative">
                                {isAdmin ? (
                                    <div
                                        onClick={() => navigate('/expenses')}
                                        className="flex items-center space-x-1 px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md cursor-pointer"
                                    >
                                        <GiShoppingCart className="h-5 w-5 mr-1" />
                                        <span>Despesas</span>
                                        <HiChevronDown
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenu(openMenu === 'Despesas' ? null : 'Despesas');
                                            }}
                                            className={`h-5 w-5 transition-transform duration-200 ${openMenu === 'Despesas' ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => navigate('/expenses')}
                                        className="flex items-center space-x-1 px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md cursor-pointer"
                                    >
                                        <GiShoppingCart className="h-5 w-5 mr-1" />
                                        <span>Despesas</span>
                                    </div>
                                )}
                             
                                {isAdmin && openMenu === 'Despesas' && (
                                    <div className="absolute left-0 mt-3 w-40 bg-gray-700 rounded-md shadow-lg z-50">
                                        <Link
                                            to="/expenses/register"
                                            className="flex items-center gap-2 px-4 py-2 text-base text-white hover:bg-gray-600 rounded-md"
                                            onClick={() => setOpenMenu(null)}
                                        >
                                            <GoPencil className="h-5 w-5 mr-1" />
                                            Aprovações
                                        </Link>
                                    </div>
                                )}
                            </div> */}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-3">
                        <span className="flex items-center text-white text-xl font-bold tracking-wider">
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
                </div>
            </div>
        </nav>
    );
};

export default Navbar;