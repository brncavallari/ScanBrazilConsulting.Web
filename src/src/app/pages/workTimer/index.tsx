import React, { useEffect, useState } from "react";
import Navbar from "@components/navbar/navbar";
import type { ClonableIconCardProps, HoursBalance } from "@interfaces/IWorkTimer";
import { getUserTimerAsync } from "@services/userTimerService";

const WorkTimer: React.FC = () => {
  const [hoursBalance, setHoursBalance] = useState<HoursBalance>({
    totalMinutes: 0,
    lastUpdated: "—",
  });

  useEffect(() => {
    const fetchUserTimer = async () => {
      try {
        const response = await getUserTimerAsync();

        if (response && typeof response.hour === "number") {
          setHoursBalance({
            totalMinutes: response.hour,
            lastUpdated: response.updateAt ?? "—",
          });
        } else {
          setHoursBalance({
            totalMinutes: 0,
            lastUpdated: "—",
          });
        }
      } catch (err) {
        setHoursBalance({
          totalMinutes: 0,
          lastUpdated: "—",
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
        <div className="w-full max-w-xl space-y-8">
          <MainBalanceCard
            title="Total Disponível"
            value={hoursBalance.totalMinutes}
            color="text-blue-400"
          />

          <p className="mt-3 text-center text-sm text-gray-500">
             Última atualização: {formatDate(hoursBalance.lastUpdated)}
          </p>
        </div>
      </main>
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
        <h3 className="text-3xl font-semibold text-center mb-2 text-blue-400">
          {title}
        </h3>
      </div>
      <p
        className={`text-5xl md:text-4xl font-extrabold text-center ${timeColorClass}`}
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
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
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
