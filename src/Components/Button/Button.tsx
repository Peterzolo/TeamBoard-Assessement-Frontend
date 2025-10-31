import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "cancel" | "confirm";
  width?: string; // Accepts any valid CSS value
  height?: string; // Accepts any valid CSS value
  maxWidth?: string; // Accepts any valid CSS value
  style?: React.CSSProperties; // For inline styles
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  width = "100px", // Default to a plain CSS value
  height = "auto",
  maxWidth = "640px",
  disabled = false,
  style = {},
  size = "medium",
  ...props
}) => {
  // Define colors for different variants
  const getVariantStyles = (
    variant: "primary" | "secondary" | "tertiary" | "cancel" | "confirm"
  ) => {
    if (disabled) {
      return `bg-gray-400 text-gray-200 cursor-not-allowed opacity-50`; // Disabled state
    }
    switch (variant) {
      case "primary":
        return `bg-blue-800 text-white hover:bg-blue-900 transition-colors duration-200 shadow-lg hover:shadow-xl`;
      case "secondary":
        return `bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200`;
      case "tertiary":
        return `bg-transparent text-purple-700 hover:text-purple-800 transition-colors duration-200`;
      case "cancel":
        return `bg-gray-300 text-blue-500 hover:bg-gray-400 transition-colors duration-200`;
      case "confirm":
        return `border border-red text-blue-500 hover:bg-blue-50 transition-colors duration-200`;
      default:
        return "";
    }
  };

  // Add size-based classes
  const getSizeStyles = (size: "small" | "medium" | "large") => {
    switch (size) {
      case "small":
        return "p-1.5 text-xs";
      case "large":
        return "p-3 text-base";
      case "medium":
      default:
        return "p-2 text-sm";
    }
  };

  return (
    <button
      className={`flex items-center justify-center rounded-[10px] shadow-card ${getSizeStyles(
        size
      )} ${getVariantStyles(variant)} ${className}`}
      style={{
        width,
        height,
        maxWidth,
        ...style, // Merge custom styles with the defaults
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
