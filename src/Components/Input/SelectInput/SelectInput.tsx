"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectInputProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "outlined" | "filled";
  required?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  disabled = false,
  className = "",
  size = "md",
  variant = "outlined",
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !option.disabled
  );

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      }
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-sm px-3 py-2";
      case "lg":
        return "text-lg px-4 py-3";
      default:
        return "text-base px-4 py-2.5";
    }
  };

  const getVariantClasses = () => {
    const baseClasses =
      "border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";

    if (error) {
      return `${baseClasses} border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50`;
    }

    if (disabled) {
      return `${baseClasses} border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed`;
    }

    switch (variant) {
      case "filled":
        return `${baseClasses} border-transparent bg-gray-50 hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-200`;
      default:
        return `${baseClasses} border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-200 bg-white`;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select Input */}
      <div className="relative">
        <div
          ref={inputRef}
          onClick={handleToggle}
          className={`
            ${getSizeClasses()}
            ${getVariantClasses()}
            cursor-pointer select-none
            flex items-center justify-between
            ${isOpen ? "ring-2 ring-blue-500 ring-offset-0" : ""}
          `}
          role="combobox"
          aria-expanded={isOpen ? "true" : "false"}
          aria-haspopup="listbox"
          aria-controls={isOpen ? "select-dropdown" : undefined}
          aria-labelledby={label ? `${label}-label` : undefined}
          aria-label={!label ? placeholder : undefined}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
          <span
            className={`truncate ${
              !selectedOption ? "text-gray-500" : "text-gray-900"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <FaChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown */}
        {isOpen && createPortal(
          <div
            ref={dropdownRef}
            id="select-dropdown"
            className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden"
            style={{
              top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom + 4 : 0,
              left: inputRef.current ? inputRef.current.getBoundingClientRect().left : 0,
              width: inputRef.current ? inputRef.current.getBoundingClientRect().width : 'auto',
            }}
            role="listbox"
            aria-label="Options"
          >
            {/* Search Input (if many options) */}
            {options.length > 8 && (
              <div className="p-2 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  aria-label="Search options"
                />
              </div>
            )}

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  {searchTerm ? "No options found" : "No options available"}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      px-4 py-2.5 cursor-pointer transition-colors duration-150
                      flex items-center justify-between
                      ${
                        option.value === value
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                          : "hover:bg-gray-50 text-gray-700"
                      }
                    `}
                    role="option"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelect(option.value);
                      }
                    }}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.value === value && (
                      <FaCheck className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
