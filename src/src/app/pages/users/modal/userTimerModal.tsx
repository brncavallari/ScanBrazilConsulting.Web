import React, { useState, useEffect, type FormEvent } from 'react';
import { IoMdClose } from "react-icons/io";
import { IoSaveOutline } from "react-icons/io5";
import { MdEmail, MdAlternateEmail } from "react-icons/md";
import toast from 'react-hot-toast';
import type { IUser, IUserData } from '@interfaces/IUser';
import { createOrUpdateUserTimerAsync } from '@services/userTimerService';

const UserTimerModal: React.FC<{
  user: IUser | null;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    emailAlternative: '',
    hour: '',
    remark: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || '',
        name: user.name || '',
        email: user.email || '',
        emailAlternative: user.emailAlternative || '',
        hour: user.hour?.toString() || '',
        remark: ''
      });
    }
  }, [user]);

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
    e.preventDefault();

    // Validações ANTES do try/catch
    if (!formData.name.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("O email é obrigatório.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor, insira um email válido.");
      return;
    }

    if (formData.emailAlternative && !emailRegex.test(formData.emailAlternative)) {
      toast.error("Por favor, insira um email alternativo válido.");
      return;
    }

    const hoursValue = parseFloat(formData.hour);
    if (isNaN(hoursValue)) {
      toast.error("Por favor, insira um valor numérico válido para as horas.");
      return;
    }

    try {
      setIsLoading(true);

      const userData: IUserData = {
        id: user?.id ?? '',
        email: formData.email.trim(),
        emailAlternative: formData.emailAlternative.trim(),
        hour: hoursValue.toString(),
        remark: formData.remark.trim(),
        name: formData.name.trim()
      };

      await createOrUpdateUserTimerAsync(userData);
      toast.success("Usuário atualizado com sucesso!");

      onSuccess();

    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      toast.error("Erro ao atualizar usuário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h3 className="text-xl font-bold text-blue-400">
            {formData?.id ? "Editar Usuário" : "Cadastrar Usuário"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-gray-700"
            disabled={isLoading}
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-400 mb-2">
              Nome Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Digite o nome completo"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-400 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="email@exemplo.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-500"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdEmail className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="emailAlternative" className="block text-sm font-semibold text-gray-400 mb-2">
              Email Alternativo
            </label>
            <div className="relative">
              <input
                id="emailAlternative"
                name="emailAlternative"
                type="email"
                placeholder="email.alternativo@exemplo.com"
                value={formData.emailAlternative}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-500"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdAlternateEmail className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Horas */}
          <div>
            <label htmlFor="hour" className="block text-sm font-semibold text-gray-400 mb-2">
              Horas Totais
            </label>
            <input
              id="hour"
              name="hour"
              type="text"
              placeholder="Ex: 8.5"
              required
              value={formData.hour}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Horas totais do usuário (use ponto para decimais)
            </p>
          </div>

          {/* Observações */}
          <div>
            <label htmlFor="remark" className="block text-sm font-semibold text-gray-400 mb-2">
              Observações
            </label>
            <textarea
              id="remark"
              name="remark"
              rows={4}
              placeholder="Digite as observações, uma por linha..."
              value={formData.remark}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-500 resize-none"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Cada linha será tratada como uma observação separada
            </p>
          </div>


          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-lg font-bold text-gray-300 bg-gray-700 rounded-xl shadow-md transition duration-200 ease-in-out transform hover:scale-[1.01] hover:bg-gray-600 hover:text-white"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 flex justify-center items-center px-6 py-3 text-lg font-bold rounded-xl shadow-md transition duration-200 ease-in-out transform hover:scale-[1.01]
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
                  <IoSaveOutline className="w-4 h-4 mr-3" />
                  Salvar
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserTimerModal;