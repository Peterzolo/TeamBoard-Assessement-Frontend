import React, { useEffect, useRef } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
}

export const Checkbox2: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  indeterminate,
}) => {
  const checkboxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.style.backgroundColor = indeterminate
        ? ""
        : checked
        ? "#0fcbe3"
        : "transparent";
    }
  }, [checked, indeterminate]);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(!checked);
  };

  return (
    <div className="flex justify-center items-center">
      <div
        ref={checkboxRef}
        className={`w-8 h-8 rounded-md border-2 transition-all cursor-pointer ${
          checked
            ? "bg-[#012235] border-[#012235]"
            : indeterminate
            ? "border-[#ccc]"
            : "bg-transparent border-[#ccc]"
        } hover:border-gray-500`}
        onClick={handleCheckboxClick}
      ></div>
    </div>
  );
};
