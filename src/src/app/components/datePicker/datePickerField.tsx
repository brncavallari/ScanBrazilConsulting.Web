import { useState, useRef, useEffect } from "react";

interface Props {
  start: Date | undefined;
  end: Date | undefined;
  onChange: (value: { start: Date | undefined; end: Date | undefined }) => void;
}

export default function DatePickerField({ start, end, onChange }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const datepickerRef = useRef<HTMLDivElement>(null);

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  useEffect(() => {
    setSelectedStartDate(start || null);
    setSelectedEndDate(end || null);
  }, [start, end]);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (datepickerRef.current && !datepickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); 

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`}></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      const isPast = isPastDate(day);

      let className = "flex items-center justify-center w-8 h-8 rounded-full text-gray-100";

      if (isPast) {
        className += " text-gray-500 cursor-not-allowed opacity-50";
      } else {
        className += " cursor-pointer hover:bg-blue-100 hover:text-blue-700";
      }

      const isStart = !isPast && selectedStartDate &&
        day.toDateString() === selectedStartDate.toDateString();

      const isEnd = !isPast && selectedEndDate &&
        day.toDateString() === selectedEndDate.toDateString();

      const isBetween = !isPast && selectedStartDate && selectedEndDate &&
        day > selectedStartDate && day < selectedEndDate;

      if (isStart) {
        className = "flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full cursor-pointer";
      }
      if (isEnd) {
        className = "flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full cursor-pointer";
      }
      if (isBetween) {
        className = "flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full cursor-pointer";
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayDay = new Date(day);
      todayDay.setHours(0, 0, 0, 0);

      if (todayDay.getTime() === today.getTime()) {
        if (!isStart && !isEnd && !isBetween && !isPast) {
          className = "flex items-center justify-center w-8 h-8 rounded-full border border-blue-500 text-blue-100 cursor-pointer";
        }
      }

      daysArray.push(
        <div
          key={i}
          className={className}
          onClick={() => !isPast && handleDayClick(day)}
        >
          {i}
        </div>
      );
    }

    return daysArray;
  };

  const handleDayClick = (selectedDay: Date) => {
    if (isPastDate(selectedDay)) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(selectedDay);
      setSelectedEndDate(null);
      onChange({ start: selectedDay, end: undefined });
    } else {
      if (selectedDay < selectedStartDate) {
        setSelectedStartDate(selectedDay);
        setSelectedEndDate(selectedStartDate);
        onChange({ start: selectedDay, end: selectedStartDate });
      } else {
        setSelectedEndDate(selectedDay);
        onChange({ start: selectedStartDate, end: selectedDay });
      }
    }
  };

  const updateInput = () => {
    if (selectedStartDate && selectedEndDate) {
      return `${selectedStartDate.toLocaleDateString("pt-BR")} - ${selectedEndDate.toLocaleDateString("pt-BR")}`;
    } else if (selectedStartDate) {
      return selectedStartDate.toLocaleDateString("pt-BR");
    } else {
      return "Selecione as datas";
    }
  };

  const toggleDatepicker = () => {
    setIsOpen(!isOpen);
  };

  const handleApply = () => {
    if (selectedStartDate && isPastDate(selectedStartDate)) {
      alert("Não é possível selecionar datas no passado");
      return;
    }

    if (selectedEndDate && isPastDate(selectedEndDate)) {
      alert("Não é possível selecionar datas no passado");
      return;
    }

    if (selectedStartDate && selectedEndDate) {
      onChange({ start: selectedStartDate, end: selectedEndDate });
    } else if (selectedStartDate) {
      onChange({ start: selectedStartDate, end: undefined });
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDayOfPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
    lastDayOfPrevMonth.setHours(0, 0, 0, 0);

    if (lastDayOfPrevMonth >= today) {
      setCurrentDate(new Date(prevMonth));
    }
  };

  return (
    <div className="relative w-full" ref={datepickerRef}>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </span>

        <input
          type="text"
          placeholder="Selecione as datas"
          className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2.5 pl-10 pr-8 text-white text-sm placeholder-gray-400 outline-none transition focus:border-blue-500"
          value={updateInput()}
          onClick={toggleDatepicker}
          readOnly
        />

        <span className="absolute right-3 cursor-pointer text-gray-400 hover:text-white" onClick={toggleDatepicker}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 rounded-lg border border-gray-600 bg-gray-800 shadow-xl max-h-[380px] overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-700 text-gray-300"
                onClick={handlePrevMonth}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </button>

              <div className="text-sm font-semibold text-white">
                {currentDate.toLocaleString("pt-BR", { month: "long" })} {currentDate.getFullYear()}
              </div>

              <button
                type="button"
                className="p-1 rounded hover:bg-gray-700 text-gray-300"
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-100">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>

            <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-600">
              <button
                type="button"
                className="px-3 py-1.5 text-xs rounded border border-gray-500 text-gray-300 hover:bg-gray-700"
                onClick={handleCancel}
              >
                Limpar
              </button>
              <button
                className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleApply}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}