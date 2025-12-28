/**
 * PPTStatusIndicator Component
 * 
 * Displays real-time status updates during PPT video generation pipeline.
 * Shows progress through different stages: pending → generating_script → generating_audio → generating_slides → composing_video → finalizing → completed
 */

"use client";
import React, { useMemo } from "react";
import { 
  Loader2, 
  FileText, 
  Mic, 
  Image as ImageIcon, 
  Video, 
  Upload, 
  CheckCircle, 
  XCircle,
  Clock,
  Play,
  Download,
  ExternalLink
} from "lucide-react";

interface PPTStatusIndicatorProps {
  jobId: string;
  status: "pending" | "generating_script" | "generating_audio" | "generating_slides" | "composing_video" | "finalizing" | "completed" | "failed";
  topic?: string;
  currentSlide?: number;
  totalSlides?: number;
  progress?: number;
  videoUrl?: string; // Added for completed status
}

export const PPTStatusIndicator: React.FC<PPTStatusIndicatorProps> = ({
  jobId,
  status,
  topic = "presentation",
  currentSlide = 0,
  totalSlides = 0,
  progress = 0,
  videoUrl,
}) => {
  // Action handlers for completed status
  const handlePlay = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  const handleDownload = () => {
    if (videoUrl && topic) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `${topic.replace(/[^a-zA-Z0-9]/g, '_')}_presentation.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenPPT = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Map status to user-friendly text and icons
  const statusConfig = useMemo(() => {
    switch (status) {
      case "pending":
        return {
          text: "PPT job queued, waiting to start...",
          icon: Clock,
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          spinnerColor: "text-gray-500",
        };
      case "generating_script":
        return {
          text: "PathAI is creating presentation narrative...",
          icon: FileText,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          spinnerColor: "text-blue-500",
        };
      case "generating_audio":
        return {
          text: "PathAI is generating audio narration...",
          icon: Mic,
          color: "text-purple-500",
          bgColor: "bg-purple-50",
          spinnerColor: "text-purple-500",
        };
      case "generating_slides":
        return {
          text: `PathAI is creating slide images... (${currentSlide}/${totalSlides})`,
          icon: ImageIcon,
          color: "text-indigo-500",
          bgColor: "bg-indigo-50",
          spinnerColor: "text-indigo-500",
        };
      case "composing_video":
        return {
          text: "PathAI is composing the final video...",
          icon: Video,
          color: "text-green-500",
          bgColor: "bg-green-50",
          spinnerColor: "text-green-500",
        };
      case "finalizing":
        return {
          text: "PathAI is finalizing and uploading...",
          icon: Upload,
          color: "text-teal-500",
          bgColor: "bg-teal-50",
          spinnerColor: "text-teal-500",
        };
      case "failed":
        return {
          text: "PPT generation failed",
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-50",
          spinnerColor: null, // No spinner for failed state
        };
      case "completed":
        return {
          text: "PPT video generation complete!",
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          spinnerColor: null, // No spinner for complete state
        };
      default:
        return {
          text: "Processing...",
          icon: Loader2,
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          spinnerColor: "text-gray-500",
        };
    }
  }, [status, currentSlide, totalSlides]);

  const { text, icon: Icon, color, bgColor, spinnerColor } = statusConfig;

  return (
    <div
      className={`inline-flex flex-col gap-2 w-full max-w-md px-4 py-3 rounded-lg ${bgColor} border border-gray-200`}
      data-job-id={jobId} // For easy identification in DOM
    >
      {/* Main Status Row */}
      <div className="flex items-center gap-3">
        {/* Status Icon with conditional spinner */}
        <div className="flex items-center justify-center">
          {spinnerColor ? (
            <Loader2 className={`w-4 h-4 ${spinnerColor} animate-spin`} />
          ) : (
            <Icon className={`w-4 h-4 ${color}`} />
          )}
        </div>

        {/* Status Text */}
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-medium ${color}`}>
            {text}
          </span>
        </div>

        {/* Topic Badge */}
        {topic && status !== "failed" && (
          <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded-full border">
            {topic}
          </span>
        )}
      </div>

      {/* Progress Bar (only show during active generation) */}
      {status !== "completed" && status !== "failed" && status !== "pending" && progress > 0 && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{progress.toFixed(0)}% complete</span>
            {status === "generating_slides" && totalSlides > 0 && (
              <span>Slide {currentSlide} of {totalSlides}</span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-300 bg-blue-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons for Completed Status */}
      {status === "completed" && videoUrl && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={handlePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
          >
            <Play className="h-3 w-3" />
            Play
          </button>
          <button
            onClick={handleOpenPPT}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
          >
            <ExternalLink className="h-3 w-3" />
            Open PPT
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs font-medium"
          >
            <Download className="h-3 w-3" />
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default PPTStatusIndicator;