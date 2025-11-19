import React, { useState, useCallback, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { GoPlusCircle } from "react-icons/go";
import Navbar from '@components/navbar/navbar';
import type { IUser } from '@interfaces/IUser';
import CreateUserModal from './modal/createModal';
import { getUserTimersAsync } from '@services/userTimerService';
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const fetchUsers = async (setIsLoadingTable: (loading: boolean) => void): Promise<IUser[]> => {
  try {
    setIsLoadingTable(true);
    const response = await getUserTimersAsync();
    return response;
  } catch (error) {
    console.error("Erro ao carregar histórico via API GET:", error);
    toast.error("Falha ao carregar importações.");
    return [];
  } finally {
    setIsLoadingTable(false);
  }
};

const CreateUserTimer: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditingUser, setCurrentEditingUser] = useState<IUser | null>(null);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const ITEMS_PER_PAGE = 5;

  // Filtra os usuários pelo nome baseado no searchTerm
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFiles = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1 && filteredUsers.length > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, filteredUsers.length]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await fetchUsers(setIsLoadingTable);
      setUsers(users);
    };

    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  const getHoursColor = (hours: number) => {
    if (hours > 0) return 'text-green-400 font-semibold text-center';
    if (hours < 0) return 'text-red-400 font-semibold text-center';
    return 'text-gray-400 text-center';
  };

  const handleOpenModal = useCallback((user: IUser) => {
    setCurrentEditingUser(user);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentEditingUser(null);
  }, []);

  const handleModalSuccessAndClose = () => {
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans bg-gradient-to-br from-gray-700 via-gray-900 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <style>
        {`
          @keyframes slideInUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-in-up {
            animation: slideInUp 0.3s ease-out;
          }
        `}
      </style>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />

      <main className="flex flex-1 justify-center items-start pt-12 p-4 lg:p-6">
        <div className="w-full max-w-6xl bg-gray-800 shadow-2xl rounded-2xl p-6 md:p-8 text-white border border-gray-700">

          <h1 className="text-2xl font-extrabold text-blue-400 text-center mb-6 border-b border-gray-700 pb-3">
            Gerenciamento de Horas
          </h1>

          {/* Campo de Busca */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-xl">
            {isLoadingTable && !users.length ? (
              <div className="flex justify-center items-center h-40">
                <span className="flex items-center text-lg text-gray-400">
                  <DetailedLoader sizeClass="h-8 w-8 text-blue-400 mr-3" />
                </span>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/70 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-200 uppercase">
                      Nome
                    </th>
                    <th className="text-center text-xs font-medium text-gray-200 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-200 uppercase">
                      Horas
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-200 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {paginatedFiles.length > 0 ? (
                    paginatedFiles.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-4 text-center font-small text-white max-w-sm truncate">
                          {user.name}
                        </td>
                        <td className="px-2 py-4 text-center font-small text-white max-w-sm truncate">
                          {user.email}
                        </td>
                        <td className={getHoursColor(user.hour)}>
                          {formatHourToHM(user.hour)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="relative px-1 py-1 rounded-full bg-blue-600 group"
                          >
                            <GoPlusCircle className="w-5 h-5 text-white" />
                            <span className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                              Cadastrar Horas
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-center text-gray-500 text-sm">
                        {searchTerm ? 'Nenhum usuário encontrado para sua busca.' : 'Nenhum usuário encontrado.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-between items-center flex-col sm:flex-row">
              <p className="text-sm text-gray-400 mb-2 sm:mb-0">
                Exibindo {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} registros.
                {searchTerm && ` (Filtrado de ${users.length} total)`}
              </p>
              <div className="flex items-center space-x-2">

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition relative z-10"
                >
                  <FaChevronLeft />
                </button>
                <span className="text-sm font-semibold text-white">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition relative z-10"
                >
                  <FaChevronRight />
                </button>

              </div>
            </div>
          )}

        </div>
      </main>

      {isModalOpen && currentEditingUser && (
        <CreateUserModal
          user={currentEditingUser}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccessAndClose}
        />
      )}
    </div>
  );
};

function formatHourToHM(value: number) {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const hours = Math.floor(absValue);
  const minutes = Math.round((absValue - hours) * 60);
  const formatted = `${hours}h ${minutes}m`;
  return isNegative ? `-${formatted}` : formatted;
}

const DetailedLoader: React.FC<{ sizeClass: string }> = ({ sizeClass }) => (
  <svg className={`animate-spin ${sizeClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default CreateUserTimer;