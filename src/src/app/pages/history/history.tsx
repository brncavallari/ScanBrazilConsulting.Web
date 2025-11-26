import React, { useState } from 'react';
import Navbar from '@components/navbar/navbar';
import { HiOutlineEye, HiOutlineXCircle } from 'react-icons/hi';
import CancelConfirmationModal from "./cancel/cancelConfirmationModal"

interface ExpenseRegister {
  id: string;
  protocol: string;
  date: string;
  status: 'Em Análise' | 'Aprovado' | 'Rejeitado' | 'Cancelado' | 'Concluído';
}

const History: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [protocolToCancel, setProtocolToCancel] = useState<string | null>(null);

  const mockRegisters: ExpenseRegister[] = [
    {
      id: '1',
      protocol: 'PST-000456-2025',
      date: '30/10/2025 14:30',
      status: 'Em Análise',
    },
    {
      id: '2',
      protocol: 'PST-000455-2025',
      date: '28/10/2025 09:15',
      status: 'Concluído',
    },
    {
      id: '3',
      protocol: 'PST-000454-2025',
      date: '25/10/2025 11:00',
      status: 'Rejeitado',
    }
  ];

  const handleOpenCancelModal = (protocol: string) => {
    setProtocolToCancel(protocol);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProtocolToCancel(null);
  };

  const handleConfirmCancel = () => {
    if (protocolToCancel) {
      console.log(`CANCELAMENTO CONFIRMADO para o protocolo: ${protocolToCancel}`);
      // Aqui você chamaria sua API para cancelar

      // Exemplo: Atualizar a lista de mock, se necessário
      // setMockRegisters(prev => prev.map(...));

      handleCloseModal(); // Fecha o modal
      // Opcional: toast.success('Cadastro cancelado com sucesso!');
    }
  };

  const getStatusBadge = (status: ExpenseRegister['status']) => {
    let colorClasses = '';
    switch (status) {
      case 'Em Análise':
        colorClasses = 'bg-yellow-800 text-yellow-300';
        break;
      case 'Concluído':
      case 'Aprovado':
        colorClasses = 'bg-green-800 text-green-300';
        break;
      case 'Rejeitado':
      case 'Cancelado':
        colorClasses = 'bg-red-800 text-red-300';
        break;
      default:
        colorClasses = 'bg-gray-700 text-gray-300';
        break;
    }
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>
        {status}
      </span>
    );
  };

  const handleView = (protocol: string) => {
    console.log(`Visualizar protocolo: ${protocol}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold leading-tight text-white">
            Histórico
          </h1>
        </header>

        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Protocolo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {mockRegisters.map((registro) => (
                  <tr key={registro.id} className="hover:bg-gray-700 transition duration-150">

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {registro.protocol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {registro.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(registro.status)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">

                      <button
                        onClick={() => handleView(registro.protocol)}
                        className="text-blue-500 hover:text-blue-400 p-2 rounded-full hover:bg-gray-600 transition duration-150"
                        title="Visualizar Detalhes"
                      >
                        <HiOutlineEye className="h-5 w-5" />
                      </button>

                      {(registro.status === 'Em Análise') && (
                        <button
                          onClick={() => handleOpenCancelModal(registro.protocol)}
                          className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-gray-600 transition duration-150 ml-2"
                          title="Cancelar Cadastro"
                        >
                          <HiOutlineXCircle className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mockRegisters.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              Nenhum registro encontrado.
            </div>
          )}
        </div>
      </div>

      <div className="min-h-screen bg-gray-900">
        <CancelConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmCancel}
          protocol={protocolToCancel}
        />
      </div>
    </div>
  );
};

export default History;