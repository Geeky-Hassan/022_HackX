"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { meaningFetcher } from "../../mpHandler/chatbotChatHandler";
import { Tooltip } from "@mui/material";
import { BookOpen, Copy, Check, Loader2 } from "lucide-react";
import CustomMarkdown from "../../components/global/ReactMarkdown";

interface RenderPopoverProps {
  selection: string;
}

const WordMeaningPopover = ({ selection }: RenderPopoverProps) => {
  const [meaning, setMeaning] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [stableSelection, setStableSelection] = useState<string>("");
  const [shouldShow, setShouldShow] = useState<boolean>(false);

  // Memoize the trimmed selection to avoid repeated trim operations
  const trimmedStableSelection = useMemo(() =>
    stableSelection.trim(), [stableSelection]
  );

  // Count the number of words in the selection - memoized to avoid recalculation
  const wordCount = useMemo(() =>
    trimmedStableSelection.split(/\s+/).length, [trimmedStableSelection]
  );

  // Memoize the validity check
  const isSelectionValid = useMemo(() =>
    wordCount <= 3 && wordCount > 0, [wordCount]
  );

  // Debounce the selection update
  useEffect(() => {
    if (!selection) {
      setShouldShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setStableSelection(selection);
      setShouldShow(true);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [selection]);

  // Fetching meaning of the word - memoized with useCallback
  const handleMeaningFetch = useCallback(async () => {
    if (!isSelectionValid) return;

    if (meaning) {
      setMeaning(undefined);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const resp = await meaningFetcher(trimmedStableSelection);
      setMeaning(resp.message);
    } catch (error: any) {
      setError(typeof error === "string" ? error : "Failed to fetch meaning");
    } finally {
      setLoading(false);
    }
  }, [isSelectionValid, meaning, trimmedStableSelection]);

  // Handle copy functionality - memoized with useCallback
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(trimmedStableSelection);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, [trimmedStableSelection]);

  // Memoize tooltip title for better performance
  const tooltipTitle = useMemo(() => {
    if (!isSelectionValid) return "You can't select more than 3 words!";
    return meaning ? "Hide meaning" : "Get meaning";
  }, [isSelectionValid, meaning]);

  // Early return if we shouldn't show the popover
  if (!shouldShow) return null;

  // Memoize the truncated selection display
  const displaySelection = stableSelection.length > 25
    ? `${stableSelection.substring(0, 25)}...`
    : stableSelection;

  return (
    <div className="relative z-50">
      <div className="top-0 left-0 transform -translate-y-full -translate-x-1/2">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-64">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-1.5">
              <BookOpen className="h-3.5 w-3.5 text-blue-500" />
              <h3 className="text-xs font-medium text-gray-700 truncate max-w-[150px]">
                {displaySelection}
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="px-3 py-2">
            {/* Action buttons */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <Tooltip
                  arrow
                  title={tooltipTitle}
                >
                  <span>
                    <button
                      disabled={!isSelectionValid}
                      onClick={handleMeaningFetch}
                      className={`
                        p-1.5 rounded-md transition-colors
                        ${meaning
                          ? "bg-blue-100 text-blue-600 "
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 "
                        }
                        ${!isSelectionValid && "opacity-50 cursor-not-allowed"}
                      `}
                      aria-label={meaning ? "Hide meaning" : "Get meaning"}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </Tooltip>

                <Tooltip arrow title={copied ? "Copied!" : "Copy text"}>
                  <button
                    onClick={handleCopy}
                    className={`
                      p-1.5 rounded-md transition-colors
                      ${copied
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }
                    `}
                    aria-label={copied ? "Copied" : "Copy text"}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </Tooltip>
              </div>

              <div className="text-xs text-gray-500">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </div>
            </div>

            {/* Word meaning content */}
            {loading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin mr-2" />
                <p className="text-xs text-gray-600">Loading...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 rounded p-2 text-center">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            ) : meaning ? (
              <div className="max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 bg-gray-50 rounded p-2">
                <div className="prose prose-sm max-w-none">
                  <CustomMarkdown content={meaning} />
                </div>
              </div>
            ) : (
              <div className="py-1 text-center">
                <p className="text-xs text-gray-500">
                  {isSelectionValid
                    ? "Click the book icon to get the meaning"
                    : "Please select 3 words or fewer to fetch meaning"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pointer */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 -mt-1 border-8 border-transparent border-t-white"></div>
      </div>
    </div>
  );
};

export default WordMeaningPopover;
