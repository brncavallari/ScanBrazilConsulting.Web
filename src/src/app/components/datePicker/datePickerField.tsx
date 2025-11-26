import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";

interface DatePickerField {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  name: string;
  openPicker: string | null;
  setOpenPicker: (value: string | null) => void;
}

export default function CustomDatePicker({
  selected,
  onSelect,
  name,
  openPicker,
  setOpenPicker
}: DatePickerField) {
  const isOpen = openPicker === name;

  return (
    <div className="relative w-full">

      <button
       type="button"
        onClick={() => setOpenPicker(isOpen ? null : name)}
        className="w-full px-4 py-2 bg-gray-300 text-black rounded-lg border border-gray-300 shadow-sm hover:bg-gray-200"
      >
        {selected ? selected.toLocaleDateString("pt-BR") : "Selecionar data"}
      </button>

      {isOpen && (
        <div
          className="
            absolute 
            bottom-[calc(100%+8px)]     /* ⬅ abre para CIMA */
            rounded-xl 
            border border-gray-300 
            bg-white 
            shadow-xl 
            z-50 
            p-3
          "
        >
          <DayPicker
            mode="single"
            locale={ptBR}
            selected={selected}
            onSelect={(date: Date | undefined) => {
              onSelect(date);
              setOpenPicker(null);
            }}
            disabled={{
              before: new Date()
            }}
            defaultMonth={selected}
          />
        </div>
      )}
    </div>
  );
}
