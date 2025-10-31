import React, { useState, forwardRef, type ForwardedRef } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface TextInputProps {
  type?: "text" | "number" | "tel" | "password";
  value?: string;
  name?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  border?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  width?: string; // Add width prop
  height?: string; // Add height prop
  min?: string | number;
  max?: string | number;
  backgroundColor?: string;
  borderBottomColor?: string;
  labelColor?: string;
  placeholderColor?: string;
  borderColor?: string; // Add border color prop
  borderRadius?: string; // Add border radius prop
  className?: string; // Add className prop
  disabled?: boolean; // Add disabled prop
  maxLength?: number;
}

export const TextInput2 = forwardRef(
  (
    {
      type,
      value,
      name,
      label,
      error,
      min,
      max,
      maxLength,
      placeholder,
      onChange,
      onClick,
      width = "100%",
      height = "auto",
      backgroundColor = "bg-white/60",
      borderColor = "border-gray-200",
      borderRadius = "rounded-xl",
      labelColor = "text-gray-700",
      placeholderColor = "placeholder-gray-500",
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
      <div className="relative" style={{ width, height }}>
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
          value={value}
          name={name}
          min={min}
          max={max}
          placeholder={placeholder}
          onChange={onChange}
          onClick={onClick}
          ref={ref}
          type={inputType}
          maxLength={maxLength}
          className={`w-full p-4 ${backgroundColor} ${placeholderColor} ${borderRadius} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-pink-300 transition duration-300 ease-in-out ${
            error ? "border-red-500" : ""
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
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  }
);

TextInput2.displayName = "TextInput2";
