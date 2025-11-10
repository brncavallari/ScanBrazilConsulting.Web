import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineUpload, HiOutlineTrash } from 'react-icons/hi';
import type { ReceiptFile } from '@interfaces/IExpenses';

const FileUploader: React.FC<{
    files: ReceiptFile[];
    setFiles: React.Dispatch<React.SetStateAction<ReceiptFile[]>>;
}> = ({ files, setFiles }) => {

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newFiles: ReceiptFile[] = await Promise.all(
            acceptedFiles.map(async (file) => ({
                name: file.name,
                file,
                preview: await fileToBase64(file)
            }))
        );

        setFiles(prev => [...prev, ...newFiles]);
    }, [setFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg'],
            'application/pdf': ['.pdf']
        },
        multiple: true
    });

    const removeFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.file.name !== fileName));
    };

    const previews = files.map(f => (
        <div
            key={f.file.name}
            className="flex flex-col items-center p-3 border border-gray-700 rounded-lg bg-gray-700/50 relative group"
        >
            {f.file.type.startsWith('image/') ? (
                <img
                    src={f.preview}
                    className="h-20 w-auto object-cover rounded-md"
                    alt={f.file.name}
                />
            ) : (
                <div className="h-20 w-auto flex items-center justify-center text-red-400 text-6xl">
                    📄
                </div>
            )}

            <p
                className="mt-2 text-xs text-gray-400 w-full truncate text-center"
                title={f.file.name}
            >
                {f.file.name}
            </p>

            <button
                onClick={(e) => { e.stopPropagation(); removeFile(f.file.name); }}
                className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover"
            >
                <HiOutlineTrash className="h-4 w-4" />
            </button>
        </div>
    ));

    return (
        <section className="mt-6">
            <div
                {...getRootProps()}
                className={`w-full p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 
                ${isDragActive ? 'border-blue-500 bg-gray-700' : 'border-gray-600 hover:border-gray-500'}`}
            >
                <input {...getInputProps()} />
                <HiOutlineUpload className="mx-auto h-12 w-12 text-gray-500" />
                <p className="mt-2 text-white">
                    *Arraste e solte* arquivos aqui, ou *clique* para selecionar.
                </p>
                <em className="text-gray-400 text-sm">
                    (Arquivos suportados: Imagens e PDF. Múltiplos arquivos são permitidos)
                </em>
            </div>
            {files.length > 0 && (
                <aside className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previews}
                </aside>
            )}
        </section>
    );
};

export default FileUploader;
