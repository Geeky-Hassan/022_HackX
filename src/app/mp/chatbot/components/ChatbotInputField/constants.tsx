import {DropdownOption} from "@/app/mp/components/Dropdown/GenericDropdown";
import {FileText, Paperclip} from "lucide-react";

export const TEXTAREA_MIN_HEIGHT = 36; // ~single line
export const TEXTAREA_MAX_HEIGHT = 200; // cap before scrolling

export const THINKING_MESSAGE = "Thinking";
export const VISUALIZING_MESSAGE = "Visualizing";
export const ERROR_MESSAGE = "Sorry, an error occurred. Please try again.";
export const VISUALIZATION_ERROR_MESSAGE =
  "Sorry, an error occurred while trying to visualize. Please try again.";

export const ALLOWED_FILE_TYPES = [".jpg", ".jpeg", ".png", ".pdf"];
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const MAX_FILE_COUNT = 7;
export const MAX_INDIVIDUAL_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file

// Dropdown options
export const attachmentOptions: DropdownOption[] = [
  {title: "Upload a file", desc: "JPG, PNG, PDF", icon: <Paperclip className="w-4 h-4" />},
];
export const toolOptions: DropdownOption[] = [
  {
    title: "Connect Google drive",
    desc: "All your school stuff at one place",
    icon: <FileText className="w-4 h-4" />,
  },
];
