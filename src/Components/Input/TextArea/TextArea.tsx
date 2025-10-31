"use client";

import React, { forwardRef } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name?: string;
  id?: string;
  variant?: "outlined" | "filled";
  size?: "sm" | "md" | "lg";
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      placeholder = "Enter text...",
      error,
      disabled = false,
      required = false,
      className = "",
      rows = 4,
      maxLength,
      value,
      onChange,
      onBlur,
      name,
      id,
      variant = "outlined",
      size = "md",
    },
    ref
  ) => {
    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "text-sm px-3 py-2";
        case "lg":
          return "text-lg px-4 py-3";
        default:
          return "text-base px-4 py-3";
      }
    };

    const getVariantClasses = () => {
      switch (variant) {
        case "filled":
          return "bg-gray-50 border-gray-300 focus:bg-white focus:border-blue-500";
        default:
          return "bg-white border-gray-300 focus:border-blue-500";
      }
    };

    const getErrorClasses = () => {
      return error
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "focus:ring-blue-200";
    };

    const getDisabledClasses = () => {
      return disabled
        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
        : "text-gray-900";
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={id || name}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            id={id || name}
            name={name}
            rows={rows}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`
              w-full
              ${getSizeClasses()}
              ${getVariantClasses()}
              ${getErrorClasses()}
              ${getDisabledClasses()}
              border
              rounded-lg
              resize-vertical
              transition-all
              duration-200
              focus:outline-none
              focus:ring-2
              focus:ring-opacity-50
              placeholder-gray-400
              ${error ? "pr-10" : ""}
            `}
          />
          
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaExclamationTriangle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <FaExclamationTriangle className="h-3 w-3" />
            {error}
          </p>
        )}
        
        {maxLength && (
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>Maximum {maxLength} characters</span>
            <span>
              {value?.length || 0}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea"; 