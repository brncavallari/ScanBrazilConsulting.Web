import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { ReceiptFile } from '@interfaces/IExpenses';
import { HiOutlineUpload, HiOutlineTrash } from 'react-icons/hi';

const FileUploader: React.FC<{
    files: ReceiptFile[];
    setFiles: React.Dispatch<React.SetStateAction<ReceiptFile[]>>;
}> = ({ files, setFiles }) => {

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];
        
        const newFile: ReceiptFile = {
            name: file.name,
            file,
            preview: await fileToBase64(file)
        };

        setFiles([newFile]);
    }, [setFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        },
        multiple: false
    });

    const removeFile = () => {
        setFiles([]);
    };

    const previews = files.map(f => (
        <div
            key={f.file.name}
            className="flex flex-col items-center p-3 border border-gray-700 rounded-lg bg-gray-700/50 relative group shadow-lg w-full"
        >
            <div className="h-20 w-auto flex items-center justify-center text-green-400 text-6xl">
                📄
            </div>

            <p
                className="mt-2 text-xs text-gray-400 w-full truncate text-center"
                title={f.file.name}
            >
                {f.file.name}
            </p>

            <button
                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover"
            >
                <HiOutlineTrash className="h-4 w-4" />
            </button>
        </div>
    ));

    return (
        <section className="mt-4">
            <div
                {...getRootProps()}
                className={`w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 
                // *** AJUSTE: Fundo transparente para se misturar com o formulário pai ***
                ${isDragActive ? 'border-blue-500 bg-gray-700' : 'border-gray-600 hover:border-blue-500/50 bg-transparent'}`}
            >
                <input {...getInputProps()} />
                <HiOutlineUpload className="mx-auto h-8 w-8 text-blue-400" />
                <p className="mt-2 text-white text-sm font-semibold">
                    *Arraste e solte* o arquivo aqui, ou *clique* para selecionar.
                </p>
                <em className="text-gray-400 text-xs mt-1 block">
                    (Apenas 1 arquivo é permitido: .xlsx)
                </em>
            </div>

            {files.length > 0 ? (
                <aside className="mt-4 flex justify-center">
                    {previews}
                </aside>
            ) : (
                <p className="mt-4 text-center text-gray-500 text-xs">Nenhum arquivo anexado.</p>
            )}
        </section>
    );
};

export default FileUploader;

function fileToBase64(file: File): string | PromiseLike<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

