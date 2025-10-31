// components/EmptyState.tsx

import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineFileSearch } from "react-icons/ai"; // Example icon

interface EmptyStateProps {
  message: string;
  linkText?: string;
  linkHref?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  linkText,
  linkHref,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-300 rounded-md">
        <AiOutlineFileSearch size={60} className="text-gray-500 mb-4" />{" "}
        {/* Added icon */}
        <p className="text-lg text-gray-600 mb-4">{message}</p>
        {linkText && linkHref && (
          <Link to={linkHref} className="text-blue-600 hover:underline">
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
