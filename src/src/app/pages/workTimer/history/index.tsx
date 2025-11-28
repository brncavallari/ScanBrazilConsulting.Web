import React, { useState, useCallback, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { GoEye } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import Navbar from '@components/navbar/navbar';
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import type { ITimeOff } from '@interfaces/ITimeOff';
import { getTimeOffsByEmailAsync, deleteTimeOffByProtocolAsync } from '@services/timeOffService';
import HistoryTimeOffModal from './modal';
import ConfirmModal from '@components/modalConfirmation/confirmModal';

const fetchTimeOff = async (setIsLoadingTable: (loading: boolean) => void): Promise<ITimeOff[]> => {
  try {
    setIsLoadingTable(true);
    const response = await getTimeOffsByEmailAsync();
    return response;

  } catch (error) {
    console.error("Erro ao carregar aprovações via API GET:", error);
    toast.error("Falha ao carregar aprovações.");
    return [];
  } finally {
    setIsLoadingTable(false);
  }
};

const HistoryTimeOff: React.FC = () => {
  const [timeOff, setTimeOff] = useState<ITimeOff[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTimeOff, setSelectedTimeOff] = useState<ITimeOff | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalConfirmationOpen, setModalConfirmationOpen] = useState(false);
  const [protocol, setProtocol] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  

  const ITEMS_PER_PAGE = 5;

  const filteredTimeOff = timeOff.filter(timeOff => {
    const matchesSearch =
      timeOff.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timeOff.protocol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timeOff.approver?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || timeOff.status.toString() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTimeOff.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFiles = filteredTimeOff.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1 && filteredTimeOff.length > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, filteredTimeOff.length]);

  useEffect(() => {
    const fetchData = async () => {
      const timeOff = await fetchTimeOff(setIsLoadingTable);
      setTimeOff(timeOff);
    };

    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  const handleConfirmation = async (protocol: string) => {
    setModalConfirmationOpen(true);
    setProtocol(protocol);
  }

  const handleDelete = async () => {
    
    try {
      setIsActionLoading(true);

      await deleteTimeOffByProtocolAsync(
        protocol
      );

      toast.success('Solicitação removida com sucesso!');
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error) {
      console.error('Erro ao remover solicitação:', error);
      toast.error('Erro ao remover solicitação.');
    } finally {
      setModalConfirmationOpen(false);
      setIsActionLoading(false);
      setProtocol('');
    }
  };

   const handleCancel = () => {
    if (!isActionLoading) { 
      setModalConfirmationOpen(false);
      setProtocol('');
    }
  };

  const handleViewDetails = (timeOff: ITimeOff) => {
    setSelectedTimeOff(timeOff);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTimeOff(null);
    setProtocol('');
  };

  const pendingCount = timeOff.filter(item => item.status === 2).length;
  const approvedCount = timeOff.filter(item => item.status === 3).length;
  const rejectedCount = timeOff.filter(item => item.status === 4).length;
  const totalCount = timeOff.length;

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
        <div className="w-full max-w-screen-2xl bg-gray-800 shadow-2xl rounded-2xl p-6 md:p-8 text-white border border-gray-700">

          <h1 className="text-3xl font-extrabold text-blue-400 text-center mb-8 border-b border-gray-700 pb-4">
            Histórico de Solicitações
          </h1>

          <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por protocolo, email ou aprovador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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

              <div className="w-full sm:w-64 relative">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 pl-10 pr-8 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer hover:bg-gray-600"
                  >
                    <option value="all">Todos Status</option>
                    <option value="2">Pendentes</option>
                    <option value="3">Aprovados</option>
                    <option value="4">Rejeitados</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-400 bg-gray-700/50 px-4 py-2 rounded-lg whitespace-nowrap">
              {statusFilter === 'all' && `Total: ${filteredTimeOff.length} solicitações`}
              {statusFilter === '2' && `Pendentes: ${filteredTimeOff.length} de ${pendingCount}`}
              {statusFilter === '3' && `Aprovados: ${filteredTimeOff.length} de ${approvedCount}`}
              {statusFilter === '4' && `Rejeitados: ${filteredTimeOff.length} de ${rejectedCount}`}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Todos ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('2')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === '2'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Pendentes ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('3')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === '3'
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Aprovados ({approvedCount})
            </button>
            <button
              onClick={() => setStatusFilter('4')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === '4'
                ? 'bg-red-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Rejeitados ({rejectedCount})
            </button>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-xl bg-gray-800">
            {isLoadingTable && !timeOff.length ? (
              <div className="flex justify-center items-center h-64">
                <span className="flex items-center text-lg text-gray-400">
                  <DetailedLoader sizeClass="h-8 w-8 text-blue-400 mr-3" />
                  Carregando solicitações...
                </span>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/70">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Protocolo
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Solicitante
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Horas
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Data Criação
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Aprovador
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-200 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800 relative z-10">
                  {paginatedFiles.length > 0 ? (
                    paginatedFiles.map((timeOff) => (
                      <tr key={timeOff.protocol} className="hover:bg-gray-700/30 transition-colors duration-200">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-400 font-mono">
                            {timeOff.protocol}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-200 max-w-[200px] truncate" title={timeOff.userEmail}>
                            {timeOff.userEmail}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-200">
                            <div>{formatDate(timeOff.startDate)}</div>
                            <div className="text-sm text-gray-400">até {formatDate(timeOff.endDate)}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
                            {formatHourToHM(timeOff.hour)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${timeOff.status === 3
                            ? 'bg-green-500/20 text-green-300'
                            : timeOff.status === 4
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                            }`}>
                            {getStatusText(timeOff.status)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-200">
                            {formatDateCreateAt(timeOff.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-200 max-w-[150px] truncate" title={timeOff.approver || ''}>
                            {timeOff.approver ? (
                              <span className="text-green-400">{timeOff.approver}</span>
                            ) : (
                              <span className="text-gray-500 italic">Não definido</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={() => handleViewDetails(timeOff)}
                              className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 group"
                            >
                              <GoEye className="w-5 h-5 mr-2" />
                              Visualizar
                            </button>

                            {timeOff.status === 2 && (
                              <button
                                onClick={() => handleConfirmation(timeOff.protocol)}
                                className="inline-flex items-center p-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                title='Remover solicitação'
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <div className="text-5xl mb-4">
                            {statusFilter !== 'all' ? '🔍' : '📋'}
                          </div>
                          <div className="text-xl font-medium mb-2">
                            {searchTerm
                              ? 'Nenhuma solicitação encontrada'
                              : statusFilter !== 'all'
                                ? `Nenhuma solicitação ${getStatusText(parseInt(statusFilter)).toLowerCase()}`
                                : 'Nenhuma solicitação cadastrada'
                            }
                          </div>
                          <div className="text-sm">
                            {searchTerm
                              ? 'Tente ajustar os termos da busca.'
                              : statusFilter !== 'all'
                                ? 'Tente alterar o filtro de status.'
                                : 'As solicitações aparecerão aqui.'
                            }
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
            <div className="mt-6 flex justify-between items-center flex-col sm:flex-row gap-4">
              <p className="text-sm text-gray-400">
                Exibindo <span className="text-white font-medium">{startIndex + 1}</span> a <span className="text-white font-medium">{Math.min(endIndex, filteredTimeOff.length)}</span> de <span className="text-white font-medium">{filteredTimeOff.length}</span> registros
                {(searchTerm || statusFilter !== 'all') && <span> (filtrado de {timeOff.length} total)</span>}
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition relative z-10"
                >
                  <FaChevronLeft />
                </button>
                <span className="text-sm font-semibold text-white min-w-20 text-center">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition relative z-10"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      <HistoryTimeOffModal
        timeOff={selectedTimeOff}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <ConfirmModal
        open={isModalConfirmationOpen}
        onConfirm={handleDelete}
        message={`Deseja remover esta solicitação?`}
        subMessage={`Protocolo: ${protocol}`}
        onCancel={handleCancel}
        isLoading={isActionLoading}
      />
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

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatDateCreateAt = (timestamp: number): string => {
  const date = new Date(timestamp);
  const datePart = date.toLocaleDateString('pt-BR');
  const timePart = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return `${datePart} ${timePart}`;
};

const getStatusText = (status: number): string => {
  switch (status) {
    case 2: return 'Pendente';
    case 3: return 'Aprovado';
    case 4: return 'Rejeitado';
    default: return 'Pendente';
  }
};

const DetailedLoader: React.FC<{ sizeClass: string }> = ({ sizeClass }) => (
  <svg className={`animate-spin ${sizeClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default HistoryTimeOff;