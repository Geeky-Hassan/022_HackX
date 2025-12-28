export const isMessageSender = (senderId: string, userId: string) => {
  return senderId === userId;
};

/**
 * Helper function to get only the fields that have changed
 * @param currentValues - Object containing current form values
 * @param initialValues - Object containing initial/original values
 * @returns Object containing only the fields that have changed
 */
export const getDirtyFields = <T extends Record<string, any>>(
  currentValues: T,
  initialValues: T
): Partial<T> => {
  const dirtyFields: Partial<T> = {};

  // Compare each field and include only changed ones
  Object.keys(currentValues).forEach((key) => {
    const currentValue = currentValues[key];
    const initialValue = initialValues[key];

    // Check if the value has actually changed (handles empty strings, null, undefined)
    if (currentValue !== initialValue) {
      dirtyFields[key as keyof T] = currentValue;
    }
  });

  return dirtyFields;
};

export const randomSessionIdGenerator = () => crypto.randomUUID();

// extracts the code lang and code content received from the AI
export function extractCode(node: Element): { language: string; code: string } {
  if (!node || !node.children || node.children.length === 0) {
    return { language: "text", code: "" };
  }

  const codeNode = node.children[0] as Element;
  // @ts-ignore
  const className = (codeNode.properties?.className as string[] | undefined)?.[0] || "";
  const language = className.replace("language-", "") || "text";

  const code = (codeNode.children || [])
    // @ts-ignore
    .map((child: any) => (child.type === "text" ? child.value : ""))
    .join("");

  return { language, code };
}
