import type { ConfirmModalProps } from "@interfaces/IModalConfirmation";
import { IoMdClose } from "react-icons/io";

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
      className="fixed inset-0 z-50 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative border border-gray-700 animate-slide-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-700 pb-6 mb-6">
          <h2 className=" font-semibold text-white">{title}</h2>

          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-1 rounded-full transition"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <p className="text-gray-300 mb-6 text-sm">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
