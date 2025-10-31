import { Link } from "react-router-dom";
import React from "react";

interface CheckBoxProps {
  label: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  error?: string;
  termsLink?: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  isChecked,
  onChange,
  error,
  termsLink,
}) => {
  const handleCheckboxChange = () => {
    onChange(!isChecked);
  };

  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="appearance-none w-5 h-5 border-2 border-blue-500 rounded-md mr-2 cursor-pointer checked:bg-blue-500"
      />
      <div className="flex flex-wrap gap-1 items-center">
        <span className="mr-2">{label}</span>
        {termsLink && (
          <Link
            to={termsLink}
            className="text-blue-500 hover:underline"
            style={{ textDecoration: "none" }}
          >
            terms and conditions
          </Link>
        )}
      </div>
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </label>
  );
};

export default CheckBox;
