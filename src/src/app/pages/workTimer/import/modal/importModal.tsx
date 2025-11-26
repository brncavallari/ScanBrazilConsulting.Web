import React, { useState, useEffect, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import type { ReceiptFile } from '@interfaces/IReceiptFile';
import FileUploader from '@components/fileUploader/fileUploader';
import MonthYearPicker from '@components/monthYearPicker/monthYearPicker';
import { uploadWorkTimerAsync } from '@services/workTimerService';
import type { UploadWorkTimer } from '@interfaces/IWorkTimer';
import { IoMdClose } from "react-icons/io";

const ImportModal: React.FC<{
    onClose: () => void;
    onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [referenceMonth, setReferenceMonth] = useState<string>(''); // YYYY-MM
    const [receiptFiles, setReceiptFiles] = useState<ReceiptFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (receiptFiles.length > 0) {
            setSelectedFile(receiptFiles[0].file);
        } else {
            setSelectedFile(null);
        }
    }, [receiptFiles]);

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault();
            setIsLoading(true);

            if (!referenceMonth) {
                toast.error('Por favor, selecione o Mês de Referência.');
                setIsLoading(false);
                return;
            }

            if (!selectedFile) {
                toast.error('Por favor, selecione um Arquivo para importar.');
                setIsLoading(false);
                return;
            }

            const pureFiles: File[] = receiptFiles.map(f => f.file);

            const uploadWorkTimerPayload: UploadWorkTimer = {
                fileName: selectedFile.name,
                year: referenceMonth.split('-')[0],
                month: referenceMonth.split('-')[1],
                file: pureFiles[0]
            };

            await uploadWorkTimerAsync(
                uploadWorkTimerPayload
            );

            toast.success(`Importação realizada com sucesso.`);
        }
        catch (err) {
            toast.error(`Falha ao realizar a importação`);
            setIsLoading(false);
        }
        finally{
            setReferenceMonth('');
            setReceiptFiles([]);
            setIsLoading(false);
            onSuccess();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative border border-gray-700 animate-slide-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-6">
                    <h2 className="text-xl font-bold text-blue-400">Importar Nova Planilha</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full transition">
                        <IoMdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300" htmlFor="referenceMonth">
                            Mês de Referência
                        </label>

                        <MonthYearPicker
                            value={referenceMonth}
                            onChange={setReferenceMonth}
                        />
                    </div>

                    <div>
                        <FileUploader
                            files={receiptFiles}
                            setFiles={setReceiptFiles}
                        />
                    </div>

                    <button
                            type="submit"
                            className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-lg font-bold rounded-xl shadow-md transition duration-200 ease-in-out transform hover:scale-[1.01]
                            ${isLoading
                                    ? 'bg-blue-600/50 text-white/70 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Salvando...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Importar Dados
                                </span>
                            )}
                        </button>

                </form>
            </div>
        </div>
    );
};

export default ImportModal;