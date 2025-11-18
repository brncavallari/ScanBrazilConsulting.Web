import React, { useEffect, useState } from "react";
import Navbar from "@components/navbar/navbar";
import type { ClonableIconCardProps, HoursBalance, RemarksTableProps } from "@interfaces/IWorkTimer";
import { getUserTimerByEmailAsync } from "@services/userTimerService";
import type { IRemark } from "@interfaces/IUser";

const mockRemarks: IRemark[] = [
  { value: "-10", updateAt: new Date("2025-10-25T10:00:00"), description: "Período de férias de 10 dias úteis." },
  { value: "20", updateAt: new Date("2025-11-01T15:30:00"), description: "Compensação de horas extras trabalhadas." },
  { value: "25", updateAt: new Date("2025-11-15T09:00:00"), description: "Ausência por 2 dias devido a atestado." },
];

const WorkTimer: React.FC = () => {
  const [hoursBalance, setHoursBalance] = useState<HoursBalance>({
    hour: 0,
    remark: mockRemarks,
  });

  useEffect(() => {
    const fetchUserTimer = async () => {
      try {
        const response = await getUserTimerByEmailAsync();

        if (response && typeof response.hour === "number") {
          setHoursBalance({
            hour: response.hour * 60,
            remark: mockRemarks,
          });
        } else {
          setHoursBalance({
            hour: 0,
            remark: mockRemarks, 
          });
        }
      } catch (err) {
        setHoursBalance({
          hour: 0,
          remark: mockRemarks,
        });
        console.error("Erro ao buscar dados do timer:", err);
      }
    };

    fetchUserTimer();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex flex-1 justify-center p-6 sm:p-10">
        <div className="w-full max-w-4xl space-y-8">
          <MainBalanceCard
            title="Total Disponível"
            value={hoursBalance.hour}
            color="text-blue-400"
          />
          
          <RemarksTable remarks={hoursBalance.remark} /> 
        </div>
      </main>
    </div>
  );
};

const RemarksTable: React.FC<RemarksTableProps> = ({ remarks }) => {
  if (remarks.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-xl">
        <p className="text-gray-400">Nenhuma observação registrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700/50">
      <h3 className="text-xl text-center font-bold text-white mb-4 border-b border-gray-700 pb-2">
        Observações
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Descrição
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                Valor
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Atualizado em
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {remarks.map((remark, index) => (
              <tr key={index} className="hover:bg-gray-700 transition duration-150 ease-in-out">
                 <td className="px-2 py-4 text-sm text-center text-gray-300 max-w-xs truncate">
                  {remark.description}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-blue-400">
                  {remark.value}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">
                  {formatDate(remark.updateAt.toString())}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MainBalanceCard: React.FC<ClonableIconCardProps> = ({
  title,
  value,
  color,
}) => {
  const timeColorClass = value < 0 ? "text-red-500" : "text-green-500";

  return (
    <div
      className={`p-8 rounded-2xl bg-gray-800 shadow-2xl border ${color.replace(
        "text-",
        "border-"
      )} transition hover:bg-gray-700/50 w-full`}
    >
      <div className="flex justify-center items-center mb-4">
        <h3 className="text-2xl font-extrabold text-blue-400 text-center mb-6 border-b border-gray-700 pb-3">
          {title}
        </h3>
      </div>
      <p
        className={`text-3xl md:text-3xl font-extrabold text-center ${timeColorClass}`}
      >
        {formatTime(value)}
      </p>
    </div>
  );
};

function formatTime(value: number): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const hours = Math.floor(absValue / 60);
  const minutes = absValue % 60;
  const formatted = `${hours}h ${minutes}m`;
  return isNegative ? `-${formatted}` : formatted;
}

function formatDate(dateString?: string): string {
  if (!dateString || dateString == '0001-01-01T00:00:00') return "—";
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Data Inválida";
    }
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default WorkTimer;