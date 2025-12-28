"use client";
import React, {useMemo, useState, useEffect} from "react";
import {Loader2, FileText, Image, BookOpen, CheckCircle, XCircle} from "lucide-react";

interface StoryBookStatusProps {
  jobId: string;
  status: string;
  topic?: string;
  currentPage?: number | null;
  totalPages?: number | null;
  onViewClick?: () => void;
}

const StoryBookStatus: React.FC<StoryBookStatusProps> = ({
  jobId,
  status,
  topic = "Story",
  currentPage = null,
  totalPages = null,
  onViewClick,
}) => {
  // State for alternating page generation statuses
  const [isWritingPhase, setIsWritingPhase] = useState(true);

  // Cycle between writing and drawing phases for page generation
  useEffect(() => {
    const s = (status || "").toLowerCase();
    if (s.startsWith("generating_page_")) {
      const interval = setInterval(() => {
        setIsWritingPhase(prev => !prev);
      }, 3000); // Change every 3 seconds

      return () => clearInterval(interval);
    }
  }, [status]);
  const statusConfig = useMemo(() => {
    const s = (status || "").toLowerCase();
    
    if (s === "initializing") {
      return {
        text: `Preparing your storybook...`,
        icon: BookOpen,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        spinnerColor: "text-blue-600",
      };
    }

    // if (s === "processing_initial_image") {
    //   return {
    //     text: `Analyzing your image...`,
    //     icon: Image,
    //     color: "text-purple-600",
    //     bgColor: "bg-purple-50",
    //     spinnerColor: "text-purple-600",
    //   };
    // }

    // if (s === "splitting_script") {
    //   return {
    //     text: `Writing the story script...`,
    //     icon: FileText,
    //     color: "text-indigo-600",
    //     bgColor: "bg-indigo-50",
    //     spinnerColor: "text-indigo-600",
    //   };
    // }

    // Handle page-specific generation statuses
    if (s.startsWith("generating_page_")) {
      const pageNum = currentPage || 1;
      
      if (isWritingPhase) {
        return {
          text: `Writing script...`,
          icon: FileText,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          spinnerColor: "text-amber-600",
        };
      } else {
        return {
          text: `Drawing visuals...`,
          icon: Image,
          color: "text-green-600",
          bgColor: "bg-green-50",
          spinnerColor: "text-green-600",
        };
      }
    }

    if (s === "generating_images") {
      return {
        text: `Creating beautiful illustrations...`,
        icon: Image,
        color: "text-green-600",
        bgColor: "bg-green-50",
        spinnerColor: "text-green-600",
      };
    }


    if (s === "completed") {
      return {
        text: `Storybook ready!`,
        icon: CheckCircle,
        color: "text-green-700",
        bgColor: "bg-green-50",
        spinnerColor: null,
      };
    }

    if (s === "failed") {
      return {
        text: `Story creation failed`,
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        spinnerColor: null,
      };
    }

    // Fallback for any other status
    return {
      text: status || "Creating your story...",
      icon: Loader2,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      spinnerColor: "text-gray-600",
    };
  }, [status, currentPage, isWritingPhase]);

  const {text, icon: Icon, color, bgColor, spinnerColor} = statusConfig;

  // Special handling for completed status with view button
  if ((status || "").toLowerCase() === "completed" && onViewClick) {
    return (
      <div className={`inline-flex items-center gap-3 px-3 py-2 rounded-lg bg-green-50 border border-gray-200`} data-job-id={jobId}>
        <div className="flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-green-700" />
        </div>

        <div className="flex flex-col">
          <div className="text-sm font-medium text-green-700">Storybook ready!</div>
          <div className="text-xs text-gray-600">
            {topic}
            {typeof currentPage === "number" && typeof totalPages === "number" ? (
              <span className="ml-2">• {currentPage} / {totalPages}</span>
            ) : null}
          </div>
        </div>

        <button
          onClick={onViewClick}
          className="ml-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
        >
          View
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 px-3 py-2 rounded-lg ${bgColor} border border-gray-200`} data-job-id={jobId}>
      <div className="flex items-center justify-center">
        {spinnerColor ? (
          <Loader2 className={`w-4 h-4 ${spinnerColor} animate-spin`} />
        ) : (
          <Icon className={`w-4 h-4 ${color}`} />
        )}
      </div>

      <div className="flex flex-col">
        <div className={`text-sm font-medium ${color}`}>{text}</div>
        <div className="text-xs text-gray-600">
          {topic}
          {typeof currentPage === "number" && typeof totalPages === "number" ? (
            <span className="ml-2">• {currentPage} / {totalPages}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StoryBookStatus;
