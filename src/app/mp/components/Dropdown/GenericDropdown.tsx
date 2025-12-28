import React from "react";

export interface DropdownOption {
  title: string;
  desc?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}
export interface GenericDropdownProps {
  options: DropdownOption[];
  selectedIndex: number;
  onOptionSelect: (option: DropdownOption, index: number) => void;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  isVisible: boolean;
}

const GenericDropdown: React.FC<GenericDropdownProps> = ({
  options,
  selectedIndex,
  onOptionSelect,
  position = "bottom",
  className = "",
  isVisible,
}) => {
  if (!isVisible) return null;

  // Position classes for different dropdown directions
  const positionClasses = {
    top: "bottom-full mb-2 left-0",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  // Animation classes based on position
  const animationClasses = {
    top: "animate-in slide-in-from-bottom-2 fade-in",
    bottom: "animate-in slide-in-from-top-2 fade-in",
    left: "animate-in slide-in-from-right-2 fade-in",
    right: "animate-in slide-in-from-left-2 fade-in",
  };

  return (
    <div
      className={`dropdown-container absolute z-50 ${positionClasses[position]} ${className} transition-all duration-200 ease-out ${animationClasses[position]}`}
    >
      {/* Dropdown Content */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-1 min-w-60 transform transition-all duration-200 ease-out">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onOptionSelect(option, index)}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center transition-all duration-150 ease-in-out transform hover:scale-[1.02] ${
              selectedIndex === index ? "bg-gray-50" : ""
            }`}
          >
            {option.icon && <span className="mr-3 text-gray-500">{option.icon}</span>}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{option.title}</div>
              {option.desc && <div className="text-xs text-gray-500">{option.desc}</div>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenericDropdown;
