import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '@components/navbar/navbar';
import ImportModal from '@pages/workTimer/import/modal/importModal'
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { getWorkTimerImportedAsync, removeWorkTimerImported } from '@services/workTimerService'
import { FaTrashAlt } from "react-icons/fa";
import type { ImportedFile } from '@interfaces/IWorkTimer';
import ConfirmModal from '../../../components/modalConfirmation/confirmModal';

const fetchWorkTimerImported = async (setIsHistoryLoading: (loading: boolean) => void): Promise<ImportedFile[]> => {
    try {
        setIsHistoryLoading(true);
        const response = await getWorkTimerImportedAsync();

        const workTimerImported: ImportedFile[] = (response || []).map((item: any) => ({
            id: item.id,
            fileName: item.fileName,
            createdAt: item.createdAt,
            year: item.year,
            month: item.month,
        }));

        return workTimerImported;

    } catch (error) {
        console.error("Erro ao carregar histórico via API GET:", error);
        toast.error("Falha ao carregar importações.");
        return [];
    } finally {
        setIsHistoryLoading(false);
    }
};

const ImportWorkTimer: React.FC = () => {
    const [importedFiles, setImportedFiles] = useState<ImportedFile[]>([]);
    const [fileIdToDelete, setFileIdToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmationOpen, setModalConfirmationOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const files = await fetchWorkTimerImported(setIsHistoryLoading);
            setImportedFiles(files);
            setCurrentPage(1);
        };

        fetchData();
    }, [refreshTrigger]);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedFiles = importedFiles.slice(startIndex, endIndex);
    const totalPages = Math.ceil(importedFiles.length / ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const formatDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleModalSuccessAndClose = () => {
        setIsModalOpen(false);
        setRefreshTrigger(prev => prev + 1);
    }

    const handlerDelete = async () => {
        if (!fileIdToDelete) return;

        try {
            await removeWorkTimerImported(fileIdToDelete);
            toast.success("Planilha removida com Sucesso");
        }
        catch (err) {
            toast.error("Erro ao remover Planilha importada");
        }

        setModalConfirmationOpen(false);
        setFileIdToDelete(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const openConfirmation = (id: string) => {
        setFileIdToDelete(id);
        setModalConfirmationOpen(true);
    };

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
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />

            <main className="flex flex-1 justify-center items-start pt-12 p-4 lg:p-6">
                <div className="w-full max-w-6xl bg-gray-800 shadow-2xl rounded-2xl p-6 md:p-8 text-white border border-gray-700">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">

                        <h1 className="text-2xl font-extrabold text-blue-400 text-center mb-6 border-b border-gray-700 pb-3">
                            Histórico de Planilhas Importadas
                        </h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 transform hover:scale-[1.01]"
                        >
                            <GoPlus className="h-5 w-5 mr-2" />
                            Importar
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-xl">
                        {isHistoryLoading && !importedFiles.length ? (
                            <div className="flex justify-center items-center h-40">
                                <span className="flex items-center text-lg text-gray-400">
                                    <DetailedLoader sizeClass="h-8 w-8 text-blue-400 mr-3" />
                                </span>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700/70 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider w-1/2">
                                            Nome do Arquivo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                                            Data de Importação
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider hidden sm:table-cell">
                                            Ano/Mês
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider hidden sm:table-cell">
                                            Ação
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {paginatedFiles.length > 0 ? (
                                        paginatedFiles.map((file) => (
                                            <tr key={file.id} className="hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-white max-w-sm truncate">
                                                    {file.fileName}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-300">
                                                    {formatDate(file.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm text-gray-300 hidden sm:table-cell">
                                                    {file.year}/{file.month}
                                                </td>
                                                <td className="px-6 py-4 text-center text-red-400 hidden sm:table-cell">
                                                    <button
                                                        onClick={() => openConfirmation(file.id)}>
                                                        <FaTrashAlt className="h-5 w-5 mr-2" />
                                                    </button>

                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-6 text-center text-gray-500 text-sm">
                                                {isHistoryLoading ? 'Carregando...' : 'Nenhuma planilha importada ainda.'}
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
                                Exibindo {startIndex + 1} a {Math.min(endIndex, importedFiles.length)} de {importedFiles.length} registros.
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

                    <ConfirmModal
                        open={isModalConfirmationOpen}
                        onConfirm={handlerDelete}
                        onCancel={() => setModalConfirmationOpen(false)}
                    />

                </div>
            </main>

            {isModalOpen && (
                <ImportModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleModalSuccessAndClose}
                />
            )}
        </div>
    );
};

const DetailedLoader: React.FC<{ sizeClass: string }> = ({ sizeClass }) => (
    <svg className={`animate-spin ${sizeClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default ImportWorkTimer;