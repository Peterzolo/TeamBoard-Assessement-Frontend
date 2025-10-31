import React from "react";
import PropTypes from "prop-types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const OpaqueModal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,5,5,0.3)]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose} // Clicking on overlay closes modal
      />

      {/* Modal Content (Prevents click from closing modal) */}
      <div
        className="relative z-10 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-[90%] sm:w-[500px] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent modal close on click inside
      >
        {children}
      </div>
    </div>
  );
};

OpaqueModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default OpaqueModal;
