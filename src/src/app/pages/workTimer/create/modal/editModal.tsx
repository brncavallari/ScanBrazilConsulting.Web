import React, { useState, type FormEvent } from 'react';
import { IoMdClose } from "react-icons/io";
import { BsClockHistory } from "react-icons/bs";
import { IoSaveOutline } from "react-icons/io5";
import toast from 'react-hot-toast';
import type { IUserData, IUser } from '@interfaces/IUser';
import { updateUserTimerAsync } from '@services/userTimerService';

const EditUserModal: React.FC<{
  user: IUser;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ user, onClose, onSuccess }) => {

  const [formData, setFormData] = useState<IUserData>({ hour: "", remark: '', email: '', emailAlternative: ''});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "hour") {
      let raw = value;
      let normalized = raw.replace(",", ".");

      if (raw === "" || raw === "-") {
        setFormData(prev => ({ ...prev, hour: raw }));
        return;
      }

      const regex = /^-?\d+(\.\d*)?$/;

      if (!regex.test(normalized)) {
        return;
      }

      setFormData(prev => ({ ...prev, hour: raw }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      let hoursValue: number;
      setIsLoading(true);

      if (typeof formData.hour === 'string') {
        hoursValue = parseFloat(formData.hour);
        if (isNaN(hoursValue)) {
          toast.error("Por favor, insira um valor numérico válido para as horas.");
          setIsLoading(false);
        }
      } else {
        hoursValue = formData.hour;
      }

      if (hoursValue === 0) {
        toast.error("A hora inserida não pode ser 0.");
        setIsLoading(false);
      }

      if (!formData.remark.trim()) {
        toast.error("Uma descrição é obrigatória para registrar as horas.");
        setIsLoading(false);
      }

      const userData: IUserData = {
        hour: hoursValue.toString(),
        remark: formData.remark.trim(),
        email: formData.email,
        emailAlternative: formData.emailAlternative
      }

      await updateUserTimerAsync(
        userData
      );

      toast.success("Horas cadastradas com Sucesso.");
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setIsLoading(false);
      onSuccess()
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h3 className="text-xl font-bold text-blue-400">{user.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-gray-700">
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="hour" className="block text-sm font-semibold text-gray-400 mb-2">
              Horas (Ex: 8.0 ou -2.5)
            </label>
            <div className="relative">
              <input
                id="hour"
                name="hour"
                type="text"
                step="0.01"
                placeholder="Insira o valor"
                required
                value={formData.hour}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-500 appearance-none"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <BsClockHistory className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              O valor será somado (positivo) ou subtraído (negativo) das horas atuais.
            </p>
          </div>


          <div>
            <label htmlFor="remark" className="block text-sm font-semibold text-gray-400 mb-2">
              Descrição
            </label>
            <textarea
              id="remark"
              name="remark"
              rows={3}
              placeholder="Ex: Banco de horas..."
              required
              value={formData.remark}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-500 resize-none"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center items-center px-6 py-3 text-lg font-bold rounded-xl shadow-md transition duration-200 ease-in-out transform hover:scale-[1.01]
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
                <IoSaveOutline className="w-5 h-5 mr-3" />
                Salvar
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;