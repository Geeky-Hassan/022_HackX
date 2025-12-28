"use client";

import React from "react";
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Info,
    Trophy,
    X
} from "lucide-react";

type AlertType = "success" | "error" | "warning" | "info" | "quiz-complete" | "quiz-cancel";

interface ChatAlertProps {
    type: AlertType;
    title?: string;
    message: string;
    score?: string;
    className?: string;
}

const ChatAlert: React.FC<ChatAlertProps> = ({
    type,
    title,
    message,
    score,
    className = "",
}) => {
    const getAlertConfig = () => {
        switch (type) {
            case "success":
                return {
                    icon: CheckCircle,
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    iconColor: "text-green-500",
                    textColor: "text-green-800",
                    titleColor: "text-green-900",
                };
            case "error":
                return {
                    icon: XCircle,
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    iconColor: "text-red-500",
                    textColor: "text-red-800",
                    titleColor: "text-red-900",
                };
            case "warning":
                return {
                    icon: AlertCircle,
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    iconColor: "text-yellow-500",
                    textColor: "text-yellow-800",
                    titleColor: "text-yellow-900",
                };
            case "info":
                return {
                    icon: Info,
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    iconColor: "text-blue-500",
                    textColor: "text-blue-800",
                    titleColor: "text-blue-900",
                };
            case "quiz-complete":
                return {
                    icon: Trophy,
                    bgColor: "bg-gradient-to-r from-blue-50 to-purple-50",
                    borderColor: "border-blue-200",
                    iconColor: "text-blue-500",
                    textColor: "text-blue-800",
                    titleColor: "text-blue-900",
                };
            case "quiz-cancel":
                return {
                    icon: X,
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    iconColor: "text-gray-500",
                    textColor: "text-gray-700",
                    titleColor: "text-gray-800",
                };
            default:
                return {
                    icon: Info,
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    iconColor: "text-gray-500",
                    textColor: "text-gray-700",
                    titleColor: "text-gray-800",
                };
        }
    };

    const config = getAlertConfig();
    const IconComponent = config.icon;

    return (
        <div className={`flex justify-center my-4 ${className}`}>
            <div
                className={`
          inline-flex items-center gap-3 px-4 py-3 rounded-lg border max-w-md
          ${config.bgColor} ${config.borderColor}
          shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-300
        `}
            >
                <div className="flex-shrink-0">
                    <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                    {title && (
                        <p className={`text-sm font-medium ${config.titleColor} mb-1`}>
                            {title}
                        </p>
                    )}
                    <p className={`text-sm ${config.textColor}`}>
                        {message}
                        {score && (
                            <span className="font-semibold ml-1">{score}</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatAlert; 