import React, { useState, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { GoPencil, GoPlusCircle } from "react-icons/go";
import Navbar from '@components/navbar/navbar';
import type { IUser } from '@interfaces/IUser';
import { deleteUserAsync, getUserTimersAsync } from '@services/userTimerService';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FaSearch, FaPlus, FaTrash } from "react-icons/fa";
import ConfirmModal from '@components/modalConfirmation/confirmModal';
import DetailedLoader from '@components/loader/detailedLoader';
import { ToasterComponent } from '@components/toast/toasterComponent';
import { formatHourToHM } from '../../functions/index';
import EditeHourModal from './modal/editUserModal';
import UserTimerModal from './modal/userTimerModal';

const UserTimer: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentEditingUser, setCurrentEditingUser] = useState<IUser | null>(null);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalConfirmationOpen, setModalConfirmationOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const ITEMS_PER_PAGE = 5;

  const needsRefreshRef = useRef(false);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoadingTable(true);
      const fetchedUsers = await getUserTimersAsync();
      setUsers(fetchedUsers);
      needsRefreshRef.current = false;
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Falha ao carregar usuários.");
    } finally {
      setIsLoadingTable(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const refreshUsers = useCallback(() => {
    needsRefreshRef.current = true;
    loadUsers();
  }, [loadUsers]);

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

  const handleDeleteConfirmation = (user: IUser) => {
    setCurrentEditingUser(user);
    setModalConfirmationOpen(true);
  };

  const handleOpenCreateModal = () => {
    setCurrentEditingUser(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenHoursModal = (user: IUser) => {
    setCurrentEditingUser(user);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: IUser) => {
    setCurrentEditingUser(user);
    setIsModalEditOpen(false);
    setTimeout(() => {
      setIsModalEditOpen(true);
    }, 10);
  };

  const handleCancel = () => {
    if (!isActionLoading) {
      setModalConfirmationOpen(false);
      setCurrentEditingUser(null);
    }
  };

  const handleModalSuccess = useCallback(() => {
    setIsModalOpen(false);
    setIsModalEditOpen(false);
    setIsCreateModalOpen(false);
    setCurrentEditingUser(null);
    setModalConfirmationOpen(false);

    setTimeout(() => {
      refreshUsers();
    }, 100);
  }, [refreshUsers]);

  const handleDelete = async () => {
    try {
      setIsActionLoading(true);

      await deleteUserAsync(
        currentEditingUser!.id
      );

      toast.success('Usuário removido com sucesso!');

      handleModalSuccess();
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      toast.error('Erro ao remover usuário.');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 flex flex-col font-sans bg-gradient-to-br from-gray-700 via-gray-900 to-black">
      {/* Background decorativo: não pode capturar cliques */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
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

      {/* Conteúdo deve ficar acima do background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <ToasterComponent />

        <main className="flex flex-1 justify-center items-start pt-12 p-4 lg:p-6">
          <div className="w-full max-w-8xl bg-gray-800 shadow-2xl rounded-2xl p-6 md:p-8 text-white border border-gray-700">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 pb-3 border-b border-gray-700">
              <div className="text-center md:text-left md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                <h1 className="text-3xl font-extrabold text-blue-400">
                  Gerenciamento de Horas - Usuários
                </h1>
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 min-w-[160px] ml-auto"
              >
                <FaPlus className="w-4 h-4" />
                Cadastrar
              </button>
            </div>

            <div className="mb-6">
              <div className="relative max-w-md">
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
                    Carregando usuários...
                  </span>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/70 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-100 tracking-wider">
                        Nome
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-100 tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-100 tracking-wider">
                        Email Alternativo
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-100 tracking-wider">
                        Horas
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-100 tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {paginatedFiles.length > 0 ? (
                      paginatedFiles.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                          <td className="text-center px-4 py-4 text-sm font-medium text-gray-400">
                            {user.name}
                          </td>
                          <td className="text-center px-4 py-4 text-sm text-gray-400">
                            {user.email}
                          </td>
                          <td className="text-center px-4 py-4 text-sm text-gray-400">
                            {user.emailAlternative || '-'}
                          </td>
                          <td className={`px-4 py-4 text-sm text-center ${getHoursColor(user.hour)}`}>
                            {formatHourToHM(user.hour)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap relative z-10">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenHoursModal(user)}
                                className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                                title="Horas"
                              >
                                <GoPlusCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Horas</span>
                              </button>

                              <button
                                onClick={() => handleOpenEditModal(user)}
                                className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                                title="Editar Usuário"
                              >
                                <GoPencil className="w-3 h-3" />
                                <span className="hidden sm:inline">Editar</span>
                              </button>

                              <button
                                onClick={() => handleDeleteConfirmation(user)}
                                className="inline-flex items-center p-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                title='Remover usuário'
                              >
                                <FaTrash className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="text-gray-400 mb-2">
                              {searchTerm ? 'Nenhum usuário encontrado para sua busca.' : 'Nenhum usuário cadastrado.'}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {totalPages > 1 && (
              <div className="relative z-20 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-400">
                  Exibindo {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} registros.
                  {searchTerm && ` (Filtrado de ${users.length} total)`}
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="text-sm font-semibold text-white px-3">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Modal para adicionar horas - use uma chade única */}
        {isModalOpen && currentEditingUser && (
          <EditeHourModal
            key={`create-${currentEditingUser.id}-${Date.now()}`}
            user={currentEditingUser}
            onClose={() => {
              setCurrentEditingUser(null);
              setIsModalOpen(false);
            }}
            onSuccess={handleModalSuccess}
          />
        )}

        {isModalEditOpen && currentEditingUser && (
          <UserTimerModal
            key={`edit-${currentEditingUser.id}-${Date.now()}`}
            user={currentEditingUser}
            onClose={() => {
              setCurrentEditingUser(null);
              setIsModalEditOpen(false);
            }}
            onSuccess={handleModalSuccess}
          />
        )}

        {isCreateModalOpen && (
          <UserTimerModal
            key="create-new"
            user={null}
            onClose={() => {
              setCurrentEditingUser(null);
              setIsCreateModalOpen(false);
            }}
            onSuccess={handleModalSuccess}
          />
        )}

        <ConfirmModal
          open={isModalConfirmationOpen}
          onConfirm={handleDelete}
          message={`Deseja remover este usuário?`}
          subMessage={`${currentEditingUser?.name}`}
          onCancel={handleCancel}
          isLoading={isActionLoading}
        />
      </div>
    </div>
  );
};

export default UserTimer;
