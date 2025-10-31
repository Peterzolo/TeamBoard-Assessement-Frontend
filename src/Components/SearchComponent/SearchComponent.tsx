import React, { useState } from "react";

interface SearchBookingsProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
  textColor?: string; // Custom text color
  backgroundColor?: string; // Custom input background color
  borderColor?: string; // Custom border color
}

export const SearchComponent: React.FC<SearchBookingsProps> = ({
  placeholder,
  onSearch,
  onChange,
  className,
  textColor = "text-gray-800",
  backgroundColor = "bg-white",
  borderColor = "border-gray-300",
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchValue);
      }
    }
  };

  return (
    <input
      type="text"
      value={searchValue}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      className={`w-full p-2 rounded-md border ${textColor} ${backgroundColor} ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};
