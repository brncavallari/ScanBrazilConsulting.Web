import Navbar from '@components/navbar/navbar';
import React, { useState, type FormEvent } from 'react';
import { RiSave3Fill } from "react-icons/ri";
import { TbClockHour5 } from "react-icons/tb";
import { CiMail } from "react-icons/ci";
import toast, { Toaster } from 'react-hot-toast';

const DOMAIN_SUFFIX = '@scanbrazilconsulting.com';

interface TimeEntry {
  emailPrefix: string;
  hours: number;
}

const CreateUserTimer: React.FC = () => {
  const [formData, setFormData] = useState<TimeEntry>({
    emailPrefix: '',
    hours: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'hours') {
      const numberValue = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numberValue) ? 0 : numberValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const fullEmail = `${formData.emailPrefix.trim()}${DOMAIN_SUFFIX}`;
    const hours = formData.hours;

    if (!formData.emailPrefix.trim()) {
      setIsLoading(false);
      return;
    }

    if (hours === 0) {
      setIsLoading(false);
      toast.error("Insira uma hora valida.");
      return;
    }

    setTimeout(() => {
      console.log('Dados submetidos (handleLogin):', {
        email: fullEmail,
        hours: hours,
      });

      setFormData({
        emailPrefix: '',
        hours: 0
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="flex flex-1 justify-center items-start p-4 pt-24 md:p-10">
        <div className="bg-gray-800 shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-lg text-white border border-gray-700">

          <h1 className="text-3xl font-extrabold text-blue-400 text-center mb-6 border-b border-gray-700 pb-3">
            Registro de Horas
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="emailPrefix" className="block text-sm font-semibold text-gray-400 mb-2">
                Email do Usuário (Prefixo)
              </label>
              <div className="flex rounded-lg shadow-sm">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CiMail className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    id="emailPrefix"
                    name="emailPrefix"
                    type="text"
                    placeholder="ex: "
                    required
                    value={formData.emailPrefix}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-0 py-3 border-r-0 border-gray-700 bg-gray-700 text-white rounded-l-lg focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-500"
                    disabled={isLoading}
                  />
                </div>
                <span className="inline-flex items-center px-4 py-3 text-gray-400 bg-gray-900 border border-gray-700 border-l-0 rounded-r-lg text-sm font-mono select-none">
                  {DOMAIN_SUFFIX}
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="hours" className="block text-sm font-semibold text-gray-400 mb-2">
                Horas
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <TbClockHour5 className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  id="hours"
                  name="hours"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 8.0 ou -2.5"
                  required
                  value={formData.hours.toString()}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-lg font-bold rounded-xl shadow-md transition duration-200 ease-in-out transform hover:scale-[1.01]
                ${isLoading
                  ? 'bg-blue-600/50 text-white/70 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : (
                <span className="flex items-center">
                  <RiSave3Fill className="w-5 h-5 mr-3" />
                  Salvar
                </span>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateUserTimer;