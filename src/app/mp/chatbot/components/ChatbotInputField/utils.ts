import { ChatbotMessageType } from "@/types";

export const createMessage = (
  baseProps: Partial<ChatbotMessageType>,
  overrides: Partial<ChatbotMessageType> = {},
): ChatbotMessageType => ({
  newChat: false,
  conversation_id: "",
  role: "user",
  agentName: "PathAI",
  category: "chat",
  content: "",
  ...baseProps,
  ...overrides,
});

export const countWords = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

export const parseAtCommand = (value: string) => {
  const lastAtPos = value.lastIndexOf("@");
  if (lastAtPos === -1) return { lastAtPos, shouldShowDropdown: false, query: "" };
  const isAtStart = lastAtPos === 0;
  const isAfterSpace = lastAtPos > 0 && value[lastAtPos - 1] === " ";
  const validAnchor = isAtStart || isAfterSpace;
  if (!validAnchor) return { lastAtPos, shouldShowDropdown: false, query: "" };

  // Extract the in-progress command token (characters after @ up to a whitespace)
  const afterAt = value.slice(lastAtPos + 1);
  // If user typed a space/newline after starting a command, stop showing dropdown
  if (/\s/.test(afterAt)) return { lastAtPos, shouldShowDropdown: false, query: "" };

  return { lastAtPos, shouldShowDropdown: true, query: afterAt };
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");
  const response = await fetch(`https://api.cloudinary.com/v1_1/dzkmz7m4a/upload`, { method: "POST", body: formData });
  if (!response.ok) throw new Error("Failed to upload file to Cloudinary");
  const data = await response.json();
  return data.secure_url as string;
};


