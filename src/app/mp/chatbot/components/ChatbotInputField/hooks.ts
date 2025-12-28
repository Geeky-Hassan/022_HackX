import { useEffect, useMemo, useCallback, RefObject } from "react";
import {
  MAX_FILE_COUNT,
  MAX_INDIVIDUAL_FILE_SIZE,
  TEXTAREA_MAX_HEIGHT,
  TEXTAREA_MIN_HEIGHT,
} from "./constants";

export const useAutoResizeTextarea = (
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  value: string,
) => {
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = `${TEXTAREA_MIN_HEIGHT}px`;
      if (textarea.scrollHeight > TEXTAREA_MAX_HEIGHT) {
        textarea.style.height = `${TEXTAREA_MAX_HEIGHT}px`;
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.height = `${Math.max(textarea.scrollHeight, TEXTAREA_MIN_HEIGHT)}px`;
        textarea.style.overflowY = "hidden";
      }
    };

    const handleResize = () => requestAnimationFrame(adjustHeight);
    handleResize();
  }, [textareaRef, value]);
};

export const useAttachments = (attachmentsWithStatus: { status: string }[]) => {
  const isUploading = useMemo(
    () => attachmentsWithStatus.some((a) => a.status === "uploading"),
    [attachmentsWithStatus],
  );

  const canAddMoreFiles = useMemo(
    () => attachmentsWithStatus.length < MAX_FILE_COUNT,
    [attachmentsWithStatus.length],
  );

  return { isUploading, canAddMoreFiles };
};

export const useOutsideDropdownCloser = (
  enabled: boolean,
  closeFn: () => void,
) => {
  useEffect(() => {
    if (!enabled) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".dropdown-container") && !target.closest(".chatIconButton")) {
        closeFn();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [enabled, closeFn]);
};

export const validateFile = (file: File): boolean => {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  // Type validation left to caller, which can pass allowed lists
  return !!ext && file.size <= MAX_INDIVIDUAL_FILE_SIZE;
};


