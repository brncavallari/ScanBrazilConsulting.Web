import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlinePlus } from 'react-icons/hi';
import Navbar from '@components/navbar/navbar';
import { useNavigate } from 'react-router-dom';
import FileUploader from '@components/fileUploader/fileUploader';
import ProgressBar from './progressBar/progress'
import { createExpenses } from '@services/expenseService';
import type { RefoundPayload } from '@interfaces/IExpenses';
import type { ReceiptFile } from '@interfaces/IExpenses';
import { getUserName } from '@services/storageService';
import type { Expense } from '@interfaces/IExpenses'

const expenseOptions = [
    { value: 'fuel', label: 'Combustível' },
    { value: 'lunch', label: 'Almoço' },
    { value: 'dinner', label: 'Jantar' },
    { value: 'lodging', label: 'Hotéis e Estadias' },
    { value: 'toll', label: 'Pedágio' },
    { value: 'taxi', label: 'Taxi' },
    { value: 'parking', label: 'Estacionamento' },
    { value: 'others', label: 'Outros' },
];

const formatCurrency = (rawValue: string): string => {
    const numericValue = rawValue.replace(/\D/g, '');
    if (!numericValue) return '';

    const paddedValue = numericValue.padStart(3, '0');
    const cents = paddedValue.slice(-2);
    let reais = paddedValue.slice(0, -2);

    reais = reais.replace(/^0+/, '');
    if (!reais) reais = '0';

    const formattedReais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedReais},${cents}`;
};


const Register: React.FC = () => {

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedType, setSelectedType] = useState(expenseOptions[0].value);
    const [inputValue, setInputValue] = useState('');
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [otherTypeValue, setOtherTypeValue] = useState('');
    const [hasAdvance, setHasAdvance] = useState(false);
    const [advanceValue, setAdvanceValue] = useState('');
    const [receiptFiles, setReceiptFiles] = useState<ReceiptFile[]>([]);
    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/home');
    };

    const calculateTotal = (): number => {
        return expenses.reduce((total, expense) => total + toNumber(expense.value), 0);
    };

    const toNumber = (value: string): number => {
        if (!value) return 0;
        const numericString = value.replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
        const parsed = parseFloat(numericString);
        return isNaN(parsed) ? 0 : parsed;
    };

    const totalFormatted = formatCurrency((calculateTotal() * 100).toFixed(0));

    const handleAdvanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const truncatedValue = rawValue.slice(0, 12);
        setAdvanceValue(`R$ ${formatCurrency(truncatedValue)}`);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const truncatedValue = rawValue.slice(0, 12);
        setInputValue(truncatedValue);
    };

    const getExpenseLabel = (value: string) => {
        return expenseOptions.find(opt => opt.value === value)?.label || value;
    };

    const handleAddExpense = () => {
        if (!inputValue || parseInt(inputValue) === 0) {
            toast.error('Insira um valor válido maior que zero.');
            return;
        }

        if (selectedType === 'Outros' && !otherTypeValue.trim()) {
            toast.error('O campo "Nome do Tipo" não pode ser vazio.');
            return;
        }

        const finalType = selectedType === 'Outros' ? otherTypeValue.trim() : selectedType;

        const newExpense: Expense = {
            id: Date.now(),
            type: finalType,
            value: `R$ ${formatCurrency(inputValue)}`,
        };

        setExpenses(prev => [...prev, newExpense]);
        setInputValue('');
        setOtherTypeValue('');
        setSelectedType(expenseOptions[0].value);
    };

    const handleSubmit = async () => {
        try {
            const totalSpent = parseFloat(calculateTotal().toFixed(2));
            const advance = hasAdvance ? parseFloat(toNumber(advanceValue).toFixed(2)) : 0;
            const userName = getUserName();

            const payload: RefoundPayload = {
                expense: expenses.map((e) => ({
                    id: e.id.toString(),
                    type: e.type,
                    value: parseFloat(toNumber(e.value).toFixed(2)),
                })),
                totalSpent,
                advance,
                userName
            };

            const pureFiles: File[] = receiptFiles.map(f => f.file);
            await createExpenses(payload, pureFiles);

            toast.success("Cadastro realizado com sucesso.");
            setTimeout(() => handleHome(), 2000);
        } catch (error) {
            toast.error("Erro ao cadastrar Despesas. Tente novamente.");
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1 && expenses.length === 0) {
            toast.error('Adicione pelo menos uma despesa para avançar.');
            return;
        }
        if (currentStep === 2 && receiptFiles.length === 0) {
            toast.error('É necessário anexar pelo menos um comprovante para prosseguir.');
            return;
        }

        if (currentStep === 3) {
            if (hasAdvance && (!advanceValue || parseInt(advanceValue) === 0)) {
                toast.error('Informe o valor do adiantamento ou desmarque a opção.');
                return;
            }
        }

        if (currentStep === 4) {
            handleSubmit();
        }

        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const calculateFinalBalance = (): string => {
        const total = calculateTotal();
        const advance = toNumber(advanceValue) || 0;

        const balance = advance - total;
        const balanceCents = Math.round(Math.abs(balance) * 100);

        const formattedBalance = formatCurrency(balanceCents.toString());

        if (balance > 0) {
            return `+ R$ ${formattedBalance}`;
        } else if (balance < 0) {
            return `- R$ ${formattedBalance}`;
        } else {
            return `R$ 0,00`;
        }
    };


    const isNextButtonDisabled =
        (currentStep === 1 && expenses.length === 0) ||
        (currentStep === 2 && receiptFiles.length === 0) ||
        (currentStep === 3 && hasAdvance && (!advanceValue || toNumber(advanceValue) === 0));

    return (
        <div className="min-h-screen bg-gray-900">
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />

            <main className="mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
                <ProgressBar currentStep={currentStep} />

                <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">

                    <h2 className="text-2xl font-bold text-white mb-10 text-center">
                        {currentStep === 1 ? 'Lançamento de Despesas' :
                            currentStep === 2 ? 'Comprovantes' :
                                currentStep === 3 ? 'Confirmação Final' : "Resumo"}
                    </h2>

                    {currentStep === 1 && (
                        <>
                            <div className="flex items-end space-x-6 mb-4 border-b border-gray-700 pb-6">
                                <div className="flex-1 max-w-xs">
                                    <label htmlFor="expense-type" className="block text-sm font-medium text-gray-400 mb-1">Despesa</label>
                                    <select
                                        id="expense-type"
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-3"
                                    >
                                        {expenseOptions.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedType === 'Outros' && (
                                    <div className="flex-1 max-w-xs">
                                        <label htmlFor="other-type" className="block text-sm font-medium text-gray-400 mb-1">
                                            Tipo
                                        </label>
                                        <input
                                            id="other-type"
                                            type="text"
                                            value={otherTypeValue}
                                            onChange={(e) => setOtherTypeValue(e.target.value)}
                                            className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-3"
                                        />
                                    </div>
                                )}

                                <div className={`relative ${selectedType === 'Outros' ? 'max-w-[160px]' : 'flex-1 max-w-xs'}`}>
                                    <label htmlFor="expense-value" className="block text-sm font-medium text-gray-400 mb-1">Valor</label>
                                    <span className="absolute left-0 top-1/2 mt-0.5 ml-3 text-white pointer-events-none">R$</span>
                                    <input
                                        id="expense-value"
                                        type="text"
                                        value={formatCurrency(inputValue)}
                                        onChange={handleValueChange}
                                        placeholder="0,00"
                                        className="w-full rounded-md border-gray-600 bg-gray-700 text-white text-right shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 pr-3 pl-10"
                                    />
                                </div>

                                <button
                                    onClick={handleAddExpense}
                                    disabled={!inputValue}
                                    className={`rounded-md px-4 py-2.5 text-sm font-medium text-white transition duration-150 ease-in-out 
                                        ${!inputValue ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                >
                                    <HiOutlinePlus className="h-5 w-5 inline mr-1" />
                                    Adicionar
                                </button>
                            </div>

                            <div className="border border-gray-700 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/3">Tipo</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/3">Valor</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-1/3">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {expenses.map((expense) => (
                                            <tr key={expense.id} className="hover:bg-gray-700 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{getExpenseLabel(expense.type)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{expense.value}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => setExpenses(expenses.filter(e => e.id !== expense.id))}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Remover Despesa"
                                                    >
                                                        Remover
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {expenses.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500 italic">Nenhuma despesa adicionada ainda.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end mt-4">
                                <div className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg shadow-md">
                                    <span className="text-lg font-semibold text-gray-300">Total:</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        R$ {totalFormatted}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    {currentStep === 2 && (
                        <FileUploader
                            files={receiptFiles}
                            setFiles={setReceiptFiles}
                        />
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2">Detalhes Finais</h3>

                            <div className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg max-w-lg">
                                <input
                                    id="has-advance"
                                    type="checkbox"
                                    checked={hasAdvance}
                                    onChange={(e) => {
                                        setHasAdvance(e.target.checked);
                                        if (!e.target.checked) {
                                            setAdvanceValue('');
                                        }
                                    }}
                                    className="h-5 w-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="has-advance" className="text-lg font-medium text-white select-none">
                                    Houve adiantamento?
                                </label>
                            </div>

                            {hasAdvance && (
                                <div className="max-w-xs pt-4">
                                    <label htmlFor="advance-value" className="block text-sm font-medium text-gray-400 mb-1">
                                        Valor do Adiantamento
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white pointer-events-none">R$</span>
                                        <input
                                            id="advance-value"
                                            type="text"
                                            value={formatCurrency(advanceValue)}
                                            onChange={handleAdvanceChange}
                                            placeholder="0,00"
                                            className="w-full rounded-md border-gray-600 bg-gray-700 text-white text-right shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 pr-3 pl-10"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2">Resumo da Prestação de Contas</h3>

                            <div className="border border-gray-700 rounded-lg overflow-hidden">
                                <h4 className="px-6 py-3 text-lg font-medium text-white bg-gray-700/50">1. Despesas Lançadas</h4>
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {expenses.map((expense) => (
                                            <tr key={expense.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{getExpenseLabel(expense.type)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium text-right">{expense.value}</td>
                                            </tr>
                                        ))}
                                        
                                        <tr className="bg-gray-700 font-bold">
                                            <td className="px-6 py-3 whitespace-nowrap text-md text-white">TOTAL</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-xl text-green-300 text-right">R$ {totalFormatted}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <h4 className="text-lg font-medium text-white border-b border-gray-600 pb-2 mb-2">2. Adiantamento</h4>
                                    <p className="text-sm text-gray-400">Houve Adiantamento: <span className="font-bold text-white">{hasAdvance ? 'Sim' : 'Não'}</span></p>
                                    {hasAdvance && (
                                        <p className="text-sm text-gray-400 mt-2">Valor Adiantado: <span className="font-bold text-lg text-yellow-400">R$ {formatCurrency(advanceValue)}</span></p>
                                    )}
                                </div>

                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <h4 className="text-lg font-medium text-white border-b border-gray-600 pb-2 mb-2">3. Comprovantes Anexados</h4>
                                    <p className="text-sm text-gray-400">Total de arquivos: <span className="font-bold text-white">{receiptFiles.length}</span></p>

                                    <div className="flex flex-wrap gap-2 pt-2 max-h-32 overflow-y-auto">
                                        {receiptFiles.map(file => (
                                            <span key={file.name} className="px-3 py-1 text-xs bg-blue-900/50 text-blue-300 rounded-full truncate max-w-full">
                                                {file.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center mt-6">
                                <div className="p-6 rounded-lg shadow-2xl w-full max-w-md bg-gray-700/70 border border-gray-600">
                                    <h4 className="text-xl font-bold text-white mb-3 text-center">Saldo Final (Despesas - Adiantamento)</h4>
                                    <div className="text-4xl font-extrabold text-center">
                                        <span className={`
                                            ${calculateFinalBalance().startsWith('-') ? 'text-red-400' :
                                                calculateFinalBalance().startsWith('+') ? 'text-blue-400' : 'text-green-400'}
                                        `}>
                                            {calculateFinalBalance()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-center mt-2 text-gray-400">
                                        {calculateFinalBalance().startsWith('+')
                                            ? 'Valor a ser devolvido pelo colaborador.'
                                            : calculateFinalBalance().startsWith('-')
                                                ? 'Valor a ser reembolsado ao colaborador.'
                                                : 'Saldos zerados.'
                                        }
                                    </p>
                                </div>
                            </div>

                            <p className="pt-4 text-3xl text-center text-lg text-gray-100 font-semibold">
                                <b>*Confirme</b> todos os dados para finalizar o envio.
                            </p>
                        </div>
                    )}

                </div>

                <div className="flex justify-between mt-8">
                    <button
                        onClick={handlePrevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center rounded-md px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-150 ease-in-out 
                            ${currentStep === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        <HiOutlineArrowLeft className="h-6 w-6 mr-2" />
                        Voltar
                    </button>

                    <button
                        onClick={handleNextStep}
                        disabled={isNextButtonDisabled}
                        className={`rounded-md px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-150 ease-in-out 
                            ${isNextButtonDisabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {currentStep === 4 ? 'Finalizar Envio' : 'Avançar'}
                    </button>
                </div>

            </main>
        </div>
    );
};

export default Register;