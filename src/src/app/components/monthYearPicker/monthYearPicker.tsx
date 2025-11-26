import React, { useState, useCallback, useMemo, type ChangeEvent } from 'react';
import CalendarIcon from './icons/calendarIcon';

interface MonthYearPickerProps {
    value: string | string; 
    onChange: (value: string) => void;
    placeholder?: string;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ value, onChange, placeholder = 'Selecione Mês e Ano' }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [tempValue, setTempValue] = useState<string>(value);

    const dateParts = value ? value.split('-') : [];
    const currentYear = parseInt(dateParts[0]) || new Date().getFullYear();
    const currentMonth = parseInt(dateParts[1]) || new Date().getMonth() + 1; // 1-indexed

    const months = useMemo(() => [
        { name: 'Jan', index: 1 }, { name: 'Fev', index: 2 }, { name: 'Mar', index: 3 },
        { name: 'Abr', index: 4 }, { name: 'Mai', index: 5 }, { name: 'Jun', index: 6 },
        { name: 'Jul', index: 7 }, { name: 'Ago', index: 8 }, { name: 'Set', index: 9 },
        { name: 'Out', index: 10 }, { name: 'Nov', index: 11 }, { name: 'Dez', index: 12 },
    ], []);

    const years = useMemo(() => {
        const startYear = new Date().getFullYear();
        return Array.from({ length: 5 }, (_, i) => startYear + i);
    }, []);

    const selectedDisplay = useMemo(() => {
        if (!value) return '';
        const [year, month] = value.split('-');
        const monthIndex = parseInt(month);
        const monthName = months.find(m => m.index === monthIndex)?.name;
        return `${monthName} / ${year}`;
    }, [value, months]);

    const handleMonthSelect = useCallback((monthIndex: number) => {
        const newYear = tempValue.split('-')[0] || String(currentYear);
        const newMonth = String(monthIndex).padStart(2, '0');
        setTempValue(`${newYear}-${newMonth}`);
    }, [tempValue, currentYear]);

    const handleYearChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        const newYear = e.target.value;
        const newMonth = tempValue.split('-')[1] || String(currentMonth).padStart(2, '0');
        setTempValue(`${newYear}-${newMonth}`);
    }, [tempValue, currentMonth]);

    const applySelection = useCallback(() => {
        onChange(tempValue);
        setIsOpen(false);
    }, [onChange, tempValue]);

    return (
        <div className="relative">
            <div className="relative">
                <CalendarIcon className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <button
                    type="button"
                    onClick={() => {
                        setTempValue(value || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
                        setIsOpen(!isOpen);
                    }}
                    className="w-full text-left bg-gray-700 text-white rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 flex items-center justify-between shadow-md"
                >
                    {selectedDisplay || <span className="text-gray-400">{placeholder}</span>}
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-20 mt-2 p-4 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-sm">
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Ano</label>
                        <select
                            value={tempValue.split('-')[0] || currentYear}
                            onChange={handleYearChange}
                            className="w-full bg-gray-700 text-white rounded-lg border-gray-600 shadow-sm text-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Month Grid */}
                    <div className="grid grid-cols-4 gap-2">
                        {months.map(month => (
                            <button
                                key={month.index}
                                type="button"
                                onClick={() => handleMonthSelect(month.index)}
                                className={`
                                    p-2 text-sm rounded-lg font-medium transition duration-150 ease-in-out
                                    ${month.index === parseInt(tempValue.split('-')[1])
                                        ? 'bg-blue-500 text-white shadow-md' // Selected month
                                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600' // Normal month
                                    }
                                `}
                            >
                                {month.name}
                            </button>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={applySelection}
                            className="px-4 py-1.5 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default MonthYearPicker;