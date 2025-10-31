import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";


// Register the locale
registerLocale("en-GB", enGB);

interface DatePickerProps {
  label?: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  width?: string; // Customizable width (default: responsive)
  height?: string; // Customizable height (default: auto)
}

export const DateInput2: React.FC<DatePickerProps> = ({
  label,
  selectedDate,
  onDateChange,
  placeholder,
  error,
  width = "w-full", // Default responsive width
  height = "h-auto", // Default height
}) => {
  const [date, setDate] = useState<Date | null>(selectedDate);

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date: Date | null) => {
    setDate(date);
    onDateChange(date);
  };

  return (
    <div className={`p-4 ${width}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className={`w-full ${height}`}>
        <DatePicker
          selected={date}
          onChange={handleDateChange}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          locale="en-GB"
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
          placeholderText={placeholder}
          className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 
              focus:border-indigo-500 sm:text-sm cursor-pointer ${width} ${height}`}
        />
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};
