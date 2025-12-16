import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { ReceiptFile } from '@interfaces/IReceiptFile';
import { HiOutlineUpload, HiOutlineTrash } from 'react-icons/hi';
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { FaFilePdf, FaFileImage, FaFileCsv, FaFileAlt } from "react-icons/fa";
import { fileToBase64 } from '../../functions/index';

const MultipleFileUploader: React.FC<{
    files: ReceiptFile[];
    setFiles: React.Dispatch<React.SetStateAction<ReceiptFile[]>>;
}> = ({ files, setFiles }) => {

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const newFiles: ReceiptFile[] = await Promise.all(
            acceptedFiles.map(async (file) => ({
                name: file.name,
                file,
                preview: await fileToBase64(file)
            }))
        );

        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }, [setFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/pdf': ['.pdf'],
            'text/csv': ['.csv'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'application/vnd.ms-excel': ['.xls']
        },
        multiple: true
    });

    const removeFile = (fileName: string) => {
        setFiles(prevFiles => prevFiles.filter(f => f.file.name !== fileName));
    };

    const removeAllFiles = () => {
        setFiles([]);
    };

    const isImageFile = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        return ['png', 'jpg', 'jpeg'].includes(extension || '');
    };

    const getFileIcon = (fileName: string, preview?: string) => {
        if (isImageFile(fileName) && preview) {
            return (
                <img
                    src={preview}
                    alt={fileName}
                    className="h-20 w-20 object-cover rounded-md"
                />
            );
        }

        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'xlsx':
            case 'xls':
                return <PiMicrosoftExcelLogoDuotone className="text-green-400 text-4xl" />;
            case 'pdf':
                return <FaFilePdf className="text-red-400 text-4xl" />;
            case 'csv':
                return <FaFileCsv className="text-yellow-400 text-4xl" />;
            case 'png':
            case 'jpg':
            case 'jpeg':
                return <FaFileImage className="text-blue-400 text-4xl" />;
            default:
                return <FaFileAlt className="text-gray-400 text-4xl" />;
        }
    };

    const previews = files.map(f => (
        <div
            key={f.file.name}
            className="flex flex-col items-center p-3 border border-gray-700 rounded-lg bg-gray-700/50 relative group shadow-lg w-full max-w-[200px]"
        >
            <div className="h-20 w-20 flex items-center justify-center">
                {getFileIcon(f.file.name, f.preview)}
            </div>

            <p
                className="mt-2 text-xs text-gray-400 w-full truncate text-center"
                title={f.file.name}
            >
                {f.file.name}
            </p>

            <p className="text-xs text-gray-500 mt-1">
                {(f.file.size / 1024 / 1024).toFixed(2)} MB
            </p>

            <button
                onClick={(e) => { e.stopPropagation(); removeFile(f.file.name); }}
                className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover arquivo"
            >
                <HiOutlineTrash className="h-3 w-3" />
            </button>
        </div>
    ));

    const getAcceptedFormatsText = () => {
        const formats = ['.xlsx', '.pdf', '.csv', '.png', '.jpg', '.jpeg'];
        return formats.join(', ');
    };

    return (
        <section className="mt-4">
            <div
                {...getRootProps()}
                className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 
                ${isDragActive ? 'border-blue-500 bg-gray-700' : 'border-gray-600 hover:border-blue-500/50 bg-transparent'}`}
            >
                <input {...getInputProps()} />
                <HiOutlineUpload className="mx-auto h-8 w-8 text-blue-400" />
                <p className="mt-2 text-white text-sm font-semibold">
                    {files.length === 0
                        ? "*Arraste e solte* os arquivos aqui, ou *clique* para selecionar."
                        : "Adicionar mais arquivos"
                    }
                </p>
                <em className="text-gray-400 text-xs mt-1 block">
                    Formatos aceitos: {getAcceptedFormatsText()}
                </em>
                {files.length > 0 && (
                    <p className="text-green-400 text-xs mt-2">
                        {files.length} arquivo(s) selecionado(s)
                    </p>
                )}
            </div>

            {files.length > 0 && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white text-sm font-semibold">
                            Arquivos selecionados ({files.length})
                        </h4>
                        <button
                            onClick={removeAllFiles}
                            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                        >
                            <HiOutlineTrash className="h-3 w-3" />
                            Remover todos
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {previews}
                    </div>
                </div>
            )}

            {files.length === 0 && (
                <p className="mt-4 text-center text-gray-500 text-xs">
                    Nenhum arquivo anexado. Arraste ou clique para adicionar arquivos.
                </p>
            )}
        </section>
    );
};

export default MultipleFileUploader;

