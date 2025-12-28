"use client";

import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import type React from "react";

interface AgentButtonProps {
  title: string;
  icon: React.ReactNode;
  desc: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  onClick?: () => void;
}

const AgentButton = ({
  title,
  icon,
  desc,
  variant = "primary",
  size = "md",
  active = false,
  onClick,
}: AgentButtonProps) => {
  // Delegate selection logic to parent; keep this component presentational
  const handleButton = () => {
    onClick?.();
  };

  // Tailwind style variants for button appearance by variant type,
  // applying active state styling where needed.
  const variants = {
    primary: `
      bg-transparent 
      text-blue-600
      border border-blue-500
      hover:bg-logo-primary/10 
      active:bg-gradient-to-r active:from-blue-600 active:to-blue-700
      ${active ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-transparent" : ""}
    `,
    secondary: "bg-gray-100 hover:bg-gray-200-600 text-gray-800 border border-gray-200",
    outline:
      "bg-transparent hover:bg-gray-100-800 text-blue-600 border border-blue-500 hover:border-blue-600",
  };

  // Tailwind size variants for button
  const sizes = {
    sm: "text-xs py-1.5 px-3 rounded-full",
    md: "text-sm py-2 px-4 rounded-full",
    lg: "text-base py-2.5 px-5 rounded-full",
  };

  // Icon size adjusts based on button size
  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <Tooltip
      title={desc}
      arrow={true}
      placement="bottom"
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.8)",
            "& .MuiTooltip-arrow": {
              color: "rgba(0, 0, 0, 0.8)",
            },
            fontWeight: 500,
            fontSize: "0.75rem",
            padding: "6px 10px",
            borderRadius: "4px",
          },
        },
      }}
    >
      <motion.button
        onClick={handleButton}
        className={`
          ${variants[variant]} 
          ${sizes[size]} 
          font-medium 
          transition-all 
          duration-200 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500
          focus:ring-opacity-50
          active:scale-95
          transform
          shadow-sm hover:shadow-md
          group
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={title}
      >
        <div className="flex items-center justify-center gap-2 leading-none">
          <span
            className={`${iconSizes[size]} flex-shrink-0 flex items-center justify-center ${active ? "text-white" : "text-dark-logo-primary"
              }`}
          >
            {icon}
          </span>
          <span
            className={`inline-flex items-center ${active ? "text-white" : "text-dark-logo-primary "
              }`}
          >
            {title}
          </span>
        </div>
      </motion.button>
    </Tooltip>
  );
};

export default AgentButton;
