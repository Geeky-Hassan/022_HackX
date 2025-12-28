"use client";

import React from "react";

interface HighlightedMessageProps {
    content: string | undefined;
    className?: string;
    attachments?: Array<{ name: string, type: string, size: number, url: string }>;
}

const FLAGS = ["@quiz", "@visualize"];

const HighlightedMessage: React.FC<HighlightedMessageProps> = ({
    content = "",
    className = "",
    attachments = []
}) => {
    const getHighlightedText = () => {
        // If content is undefined or null, return empty array
        if (!content) {
            return [{
                text: "",
                isFlag: false
            }];
        }

        let text = content;
        let spans = [];
        let lastIndex = 0;

        // Find all flag occurrences
        FLAGS.forEach(flag => {
            const regex = new RegExp(`^${flag}\\b|\\s${flag}\\b`, "g");
            let match;

            while ((match = regex.exec(text)) !== null) {
                // Add non-flag text before this match
                if (match.index > lastIndex) {
                    spans.push({
                        text: text.slice(lastIndex, match.index),
                        isFlag: false
                    });
                }

                // Add the flag
                const flagStart = match.index + (match[0].startsWith(" ") ? 1 : 0);
                spans.push({
                    text: text.slice(flagStart, flagStart + flag.length),
                    isFlag: true
                });

                lastIndex = flagStart + flag.length;
            }
        });

        // Add remaining text after last flag
        if (lastIndex < text.length) {
            spans.push({
                text: text.slice(lastIndex),
                isFlag: false
            });
        }

        // If no spans were created (no matches found), return the entire text
        if (spans.length === 0) {
            return [{
                text: text,
                isFlag: false
            }];
        }

        return spans;
    };

    return (
        <>

            <div className={className}>
                {getHighlightedText().map((span, i) => (
                    <div key={i}>
                        <span
                            key={i}
                            className={span.isFlag ? "text-blue-500 font-medium" : ""}
                        >
                            {span.text}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
};

export default HighlightedMessage; 