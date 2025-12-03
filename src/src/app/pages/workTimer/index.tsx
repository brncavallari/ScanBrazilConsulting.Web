import React, { useCallback, useEffect, useState } from "react";
import Navbar from "@components/navbar/navbar";
import type { ClonableIconCardProps, HoursBalance } from "@interfaces/IWorkTimer";
import { getUserTimerByEmailAsync } from "@services/userTimerService";
import RemarksTable from "./remarkTable/remarkTable";
import TimeOffModal from "./timeOff/timeOffModal";
import { useNavigate } from "react-router-dom";
import { ToasterComponent } from "@components/toast/toasterComponent";
import { formatTime } from "../../functions/index";

const WorkTimer: React.FC = () => {
  const navigate = useNavigate();
  const [hoursBalance, setHoursBalance] = useState<HoursBalance>({
    hour: 0,
    remark: [],
  });
  
  const [hasEnoughHours, setHasEnoughHours] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserTimer = async () => {
      try {
        const response = await getUserTimerByEmailAsync();

        if (response && typeof response.hour === "number") {
          const hoursInMinutes = response.hour * 60;
          setHoursBalance({
            hour: hoursInMinutes,
            remark: response.remarks == null ? [] : response.remarks,
          });
          setHasEnoughHours(hoursInMinutes > 0); // 8 horas em minutos
        } else {
          setHoursBalance({
            hour: 0,
            remark: [],
          });
          setHasEnoughHours(false);
        }
      } catch (err) {
        setHoursBalance({
          hour: 0,
          remark: [],
        });
        setHasEnoughHours(false);
        console.error("Erro ao buscar dados do timer:", err);
      }
    };

    fetchUserTimer();
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalSuccessAndClose = () => {
    setIsModalOpen(false);
    navigate('/worktimer/history');
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans bg-gradient-to-br from-gray-700 via-gray-900 to-black">
      <Navbar />
      <ToasterComponent />
      
      <main className="flex flex-1 justify-center p-6 sm:p-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-4xl space-y-8">
          <MainBalanceCard
            title="Total Disponível"
            value={hoursBalance.hour}
            color="text-blue-400"
          />

          <div className="w-full">
            <button
              onClick={() => handleOpenModal()}
              disabled={!hasEnoughHours}
              className={`
              w-full text-white py-4 rounded-lg font-semibold 
              transition duration-200 flex items-center justify-center 
              gap-3 text-lg shadow-lg
              ${!hasEnoughHours
                  ? 'bg-gray-600 cursor-not-allowed opacity-70 relative z-10'
                  : 'bg-blue-600 hover:bg-blue-900 cursor-pointer relative z-10'
                }
            `}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Solicitar Folga
            </button>
          </div>

          <RemarksTable remarks={hoursBalance.remark} />
        </div>


        {isModalOpen && (
          <TimeOffModal
            userHour={hoursBalance.hour}
            onClose={handleCloseModal}
            onSuccess={handleModalSuccessAndClose}
          />
        )}

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
      className={`p-8 rounded-2xl bg-gray-800 shadow-5xl border border-gray-500 ${color.replace(
        "text-",
        "border-"
      )} transition hover:bg-gray-500/50 w-full`}
    >
      <div className="flex justify-center items-center mb-4">
        <h3 className="text-3xl font-extrabold text-blue-400 text-center mb-6 border-b border-gray-500 pb-3">
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



export default WorkTimer;