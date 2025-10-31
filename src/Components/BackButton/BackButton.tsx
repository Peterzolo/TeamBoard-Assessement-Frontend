import React from "react";
import { MdArrowBack } from "react-icons/md";

interface BackButtonProps {
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = () => {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div
      onClick={handleBackClick}
      className="flex items-center gap-2 justify-start cursor-pointer mb-4 hover:opacity-80 transition-opacity"
    >
      <MdArrowBack className="w-5 h-5" /> 
      <span>Back</span>
    </div>
  );
};
