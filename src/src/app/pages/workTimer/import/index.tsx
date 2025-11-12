import MonthYearPicker from "@components/monthYearPicker/monthYearPicker";
import Navbar from "@components/navbar/navbar";
import type { ReceiptFile } from "@interfaces/IReceiptFile";
import FileUploader from "@components/fileUploader/fileUploader";
import { useState, type FormEvent } from "react";
import React from "react";
import toast, { Toaster } from 'react-hot-toast';
import type { UploadWorkTimer } from '@interfaces/IWorkTimer';
import { uploadWorkTimerAsync } from '@services/workTimerService';

const ImportWorkTimer: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [referenceMonth, setReferenceMonth] = useState<string>('');
    const [receiptFiles, setReceiptFiles] = useState<ReceiptFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
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

            setReferenceMonth('');
            setReceiptFiles([]);
            setIsLoading(false);
        }
        catch (err) {
            toast.error(`Falha ao realizar a importação`);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
            <Navbar />
            <Toaster position="top-center" reverseOrder={false} />

            <main className="flex flex-1 justify-center items-start pt-20 p-6">
                <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-sm text-white border border-gray-700">
                    <h1 className="text-2xl font-semibold text-center mb-8 text-blue-400">Importar Planilha de Horas</h1>

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
            </main>
        </div>
    );
};

export default ImportWorkTimer;