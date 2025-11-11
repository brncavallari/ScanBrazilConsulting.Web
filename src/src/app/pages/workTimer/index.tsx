import Navbar from '@components/navbar/navbar';
import React from 'react';

interface HoursBalance {
    totalMinutes: number;
    lastUpdated: string;
}


interface ClonableIconCardProps {
    title: string;
    value: number;
    color: string;
}

const MOCK_HOURS_DATA: HoursBalance = {
    totalMinutes: 146,
    lastUpdated: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
};

function formatTime(value: number): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  const hours = Math.floor(absValue / 60);
  const minutes = absValue % 60;

  const formatted = `${hours}h ${minutes}m`;
  return isNegative ? `-${formatted}` : formatted;
}

const MainBalanceCard: React.FC<ClonableIconCardProps> = ({ title, value, color }) => {
    const timeColorClass = value < 0 ? 'text-red-500' : 'text-green-500';

    return (
        <div className={`p-8 rounded-2xl bg-gray-800 shadow-2xl border ${color.replace('text-', 'border-')} transition hover:bg-gray-700/50 w-full`}>
            <div className="flex justify-center items-center mb-4">
                <h3 className="text-3xl font-semibold text-center mb-2 text-blue-400">{title}</h3>
            </div>
            <p className={`text-5xl md:text-4xl font-extrabold text-center ${timeColorClass}`}>
                {formatTime(value)}
            </p>
        </div>
    );
};

const WorkTimer: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
            <Navbar />

            <main className="flex flex-1 justify-center p-6 sm:p-10">
                <div className="w-full max-w-xl space-y-8">

                    <MainBalanceCard
                        title="Total Disponível"
                        value={MOCK_HOURS_DATA.totalMinutes}
                        color="text-blue-400"
                    />

                    {/* <div className="pt-4">
                        <button
                            onClick={handleRequestTimeOff}
                            className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-xl shadow-blue-500/30 active:scale-[0.99]"
                        >
                            <span className="text-lg">Solicitar Folga Remunerada</span>
                        </button>
                    </div> */}

                    <p className="mt-3 text-center text-sm text-gray-500">
                        Última atualização: {MOCK_HOURS_DATA.lastUpdated}
                    </p>
                </div>
            </main>
        </div>
    );
};

export default WorkTimer;