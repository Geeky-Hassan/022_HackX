"use client";
import React, { useEffect, useState } from "react";
import { Info, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";

export type ToastStatus = "info" | "success" | "error" | "loading";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "above-chatbot-input";

export interface ToastProps {
  id: string;
  message: string;
  status: ToastStatus;
  duration?: number;
  position?: ToastPosition;
  button?: {
    title: string;
    onClick: () => void;
  };
  closing?: boolean;
  requestClose: (id: string) => void;
  onExited: (id: string) => void;
  showClose?: boolean; // optional close button (defaults to true)
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  status,
  duration = 5000,
  position = "top-center",
  button,
  closing = false,
  requestClose,
  onExited,
  showClose = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0 && status !== "loading") {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, status]);

  useEffect(() => {
    if (closing) handleClose();
  }, [closing]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onExited(id);
    }, 250);
  };

  const getPositionStyles = () => {
    switch (position) {
      case "top-left":
        return "fixed top-4 left-4 z-50";
      case "top-center":
        return "fixed top-4 left-1/2 transform -translate-x-1/2 z-50";
      case "top-right":
        return "fixed top-4 right-4 z-50";
      case "bottom-left":
        return "fixed bottom-4 left-4 z-50";
      case "bottom-center":
        return "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50";
      case "bottom-right":
        return "fixed bottom-4 right-4 z-50";
      case "above-chatbot-input":
        return "fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50";
      default:
        return "fixed top-4 left-1/2 transform -translate-x-1/2 z-50";
    }
  };

  const getEnterExitAnim = () => {
    // Tailwind utility sets for slide/opacity per position
    const enterBase = "opacity-0";
    const exitBase = "opacity-0";
    const animDuration = "transition-all duration-300 ease-out";

    switch (position) {
      case "top-left":
      case "top-center":
      case "top-right":
        return {
          enter: `${enterBase} -translate-y-3`,
          active: "opacity-100 translate-y-0",
          exit: `${exitBase} -translate-y-3`,
          duration: animDuration,
        };
      case "bottom-left":
      case "bottom-center":
      case "bottom-right":
      case "above-chatbot-input":
        return {
          enter: `${enterBase} translate-y-3`,
          active: "opacity-100 translate-y-0",
          exit: `${exitBase} translate-y-3`,
          duration: animDuration,
        };
      default:
        return {
          enter: `${enterBase} -translate-y-3`,
          active: "opacity-100 translate-y-0",
          exit: `${exitBase} -translate-y-3`,
          duration: animDuration,
        };
    }
  };

  const anim = getEnterExitAnim();

  const getStatusConfig = () => {
    switch (status) {
      case "info":
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          iconColor: "text-blue-500",
          icon: Info,
        };
      case "success":
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          iconColor: "text-blue-500",
          icon: CheckCircle,
        };
      case "error":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-500",
          icon: AlertCircle,
        };
      case "loading":
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          iconColor: "text-blue-500",
          icon: Loader2,
        };
      default:
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          iconColor: "text-blue-500",
          icon: Info,
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  if (!isVisible) return null;

  return (
    <div
      className={`
        ${getPositionStyles()}
        flex items-center gap-3 p-4 rounded-lg border shadow-lg
        ${config.bgColor} ${config.borderColor}
        ${anim.duration}
        ${isExiting ? anim.exit : anim.active}
        max-w-lg w-full mx-4
      `}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${config.iconColor}`}>
        <IconComponent
          className={`w-5 h-5 ${status === 'loading' ? 'animate-spin' : ''}`}
        />
      </div>

      {/* Message */}
      <div className={`flex-1 text-sm font-medium ${config.textColor}`}>
        {message}
      </div>

      {/* Button (optional) */}
      {button && (
        <button
          onClick={button.onClick}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-md
            transition-colors duration-200
            ${status === 'error'
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }
          `}
        >
          {button.title}
        </button>
      )}

      {/* Close button */}
      {showClose && (
        <button
          onClick={() => requestClose(id)}
          className={`
            flex-shrink-0 p-1 rounded-md transition-colors duration-200
            ${config.textColor} hover:bg-black/5
          `}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
