import React, { useState, type FormEvent } from 'react';
import { IoMdClose } from "react-icons/io";
import { BsClockHistory } from "react-icons/bs";
import { IoSaveOutline } from "react-icons/io5";
import toast from 'react-hot-toast';
import DatePickerField from '@components/datePicker/DatePickerField';

const TimeOffModal: React.FC<{
  userHour: number;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ userHour, onClose, onSuccess }) => {
  const [openPicker, setOpenPicker] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    hours: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (value === "") {
      setFormData(prev => ({ ...prev, hours: "" }));
      return;
    }

    value = value.replace(",", ".");

    const regex = /^\d+(\.\d*)?$/;

    if (!regex.test(value)) return;

    setFormData(prev => ({ ...prev, hours: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.hours || !formData.startDate || !formData.endDate) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (formData.endDate < formData.startDate) {
      toast.error("A data final não pode ser antes da inicial.");
      return;
    }

    const requestedMinutes = Number(formData.hours) * 60;

    if (requestedMinutes == 0) {
      toast.error("A quantidade de hora deve ser maior que Zero.");
      return;
    }

    if (requestedMinutes > userHour) {
      toast.error(`A quantidade de horas solicitadas não pode ser maior que ${formatTime(userHour)}.`);
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      toast.success("Horas de folga solicitadas com sucesso!");
      onSuccess();
      onClose();
    }
    catch (err) {
      console.error(err);
      toast.error("Erro ao solicitar as horas.");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">

        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h3 className="text-xl font-bold text-green-400">
            Solicitar Folga - {formatTime(userHour)}
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-gray-700"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Horas (somente positivas)
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="Ex: 8.0"
                value={formData.hours}
                onChange={handleChange}
                disabled={isLoading}
                className="block w-full pl-3 pr-10 py-3 border border-gray-700 bg-gray-700 text-white rounded-lg 
                           focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-500"
              />

              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <BsClockHistory className="w-5 h-5 text-gray-500" />
              </div>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Somente valores positivos serão aceitos.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Data de início
            </label>

            <DatePickerField
              name="start"
              selected={formData.startDate}
              onSelect={date => setFormData(prev => ({ ...prev, startDate: date }))}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
            />

          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Data de fim
            </label>

            <DatePickerField
              name="end"
              selected={formData.endDate}
              onSelect={date => setFormData(prev => ({ ...prev, endDate: date }))}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
            />
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center items-center px-6 py-3 text-lg font-bold rounded-xl shadow-md transition duration-200 ease-in-out transform
              ${isLoading ||
                !formData.hours ||
                !formData.startDate ||
                !formData.endDate
                ? 'bg-blue-600/50 text-white/70 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-800 hover:shadow-lg hover:scale-[1.01] cursor-pointer'
              }`}
            disabled={
              isLoading ||
              !formData.hours ||
              !formData.startDate ||
              !formData.endDate
            }
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
                <IoSaveOutline className="w-5 h-5 mr-3" />
                Salvar
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  function formatTime(value: number): string {
    const isNegative = value < 0;
    const absValue = Math.abs(value);
    const hours = Math.floor(absValue / 60);
    const minutes = absValue % 60;
    const formatted = `${hours}h ${minutes}m`;
    return isNegative ? `-${formatted}` : formatted;
  }
};

export default TimeOffModal;
