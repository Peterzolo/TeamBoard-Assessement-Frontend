import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";


// Optional: register the locale (English UK in this example)
registerLocale("en-GB", enGB);

interface DatePickerProps {
  label?: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
}

export const DateInput: React.FC<DatePickerProps> = ({
  label,
  selectedDate,
  onDateChange,
  placeholder,
  error,
}) => {
  const [date, setDate] = useState<Date | null>(selectedDate);

  const handleDateChange = (date: Date | null) => {
    setDate(date);
    onDateChange(date);
  };

  return (
    <div className="w-full md:w-1/3 p-4">
      <div className="flex items-center">
        <div className="w-full">
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            locale="en-GB"
            dateFormat="dd/MM/yyyy"
            placeholderText={placeholder}
            className="w-[200px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
          />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};
