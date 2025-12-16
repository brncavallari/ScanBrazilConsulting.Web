import { HiOutlineXCircle } from 'react-icons/hi';

const CancelConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  protocol: string | null;
}> = ({ isOpen, onClose, onConfirm, protocol }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity"
      onClick={onClose}>

      
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center space-x-3 border-b border-gray-700 pb-3 mb-4">
          <HiOutlineXCircle className="h-8 w-8 text-red-500" />
          <h3 className="text-xl font-bold text-white">Confirmação de Cancelamento</h3>
        </div>

        <div className="mb-6">
          <p className="text-gray-300">
            Você tem certeza que deseja **cancelar** a prestação de contas com o protocolo:
          </p>
          <p className="text-lg font-semibold text-yellow-400 mt-2 p-2 bg-gray-700 rounded text-center">
            {protocol}
          </p>
          <p className="text-sm text-center text-red-400 mt-3">
            *Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition duration-150"
          >
            Não, Manter
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition duration-150"
          >
            Sim, Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmationModal;