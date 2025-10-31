import React, { type ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </div>
    </div>
  );
};
