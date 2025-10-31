import React, { useState, useEffect } from "react";

interface FlashMessageProps {
  message: string | null;
  type: "error" | "success";
  height?: number;
  animationDuration?: number;
}

export const FlashMessage: React.FC<FlashMessageProps> = ({
  message,
  type,
  height = 50,
  animationDuration = 0.5,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      setShowMessage(message);
      setTimeout(() => {
        setIsVisible(true);
      }, 100); // Small delay before showing the message

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShowMessage(null), animationDuration * 1000); // Wait for fade-out animation
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!showMessage) return null; // Prevents unneeded rendering

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-80 px-4 py-2 rounded-lg text-white flex items-center justify-center transition-all duration-${
        animationDuration * 1000
      } ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      } ${type === "error" ? "bg-red-500" : "bg-green-500"}`}
      style={{ height: `${height}px` }}
    >
      {showMessage}
    </div>
  );
};
