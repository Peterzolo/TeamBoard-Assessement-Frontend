import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const Modal = ({ isOpen, onClose, children, title, size = "md" }: ModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore original overflow style
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-lg";
      case "lg":
        return "max-w-2xl";
      case "xl":
        return "max-w-4xl";
      case "full":
        return "max-w-full mx-4";
      default:
        return "max-w-lg";
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ 
        pointerEvents: 'auto',
      }}
    >
      {/* Backdrop - Semi-transparent overlay that allows page to show through */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal Content */}
      <div 
        className={`relative z-10 bg-white rounded-lg shadow-xl w-11/12 max-h-[90vh] overflow-hidden flex flex-col ${getSizeClasses()}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with title and close button */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className={title ? "overflow-y-auto" : "p-6 overflow-y-auto"}>
          {children}
        </div>
      </div>
    </div>
  );

  // Use portal to render at document body level
  return createPortal(modalContent, document.body);
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "full"]),
};

export default Modal;
