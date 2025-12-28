"use client";
import {useState} from "react";
import {Copy, Check, Trash2, MoreVertical, ThumbsUpIcon, ThumbsDownIcon} from "lucide-react";
import {Tooltip} from "@mui/material";
import {clearChat} from "../mpHandler/chatbotChatHandler";
export const CopyButton = ({selection, color = undefined}: {selection: string; color?: string}) => {
  const [copied, setCopied] = useState<boolean>(false);
  // -----------------------
  // Copy Message
  // -----------------------
  const handleCopyMessage = async (text: string) => {
    setCopied(true);
    navigator.clipboard.writeText(text);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <>
      {/* 
            // ---------------------------
            // Copy to clipboard
            // ---------------------------
            */}
      {!copied ? (
        <Tooltip arrow={true} title={"Copy"} placement="bottom">
          <button onClick={() => handleCopyMessage(selection)}>
            <Copy
              className={`size-3.5 ${color == undefined ? "text-neutral-400" : "text-white"}`}
            />
          </button>
        </Tooltip>
      ) : (
        <Check
          className={`size-3.5 ${color == undefined ? "dark:text-logo-primary text-text-blue" : "text-white"}`}
        />
      )}
    </>
  );
};

export const ShareButton = () => {
  return (
    <>
      <Tooltip arrow={true} title={"Share Chat"} placement="bottom">
        <button
          onClick={() => {
            console.log("Share");
          }}
        >
          {/* <?xml version="1.0" encoding="UTF-8"?>
    <!-- The Best Svg Icon site in the world: iconSvg.co, Visit us! https://iconsvg.co --> */}
          <svg
            width="22px"
            height="22px"
            version="1.1"
            viewBox="144 144 512 512"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-black" // Stroke color changes with theme
          >
            <g id="IconSvg_bgCarrier" className="stroke-[0]" /> {/* No stroke */}
            <g
              id="IconSvg_tracerCarrier"
              className="stroke-[0]"
              strokeLinecap="round"
              strokeLinejoin="round"
            />{" "}
            {/* No stroke */}
            <g id="IconSvg_iconCarrier">
              <path
                className="fill-black" // Fill color changes with theme
                d="m421.47 258.3 183.2 141.7-183.2 141.7v-88.738h-60.039c-55.867 0-109.37 22.582-148.34 62.613-6.4805 6.6562-17.77 2.0703-17.77-7.2188v-11.414c0-82.785 67.113-149.89 149.89-149.89h76.25z"
              />
            </g>
          </svg>
        </button>
      </Tooltip>
    </>
  );
};
export const DeleteButton = () => {
  return (
    <>
      <Tooltip arrow={true} title={"Delete Chat"} placement="bottom">
        <Trash2 className={`size-4 text-dark-custom-dark-blue`} />
      </Tooltip>
    </>
  );
};
export const MoreButton = () => {
  return (
    <>
      <Tooltip arrow={true} title={"More Options"} placement="bottom">
        <button
          onClick={() => {
            console.log("More Options");
          }}
        >
          <MoreVertical className={`size-4 text-dark-custom-dark-blue`} />
        </button>
      </Tooltip>
    </>
  );
};

export const ThumbsUp = () => {
  const [showNoted, setShowNoted] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setShowNoted(true);
    setTimeout(() => {
      setShowNoted(false);
      setClicked(false);
    }, 1500);
  };

  return (
    <div className="relative">
      <Tooltip arrow={true} title={"Good response!"} placement="bottom">
        <button onClick={handleClick}>
          <ThumbsUpIcon
            className={`size-3.5 ${clicked ? "text-dark-logo-primary" : "text-neutral-400"} hover:scale-110 transition-all duration-200`}
          />
        </button>
      </Tooltip>

      {/* "Noted" animation */}
      {showNoted && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark-custom-blue text-dark-primary-text text-xs px-2 py-1 rounded whitespace-nowrap animate-fade-in-out">
          Noted!
        </div>
      )}
    </div>
  );
};

export const ThumbsDown = () => {
  const [showNoted, setShowNoted] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setShowNoted(true);
    setTimeout(() => {
      setShowNoted(false);
      setClicked(false);
    }, 1500);
  };

  return (
    <div className="relative">
      <Tooltip arrow={true} title={"Useless response :("} placement="bottom">
        <button onClick={handleClick}>
          <ThumbsDownIcon
            className={`size-3.5 ${clicked ? "text-red-500" : "text-neutral-400"} hover:scale-110 transition-all duration-200`}
          />
        </button>
      </Tooltip>

      {/* "Noted" animation */}
      {showNoted && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark-custom-blue text-dark-primary-text text-xs px-2 py-1 rounded whitespace-nowrap animate-fade-in-out">
          Noted!
        </div>
      )}
    </div>
  );
};

export const CodeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={"w-6 h-6"}
    >
      {/* Robot head */}
      <rect x="7" y="4" width="10" height="12" rx="2" />

      {/* Antenna */}
      <line x1="12" y1="4" x2="12" y2="2" />
      <circle cx="12" cy="2" r="0.5" />

      {/* Eyes */}
      <circle cx="9" cy="8" r="1" />
      <circle cx="15" cy="8" r="1" />

      {/* Code brackets */}
      <path d="M7 18l-3 -3l3 -3" />
      <path d="M17 18l3 -3l-3 -3" />

      {/* Code line */}
      <line x1="10" y1="20" x2="14" y2="16" />
    </svg>
  );
};
export const NewtonIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={"w-6 h-6"}
    >
      {/* Robot head */}
      <rect x="7" y="4" width="10" height="12" rx="2" />

      {/* Antenna */}
      <line x1="12" y1="4" x2="12" y2="2" />
      <circle cx="12" cy="2" r="0.5" />

      {/* Eyes */}
      <circle cx="9" cy="8" r="1" />
      <circle cx="15" cy="8" r="1" />

      {/* Newton's apple */}
      <circle cx="12" cy="18" r="2" />

      {/* Apple stem */}
      <line x1="12" y1="16" x2="12" y2="15" />

      {/* Gravity lines */}
      <path d="M9 14l-3 3" />
      <path d="M15 14l3 3" />
    </svg>
  );
};

export const SatIcon = ({className = "", size = 24}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bot head */}
      <rect x="3" y="4" width="18" height="16" rx="2" />

      {/* Bot antenna */}
      <path d="M12 4v-1" />
      <circle cx="12" cy="2" r="1" />

      {/* Bot eyes */}
      <circle cx="8.5" cy="9" r="1.5" />
      <circle cx="15.5" cy="9" r="1.5" />

      {/* Test/exam elements */}
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="17" x2="13" y2="17" />
      <rect x="16" y="16" width="2" height="2" />
    </svg>
  );
};
