import React, { useState, useCallback, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { GoPlusCircle } from "react-icons/go";
import Navbar from '@components/navbar/navbar';
import type { IUser } from '@interfaces/IUser';
import CreateUserModal from './modal/createModal';
import { getUserTimersAsync } from '@services/userTimerService';
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";

const initialUsers: IUser[] = [
  { id: '1', name: 'Bruno Cavallari Almeida', email: 'scan.balmeida@voeazul.com.br', hour: 49 },
  { id: '2', name: 'Felipe Ricci', email: 'scan.ricci@voeazul.com.br', hour: -10.3 },
];

const fetchUsers = async (setIsLoadingTable: (loading: boolean) => void): Promise<IUser[]> => {
  try {
    setIsLoadingTable(true);
    const response = await getUserTimersAsync();

    const users: IUser[] = (response || []).map((item: any) => ({
      id: item.id,
      fileName: item.fileName,
      createdAt: item.createdAt,
      year: item.year,
      month: item.month,
    }));

    return users;

  } catch (error) {
    console.error("Erro ao carregar histórico via API GET:", error);
    toast.error("Falha ao carregar importações.");
    return [];

  } finally {
    setIsLoadingTable(false);
  }
};


const CreateUserTimer: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditingUser, setCurrentEditingUser] = useState<IUser | null>(null);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFiles = users.slice(startIndex, endIndex);
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchData = async () => {
      const users = await fetchUsers(setIsLoadingTable);
      setUsers(users);
    };

    //fetchData();
  }, [refreshTrigger]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
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
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
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
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">
                      Nome
                    </th>

                    <th className="text-center text-xs font-medium text-gray-300 uppercase">
                      Email
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">
                      Horas
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
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
                            <span className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 text-xs text-white bg-black rounded opacity-0  group-hover:opacity-100 transition pointer-events-none">
                              Cadastrar Horas
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-center text-gray-500 text-sm">
                        {isLoadingTable ? 'Carregando...' : 'Nenhum usuário encontrado.'}
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
                Exibindo {startIndex + 1} a {Math.min(endIndex, users.length)} de {users.length} registros.
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  <FaChevronLeft />
                </button>
                <span className="text-sm font-semibold text-white">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition"
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