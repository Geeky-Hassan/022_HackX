"use client";

import React, {useEffect, useRef, useState} from "react";

interface HighlightPattern {
  pattern: RegExp;
  className: string;
}

interface HighlightedInputProps {
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  highlightPatterns?: HighlightPattern[];
}

interface TextSpan {
  text: string;
  isFlag: boolean;
  className?: string;
}

const FLAGS = ["@quiz", "@visualize", "quiz", "visualize"];

const HighlightedInput: React.FC<HighlightedInputProps> = ({
  value = "",
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  className,
  textareaRef,
  highlightPatterns,
}) => {
  const highlightedContentRef = useRef<HTMLDivElement>(null);
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState("auto");

  // Use the provided ref or fall back to internal ref
  const actualTextareaRef = textareaRef || internalTextareaRef;

  // Adjust height based on content
  useEffect(() => {
    if (highlightedContentRef.current && actualTextareaRef.current) {
      // Get the scroll height of the highlighted content
      const newHeight = highlightedContentRef.current.scrollHeight;

      // Set the height of both elements
      highlightedContentRef.current.style.height = "auto";
      actualTextareaRef.current.style.height = "auto";

      const contentHeight = highlightedContentRef.current.scrollHeight;

      highlightedContentRef.current.style.height = `${contentHeight}px`;
      actualTextareaRef.current.style.height = `${contentHeight}px`;

      setHeight(`${contentHeight}px`);
    }
  }, [value, actualTextareaRef]);

  // Synchronize textarea scroll with highlighted content
  useEffect(() => {
    const textarea = actualTextareaRef.current;
    const highlightedContent = highlightedContentRef.current;

    if (!textarea || !highlightedContent) return;

    const syncScroll = () => {
      highlightedContent.scrollTop = textarea.scrollTop;
      highlightedContent.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener("scroll", syncScroll);
    return () => {
      textarea.removeEventListener("scroll", syncScroll);
    };
  }, [actualTextareaRef]);

  // Create a div with the same content to measure text positions
  const getHighlightedText = (): TextSpan[] => {
    if (!value) {
      return [
        {
          text: "",
          isFlag: false,
        },
      ];
    }

    // If custom patterns are provided, use those instead of default FLAGS
    if (highlightPatterns && highlightPatterns.length > 0) {
      let text = value;
      let spans: TextSpan[] = [];
      let lastIndex = 0;

      // Find matches for each custom pattern
      for (const {pattern, className} of highlightPatterns) {
        let match;
        // Reset regex lastIndex
        pattern.lastIndex = 0;

        while ((match = pattern.exec(text)) !== null) {
          // Add non-flag text before this match
          if (match.index > lastIndex) {
            spans.push({
              text: text.slice(lastIndex, match.index),
              isFlag: false,
            });
          }

          // Add the highlighted text
          spans.push({
            text: match[0],
            isFlag: true,
            className,
          });

          lastIndex = match.index + match[0].length;
        }
      }

      // Add remaining text after last match
      if (lastIndex < text.length) {
        spans.push({
          text: text.slice(lastIndex),
          isFlag: false,
        });
      }

      // If no spans were created (no matches found), return the entire text
      if (spans.length === 0) {
        return [
          {
            text,
            isFlag: false,
          },
        ];
      }

      return spans;
    }

    // Default behavior using FLAGS
    let text = value;
    let spans: TextSpan[] = [];
    let lastIndex = 0;

    // Find all flag occurrences
    FLAGS.forEach((flag) => {
      const regex = new RegExp(`^${flag}\\b|\\s${flag}\\b`, "g");
      let match;

      while ((match = regex.exec(text)) !== null) {
        // Add non-flag text before this match
        if (match.index > lastIndex) {
          spans.push({
            text: text.slice(lastIndex, match.index),
            isFlag: false,
          });
        }

        // Add the flag
        const flagStart = match.index + (match[0].startsWith(" ") ? 1 : 0);
        spans.push({
          text: text.slice(flagStart, flagStart + flag.length),
          isFlag: true,
          className: "text-blue-500 font-medium",
        });

        lastIndex = flagStart + flag.length;
      }
    });

    // Add remaining text after last flag
    if (lastIndex < text.length) {
      spans.push({
        text: text.slice(lastIndex),
        isFlag: false,
      });
    }

    // If no spans were created (no matches found), return the entire text
    if (spans.length === 0) {
      return [
        {
          text: text,
          isFlag: false,
        },
      ];
    }

    return spans;
  };

  return (
    <div className="relative">
      {/* Actual textarea - visible for cursor but with transparent text */}
      <textarea
        ref={actualTextareaRef}
        value={value || ""}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={`${className} transition-[height] duration-200 ease-out relative z-10 text-black caret-black selection:bg-blue-200`}
        placeholder={placeholder}
      />

      {/* Visible div showing highlighted content - positioned behind textarea */}
      <div
        ref={highlightedContentRef}
        className={`${className} transition-[height] duration-200 ease-out absolute inset-0 z-0 pointer-events-none whitespace-pre-wrap break-words`}
        style={{
          overflow: "hidden",
        }}
      >
        {value ? (
          getHighlightedText().map((span, i) => (
            <span
              key={i}
              className={span.isFlag ? span.className || "text-blue-500 font-medium" : "text-black"}
            >
              {span.text}
            </span>
          ))
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
    </div>
  );
};

export default HighlightedInput;
