import React, { useState, forwardRef, ForwardedRef } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

interface TextInputProps {
  type?: "text" | "password" | "number" | "tel";
  value?: string;
  name?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  width?: string;
  height?: string;
  min?: string | number;
  max?: string | number;
  backgroundColor?: string;
  borderBottomColor?: string;
  labelColor?: string;
  placeholderColor?: string;
  className?: string; // Add className prop
  disabled?: boolean; // Add disabled prop
}

export const TextInput = forwardRef(
  (
    {
      type = "text",
      value,
      name,
      label,
      error,
      min,
      max,
      placeholder,
      onChange,
      onClick,
      backgroundColor = "bg-transparent", // Default to transparent background
      borderBottomColor = "border-gray-300", // Default bottom border color
      labelColor = "text-gray-700", // Default label color
      placeholderColor = "placeholder-gray-500", // Default placeholder color
      className = "", // Default className
      disabled = false, // Default disabled prop
      ...rest
    }: TextInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="relative w-full">
        {label && (
          <label
            htmlFor={name}
            className={`${labelColor} block text-sm font-medium mb-1`}
          >
            {label}
          </label>
        )}
        <input
          id={name}
          type={inputType}
          value={value}
          name={name}
          min={min}
          max={max}
          placeholder={placeholder}
          onChange={onChange}
          onClick={onClick}
          ref={ref}
          className={`w-full p-4 ${backgroundColor} ${placeholderColor} border-b ${borderBottomColor} focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300 ease-in-out ${
            error ? "border-b-red-500" : ""
          } ${className} ${disabled ? "bg-gray-200 cursor-not-allowed" : ""}`} // Apply className and disabled styling
          disabled={disabled} // Apply disabled prop
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            disabled={disabled}
          >
            {showPassword ? (
              <VisibilityOffOutlinedIcon />
            ) : (
              <VisibilityOutlinedIcon />
            )}
          </button>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
