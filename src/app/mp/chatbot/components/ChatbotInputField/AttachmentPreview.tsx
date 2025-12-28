"use client";
import { X, FileText } from "lucide-react";
import React from "react";
import { AttachmentWithStatus } from "./types";

type Props = {
  attachments: AttachmentWithStatus[];
  getFilePreviewUrl: (a: AttachmentWithStatus) => string | null;
  getFileIcon: (file: File) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
  removeAttachment: (index: number) => void;
};

const AttachmentPreview: React.FC<Props> = ({
  attachments,
  getFilePreviewUrl,
  getFileIcon,
  formatFileSize,
  removeAttachment,
}) => {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className="mb-2">
      <div
        className="w-full max-w-full flex flex-row gap-2 overflow-x-auto py-1 whitespace-nowrap"
        style={{ scrollSnapType: "x proximity" }}
      >
        {attachments.map((attachment, index) => (
          <div
            key={index}
            className="flex shrink-0 relative h-full group items-center gap-2 p-1 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-all duration-300 ease-in-out animate-in slide-in-from-top-2 fade-in zoom-in-95"
          >
            <div className="flex-shrink-0">
              {attachment.status === "uploading" ? (
                <div className="w-12 h-12 flex items-center justify-center">
                  <svg className="w-6 h-6 animate-spin text-blue-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </div>
              ) : attachment.file.type.startsWith("image/") ? (
                <img src={getFilePreviewUrl(attachment) || ""} alt={attachment.file.name} className="w-12 h-12 object-cover rounded-md" />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center">{getFileIcon(attachment.file)}</div>
              )}
            </div>

            <div className="flex flex-col justify-center text-xs text-neutral-700 max-w-[140px] min-w-[120px]">
              <div className="font-medium truncate" title={attachment.file.name}>
                {attachment.file.name}
              </div>
              <div className="text-gray-500 uppercase">
                {attachment.file.type.startsWith("image/") ? attachment.file.type.replace("image/", "") : attachment.file.type === "application/pdf" ? "PDF" : attachment.file.type || "File"}
              </div>
            </div>

            <button
              onClick={() => removeAttachment(index)}
              className="flex-shrink-0 p-1 text-neutral-900 bg-white rounded-full absolute -right-2 -top-2 opacity-100 transform scale-100 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md hover:bg-gray-50"
              aria-label="Remove attachment"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentPreview;


