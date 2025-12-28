/**
 * VideoStatusIndicator Component
 * 
 * Displays real-time status updates during video generation pipeline.
 * Shows progress through different stages: SCRIPTING → CODING → RENDERING → DEBUGGING
 * Similar to the thinking animation but specifically for video generation.
 */

"use client";
import React, { useMemo } from "react";
import { Loader2, FileText, Code, Video, Bug, CheckCircle, XCircle } from "lucide-react";

interface VideoStatusIndicatorProps {
  jobId: string;
  status: "SCRIPTING" | "CODING" | "RENDERING" | "DEBUGGING" | "FAILED" | "COMPLETE";
  topic?: string;
}

export const VideoStatusIndicator: React.FC<VideoStatusIndicatorProps> = ({
  jobId,
  status,
  topic = "video",
}) => {
  // Map status to user-friendly text and icons
  const statusConfig = useMemo(() => {
    switch (status) {
      case "SCRIPTING":
        return {
          text: "PathAI is writing the script...",
          icon: FileText,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          spinnerColor: "text-blue-500",
        };
      case "CODING":
        return {
          text: "PathAI is writing the code...",
          icon: Code,
          color: "text-purple-500",
          bgColor: "bg-purple-50",
          spinnerColor: "text-purple-500",
        };
      case "RENDERING":
        return {
          text: "PathAI is rendering the video...",
          icon: Video,
          color: "text-green-500",
          bgColor: "bg-green-50",
          spinnerColor: "text-green-500",
        };
      case "DEBUGGING":
        return {
          text: "PathAI is debugging an issue...",
          icon: Bug,
          color: "text-orange-500",
          bgColor: "bg-orange-50",
          spinnerColor: "text-orange-500",
        };
      case "FAILED":
        return {
          text: "Video generation failed",
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-50",
          spinnerColor: null, // No spinner for failed state
        };
      case "COMPLETE":
        return {
          text: "Video generation complete!",
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
  }, [status]);

  const { text, icon: Icon, color, bgColor, spinnerColor } = statusConfig;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${bgColor} border border-gray-200`}
      data-job-id={jobId} // For easy identification in DOM
    >
      {/* Status Icon with conditional spinner */}
      <div className="flex items-center justify-center">
        {spinnerColor ? (
          <Loader2 className={`w-4 h-4 ${spinnerColor} animate-spin`} />
        ) : (
          <Icon className={`w-4 h-4 ${color}`} />
        )}
      </div>

      {/* Status Text */}
      <span className={`text-sm font-medium ${color}`}>
        {text}
      </span>

      {/* Topic Badge (if provided) */}
      {topic && status !== "FAILED" && (
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2">
          {topic}
        </span>
      )}
    </div>
  );
};

export default VideoStatusIndicator;