import type { ConfirmModalProps } from "@interfaces/IModalConfirmation";
import { IoMdClose } from "react-icons/io";
import { RiErrorWarningFill } from "react-icons/ri";

export default function ConfirmModal({
  open,
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-gray-700 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-all duration-200"
        >
          <IoMdClose size={20} />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-3">
            {title}
          </h2>
          
          <p className="text-gray-300 mb-8 leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-3 rounded-xl bg-gray-700 text-gray-100 hover:bg-gray-600 transition-all duration-200 font-medium hover:scale-105 active:scale-95"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-700 transition-all duration-200 font-medium hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}