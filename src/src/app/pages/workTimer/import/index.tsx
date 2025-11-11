import MonthYearPicker from "@components/monthYearPicker/monthYearPicker";
import Navbar from "@components/navbar/navbar";
import type { ReceiptFile } from "@interfaces/IExpenses";
import FileUploader from "@components/fileUploader/fileUploader";
import { useState, type FormEvent } from "react";
import React from "react";
import toast, { Toaster } from 'react-hot-toast';

const ImportWorkTimer: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [referenceMonth, setReferenceMonth] = useState<string>('');
    const [receiptFiles, setReceiptFiles] = useState<ReceiptFile[]>([]);
    
    React.useEffect(() => {
        if (receiptFiles.length > 0) {
            setSelectedFile(receiptFiles[0].file);
        } else {
            setSelectedFile(null);
        }
    }, [receiptFiles]);
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!referenceMonth) {
            toast.error('Por favor, selecione o Mês de Referência.');
            return;
        }

        if (!selectedFile) {
            toast.error('Por favor, selecione um Arquivo para importar.');
            return;
        }

        const pureFiles: File[] = receiptFiles.map(f => f.file);

        console.log({
            year: referenceMonth.split('-')[0],
            month: referenceMonth.split('-')[1],
            file: selectedFile.name,
            pureFiles
        });

        toast.success(`Importação realizada com sucesso.`);
        setReferenceMonth('');
        setReceiptFiles([]);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
            <Navbar />
            <Toaster position="top-center" reverseOrder={false} />

            <main className="flex flex-1 justify-center items-start pt-20 p-6">
                <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-sm text-white border border-gray-700">
                    <h1 className="text-2xl font-semibold text-center mb-8 text-blue-400">Importar Planilha de Horas</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Mês de Referência */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300" htmlFor="referenceMonth">
                                Mês de Referência
                            </label>

                            <MonthYearPicker
                                value={referenceMonth}
                                onChange={setReferenceMonth}
                            />
                        </div>

                        {/* Campo Upload de Arquivo (Usando o componente ajustado) */}
                        <div>
                            <FileUploader
                                files={receiptFiles}
                                setFiles={setReceiptFiles}
                            />
                        </div>

                        {/* Botão de Importar */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-500/30 disabled:opacity-50"
                            disabled={!selectedFile}
                        >
                            Importar Dados
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ImportWorkTimer;