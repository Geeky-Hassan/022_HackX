/**
 * PPTPlayerComponent
 *
 * Handles PPT download with secure URL fetching.
 * Fetches temporary signed URLs from the backend when user clicks download.
 * Includes error handling for expired URLs and loading states.
 */

"use client";
import React, {useState, useCallback} from "react";
import {Download, Loader2, AlertCircle, RefreshCw, FileVideo, ExternalLink} from "lucide-react";
import {useToast} from "../../components/Toast";

interface PPTDownloadComponentProps {
  jobId: string;
  topic?: string;
  message?: string;
}

export const PPTPlayerComponent: React.FC<PPTDownloadComponentProps> = ({
  jobId,
  topic = "PPT Video",
  message,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {showToast} = useToast();

  /**
   * Fetches secure PPT URL from the backend and triggers download
   */
  const handleDownload = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/ppt/${jobId}/video-url`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch PPT URL");
      }

      const data = await response.json();
      const downloadUrl = data.signed_url;

      // Create download link and trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${topic.replace(/[^a-zA-Z0-9]/g, "_")}_presentation.mp4`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast({
        message: "PPT video download started!",
        status: "success",
        duration: 3000,
      });
    } catch (err: any) {
      console.error("Error downloading PPT:", err);
      setError(err.message || "Failed to download PPT");
      showToast({
        message: `Failed to download PPT: ${err.message}`,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [jobId, topic, showToast]);

  /**
   * Handles retry for failed downloads
   */
  const handleRetry = useCallback(() => {
    setError(null);
    handleDownload();
  }, [handleDownload]);

  /**
   * Opens the PPT video in a new tab for preview
   */
  const handlePreview = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/ppt/${jobId}/video-url`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch PPT URL");
      }

      const data = await response.json();
      const previewUrl = data.signed_url;

      // Open in new tab
      window.open(previewUrl, "_blank", "noopener,noreferrer");

      showToast({
        message: "Opening PPT video in new tab",
        status: "success",
        duration: 2000,
      });
    } catch (err: any) {
      console.error("Error previewing PPT:", err);
      setError(err.message || "Failed to preview PPT");
      showToast({
        message: `Failed to preview PPT: ${err.message}`,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [jobId, showToast]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* PPT Download Container */}
      <div className="relative">
        {isLoading ? (
          /* Loading State */
          <div className="bg-gray-50 p-8 text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600">Preparing download...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-red-50 p-8 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-red-700 mb-3">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        ) : (
          /* Download Interface */
          <div className="bg-gradient-to-br from-emerald-50 to-blue-100 p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileVideo className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">PPT Video Ready</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your {topic} presentation video is ready for download
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Video
                </button>
                <button
                  onClick={handlePreview}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Preview
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Download the PPT video file by &apos;Clicking&apos; the 3 dots then
                &apos;Download&apos; from the next page that opens.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PPTPlayerComponent;
