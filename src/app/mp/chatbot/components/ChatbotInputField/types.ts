export type AttachmentWithStatus = {
  file: File;
  status: "uploading" | "complete" | "error";
  url?: string;
  progress?: number;
};


