import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '@components/navbar/navbar';
import type { ITimeOff } from '@interfaces/ITimeOff';
import { approveTimeOffAsync, getTimeOffByProtocolAsync, rejectTimeOffAsync } from '@services/timeOffService';
import ConfirmModal from '@components/modalConfirmation/confirmModal';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const TimeOffDetail: React.FC = () => {
  const { protocol } = useParams<{ protocol: string }>();
  const navigate = useNavigate();
  const [timeOff, setTimeOff] = useState<ITimeOff>();
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false); // ← NOVO ESTADO para a ação
  const [description, setDescription] = useState('');
  const [isModalConfirmationOpen, setModalConfirmationOpen] = useState(false);
  const [isApprove, setApprove] = useState(false);

  useEffect(() => {
    const fetchTimeOffDetail = async () => {
      if (!protocol) return;

      try {
        setIsLoading(true);

        const timeOff = await getTimeOffByProtocolAsync(
          protocol
        );

        setTimeOff(timeOff);
        setDescription(timeOff.description || '');
      } catch (error) {
        console.error('Erro ao carregar solicitação:', error);
        toast.error('Falha ao carregar os detalhes da solicitação.');
        navigate('/worktimer/approve');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeOffDetail();
  }, [protocol]);

  const handleApproveReject = async () => {
    try {
      setIsActionLoading(true); // ← Usa o NOVO ESTADO

      if (isApprove) {
        await approveTimeOffAsync(protocol!, description);
        toast.success('Solicitação aprovada com sucesso!');
      }
      else {
        await rejectTimeOffAsync(protocol!, description);
        toast.success('Solicitação rejeitada com sucesso!');
      }

    } catch (error) {
      console.error('Erro ao aprovar:', error);
      toast.error('Falha ao aprovar solicitação.');
    }
    finally {
      setIsActionLoading(false); // ← Usa o NOVO ESTADO
      setModalConfirmationOpen(false);
      navigate('/worktimer/approve');
    }
  };

  const openConfirmation = (isApprove: boolean) => {
    setModalConfirmationOpen(true);
    setApprove(isApprove)
  };

  const handleCancel = () => {
    if (!isActionLoading) { // ← Verifica o NOVO ESTADO
      setModalConfirmationOpen(false);
    }
  };  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
      </div>
    );
  }

  if (!timeOff) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex flex-1 justify-center items-center">
          <div className="text-white text-lg">Solicitação não encontrada.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans bg-gradient-to-br from-gray-700 via-gray-900 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />

      <main className="flex flex-1 justify-center items-start pt-12 p-4 lg:p-6">
        <div className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-2xl p-6 md:p-8 text-white border border-gray-700">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 pb-6 border-b border-gray-700">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-blue-400">
                Detalhes da Solicitação
              </h1>
              <p className="text-gray-400 mt-2 relative z-10">Protocolo: {protocol}</p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">

              <span className={`inline-flex items-center px-4 py-3 rounded-full text-sm font-medium border ${timeOff.status === 3
                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                : timeOff.status === 4
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                }`}>
                <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                {getStatusText(timeOff.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
            <div className="space-y-4">

              {/* Card Informações do Solicitante */}
              <div className="bg-gray-700/40 border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors h-48 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-500/20 rounded-md">
                    <span className="text-base">👤</span>
                  </div>
                  <h3 className="text-base font-semibold text-blue-400">Informações do Solicitante</h3>
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1">Email</label>
                    <p className="text-white text-sm">{timeOff.userEmail}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1">Data de Criação</label>
                    <p className="text-white text-sm">{formatDateCreateAt(timeOff.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Card Período */}
              <div className="bg-gray-700/40 border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors h-48 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-green-500/20 rounded-md">
                    <span className="text-base">📅</span>
                  </div>
                  <h3 className="text-base font-semibold text-blue-400">Período Solicitado</h3>
                </div>
                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-center text-gray-400 block mb-1">Data Início</label>
                      <p className="text-white text-sm text-center font-medium">{formatDate(timeOff.startDate)}</p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-center text-gray-400 block mb-1">Data Fim</label>
                      <p className="text-white text-sm text-center font-medium">{formatDate(timeOff.endDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">

              {/* Card Horas */}
              <div className="bg-gray-700/40 border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors h-48 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-purple-500/20 rounded-md">
                    <span className="text-base">⏰</span>
                  </div>
                  <h3 className="text-base font-semibold text-blue-400">Detalhes das Horas</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {formatHourToHM(timeOff.hour)}
                  </div>
                  <p className="text-sm text-gray-400">Horas solicitadas</p>
                </div>
              </div>

              {/* Card Motivo */}
              <div className="bg-gray-700/40 border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors h-48 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-gray-500/60 rounded-md">
                    <span className="text-base">📄</span>
                  </div>
                  <h3 className="text-base font-semibold text-blue-400">Motivo da Solicitação</h3>
                </div>
                <div className="bg-gray-600/30 rounded-md p-3 flex-1 flex items-center">
                  <p className="text-white text-sm leading-relaxed text-center w-full">
                    {timeOff.remark || 'Nenhum motivo informado.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Observação */}
          <div className="mb-6 relative z-10">
            <div className="bg-gray-700/40 border border-gray-600 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Observação (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite uma observação para esta solicitação..."
                rows={3}
                className={`w-full px-3 py-2 bg-gray-600/30 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none text-sm
          ${timeOff.status === 3 || timeOff.status === 4 ? "cursor-not-allowed opacity-60" : ""}`}
                disabled={timeOff.status === 3 || timeOff.status === 4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700 relative z-10">
            <button
              onClick={() => navigate('/worktimer/approve')}
              className="flex items-center gap-2 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition font-medium"
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <button
              onClick={() => openConfirmation(false)}
              className={`
                px-6 py-3 rounded-lg transition font-medium
                text-white
                bg-red-600 hover:bg-red-700
                ${timeOff.status === 3 || timeOff.status === 4 ? "cursor-not-allowed opacity-60" : ""}
              `}
              disabled={timeOff.status === 3 || timeOff.status === 4}
            >
              Rejeitar
            </button>

            <button
              onClick={() => openConfirmation(true)}
              className={`
                px-6 py-3 rounded-lg transition font-medium
                text-white
                bg-green-600 hover:bg-green-700
                ${timeOff.status === 3 || timeOff.status === 4 ? "cursor-not-allowed opacity-60" : ""}
              `}
              disabled={timeOff.status === 3 || timeOff.status === 4}
            >
              Aprovar
            </button>
          </div>

          <ConfirmModal
            open={isModalConfirmationOpen}
            onConfirm={handleApproveReject}
            message={`Deseja ${isApprove ? 'aprovar' : 'rejeitar'} esta solicitação?`}
            subMessage={`Protocolo: ${timeOff.protocol}`}
            onCancel={handleCancel}
            isLoading={isActionLoading}
          />

        </div>
      </main>
    </div>
  );
};

const formatDateCreateAt = (timestamp: number): string => {
  const date = new Date(timestamp);
  const datePart = date.toLocaleDateString('pt-BR');
  const timePart = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return `${datePart} ${timePart}`;
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('pt-BR');
};

const formatHourToHM = (value: number) => {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const hours = Math.floor(absValue);
  const minutes = Math.round((absValue - hours) * 60);
  const formatted = `${hours}h ${minutes}m`;
  return isNegative ? `-${formatted}` : formatted;
};

const getStatusText = (status: number): string => {
  switch (status) {
    case 2: return 'Pendente';
    case 3: return 'Aprovado';
    case 4: return 'Rejeitado';
    default: return 'Desconhecido';
  }
};

export default TimeOffDetail;