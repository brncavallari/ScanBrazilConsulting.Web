// components/TimeOffDetailModal.tsx
import React from 'react';
import { FaTimes } from "react-icons/fa";
import type { ITimeOff } from '@interfaces/ITimeOff';

interface TimeOffDetailModalProps {
  timeOff: ITimeOff | null;
  isOpen: boolean;
  onClose: () => void;
}

const TimeOffDetailModal: React.FC<TimeOffDetailModalProps> = ({ timeOff, isOpen, onClose }) => {
  if (!isOpen || !timeOff) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-slide-in-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-blue-400">
            Detalhes da Solicitação
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
                Informações da Solicitação
              </h3>
              <div className="space-y-3">
                <DetailItem label="Protocolo" value={timeOff.protocol} />
                <DetailItem label="Solicitante" value={timeOff.userEmail} />
                <DetailItem label="Status" value={
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${timeOff.status === 3 ? 'bg-green-500/20 text-green-300' :
                      timeOff.status === 4 ? 'bg-red-500/20 text-red-300' :
                        'bg-yellow-500/20 text-yellow-300'
                    }`}>
                    {getStatusText(timeOff.status)}
                  </span>
                } />
                <DetailItem label="Horas Solicitadas" value={formatHourToHM(timeOff.hour)} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
                Período e Aprovação
              </h3>
              <div className="space-y-3">
                <DetailItem label="Data de Início" value={formatDate(timeOff.startDate)} />
                <DetailItem label="Data de Término" value={formatDate(timeOff.endDate)} />
                <DetailItem label="Data de Criação" value={formatDateCreateAt(timeOff.createdAt)} />
                <DetailItem
                  label="Aprovador"
                  value={timeOff.approver || <span className="text-gray-500 italic">Não definido</span>}
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-700 pb-2">
              Observações
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 min-h-[48px]">
              <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                {timeOff.remark || <span className="text-gray-500 italic">Nenhuma observação</span>}
              </p>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-700 pb-2">
              Descrição
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 min-h-[48px]">
              <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                {timeOff.description || <span className="text-gray-500 italic">Nenhuma descrição fornecida</span>}
              </p>
            </div>
          </div>


        </div>

        <div className="flex justify-end p-6 border-t border-gray-700 sticky bottom-0 bg-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors duration-200 text-base"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};


const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-600/30 gap-1">
    <span className="text-gray-300 font-medium text-sm min-w-[140px]">{label}:</span>
    <span className="text-gray-400 text-sm text-left break-words flex-1">
      {value}
    </span>
  </div>
);


const formatHourToHM = (value: number): string => {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const hours = Math.floor(absValue);
  const minutes = Math.round((absValue - hours) * 60);
  const formatted = `${hours}h ${minutes}m`;
  return isNegative ? `-${formatted}` : formatted;
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatDateCreateAt = (timestamp: number): string => {
  const date = new Date(timestamp);
  const datePart = date.toLocaleDateString('pt-BR');
  const timePart = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return `${datePart} às ${timePart}`;
};

const getStatusText = (status: number): string => {
  switch (status) {
    case 2: return 'Pendente';
    case 3: return 'Aprovado';
    case 4: return 'Rejeitado';
    default: return 'Pendente';
  }
};

export default TimeOffDetailModal;