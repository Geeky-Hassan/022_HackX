/**
 * VideoPlayerComponent
 *
 * Handles video playback with secure URL fetching.
 * Fetches temporary signed URLs from the backend when user clicks play.
 * Includes error handling for expired URLs and loading states.
 */

"use client";
import React, {useState, useCallback, useRef} from "react";
import {Play, Loader2, AlertCircle, RefreshCw} from "lucide-react";
import {useToast} from "../../components/Toast";

interface VideoPlayerComponentProps {
  jobId: string;
  topic?: string;
  message?: string;
}

export const VideoPlayerComponent: React.FC<VideoPlayerComponentProps> = ({
  jobId,
  topic = "Video",
  message,
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const {showToast} = useToast();

  /**
   * Fetches secure video URL from the backend
   * Called every time user wants to play the video
   */
  const fetchVideoUrl = useCallback(async (): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/videos/${jobId}/stream-url`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch video URL");
      }

      const data = await response.json();
      return data.signed_url;
    } catch (err: any) {
      console.error("Error fetching video URL:", err);
      setError(err.message || "Failed to load video");
      showToast({
        message: `Failed to load video: ${err.message}`,
        status: "error",
        duration: 5000,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [jobId, showToast]);

  /**
   * Handles play button click
   * Fetches new URL and starts playback
   */
  const handlePlay = useCallback(async () => {
    const url = await fetchVideoUrl();
    if (url) {
      setVideoUrl(url);
      setHasPlayed(true);

      // Auto-play the video once URL is set
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch((err) => {
            console.error("Auto-play failed:", err);
            showToast({
              message: "Click the play button on the video to start playback",
              status: "info",
              duration: 3000,
            });
          });
        }
      }, 100);
    }
  }, [fetchVideoUrl, showToast]);

  /**
   * Handles retry for failed video loads
   */
  const handleRetry = useCallback(() => {
    setError(null);
    setVideoUrl(null);
    handlePlay();
  }, [handlePlay]);

  /**
   * Handles video errors (e.g., expired URL)
   */
  const handleVideoError = useCallback(() => {
    setError("Video failed to load. The link may have expired.");
    setVideoUrl(null);
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Video Container */}
      <div className="relative">
        {!hasPlayed && !isLoading && !error ? (
          /* Initial Play Button State */
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 text-center">
            <div className="mb-4">
              <div
                className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 hover:bg-blue-600 transition-colors cursor-pointer group"
                onClick={handlePlay}
              >
                <Play className="w-6 h-6 text-white ml-1 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-sm text-gray-600">{topic}</p>
            </div>
          </div>
        ) : isLoading ? (
          /* Loading State */
          <div className="bg-gray-50 p-8 text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600">Loading video...</p>
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
        ) : videoUrl ? (
          /* Video Player */
          <div className="relative">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-auto"
              onError={handleVideoError}
              onLoadStart={() => setIsLoading(false)}
              preload="metadata"
            >
              <p className="text-sm text-gray-600 p-4">
                Your browser doesn&apos;t support video playback.
              </p>
            </video>

            {/* Refresh URL Button (for expired links) */}
            <button
              onClick={handlePlay}
              className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg text-xs transition-all"
              title="Refresh video link"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VideoPlayerComponent;
