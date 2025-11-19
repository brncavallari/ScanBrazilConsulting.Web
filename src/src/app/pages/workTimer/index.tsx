import React, { useEffect, useState } from "react";
import Navbar from "@components/navbar/navbar";
import type { ClonableIconCardProps, HoursBalance } from "@interfaces/IWorkTimer";
import { getUserTimerByEmailAsync } from "@services/userTimerService";
import RemarksTable from "./remarkTable/remarkTable";



const WorkTimer: React.FC = () => {
  const [hoursBalance, setHoursBalance] = useState<HoursBalance>({
    hour: 0,
    remark: [],
  });

  useEffect(() => {
    const fetchUserTimer = async () => {
      try {
        const response = await getUserTimerByEmailAsync();

        if (response && typeof response.hour === "number") {
          setHoursBalance({
            hour: response.hour * 60,
            remark: response.remarks == null ? [] : response.remarks,
          });
        } else {
          setHoursBalance({
            hour: 0,
            remark: [],
          });
        }
      } catch (err) {
        setHoursBalance({
          hour: 0,
          remark: [],
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

export default WorkTimer;
