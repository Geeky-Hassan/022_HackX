"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Code, Terminal, FileCode, Download, AlertOctagon } from "lucide-react";
// import {useMainAppStore} from "../store/mainAppStore";

interface CodeBlockProps {
  language: string;
  value: string;
  showLineNumbers?: boolean;
  fileName?: string;
}

// Map of language names to display names and icons
const languageMap: Record<string, { label: string; icon: React.ReactNode }> = {
  javascript: {
    label: "JavaScript",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
  typescript: {
    label: "TypeScript",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
  jsx: {
    label: "JSX",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
  tsx: {
    label: "TSX",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
  html: {
    label: "HTML",
    icon: <Code className="h-3.5 w-3.5" />,
  },
  css: {
    label: "CSS",
    icon: <Code className="h-3.5 w-3.5" />,
  },
  json: {
    label: "JSON",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
  bash: {
    label: "Bash",
    icon: <Terminal className="h-3.5 w-3.5" />,
  },
  shell: {
    label: "Shell",
    icon: <Terminal className="h-3.5 w-3.5" />,
  },
  python: {
    label: "Python",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
  mermaid: {
    label: "Mermaid",
    icon: <FileCode className="h-3.5 w-3.5" />,
  },
};

// React-friendly Mermaid component that avoids DOM manipulation
const MermaidDiagram: React.FC<{
  content: string;
  onError: (error: string) => void;
  onSuccess: (svg: string) => void;
  onLoading: (loading: boolean) => void;
}> = ({ content, onError, onSuccess, onLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    let cancelled = false;

    const renderDiagram = async () => {
      try {
        onLoading(true);
        onError('');

        const mermaid = (await import('mermaid')).default;

        // Initialize with minimal config
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'antiscript',
          suppressErrorRendering: true,
        });

        mermaid.run({
          suppressErrors: true,
        })

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, content);

        if (!cancelled && containerRef.current) {
          onSuccess(svg);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Mermaid render error:', error);
          onError((error as Error)?.message || 'Failed to render diagram');
        }
      } finally {
        if (!cancelled) {
          onLoading(false);
        }
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [content, mounted, onError, onSuccess, onLoading]);

  return <div ref={containerRef} />;
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  language,
  value,
  showLineNumbers = false,
  fileName,
}) => {
  const [copied, setCopied] = useState(false);
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [renderedSvg, setRenderedSvg] = useState<string | null>(null);
  const [svgKey, setSvgKey] = useState(0); // Force re-render key
  const [isMounted, setIsMounted] = useState(false);

  const isMermaid = language.toLowerCase() === 'mermaid';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code: ", error);
    }
  };

  // Handle mounting for Next.js SSR compatibility
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle mermaid callbacks
  const handleMermaidError = useCallback((error: string) => {
    setMermaidError(error);
    setIsLoading(false);
  }, []);

  const handleMermaidSuccess = useCallback((svg: string) => {
    try {
      // Apply responsive styling to the SVG
      const styledSvg = svg
      setRenderedSvg(styledSvg);
    } catch (error) {
      console.warn('SVG styling error:', error);
      setRenderedSvg(svg); // Fallback to original SVG
    }

    setMermaidError(null);
    setIsLoading(false);
    setSvgKey(prev => prev + 1); // Force re-render
  }, []);

  const handleMermaidLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Get language display info
  const languageInfo = languageMap[language.toLowerCase()] || {
    label: language.charAt(0).toUpperCase() + language.slice(1),
    icon: <Code className="h-3.5 w-3.5" />,
  };

  // If it's a Mermaid diagram with error, show stable error state
  if (isMermaid && mermaidError) {
    return (
      <div className="group relative my-6 rounded-xl w-full border border-red-300 shadow-md overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-red-50">
          <div className="flex items-center space-x-2 text-sm text-red-700">
            <AlertOctagon className="h-4 w-4" />
            <span className="font-medium">Mermaid Diagram Error</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-medium text-red-700 border border-red-300 hover:bg-red-100"
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Show error message */}
        <div className="px-4 py-2 bg-red-50 text-red-700 text-sm">
          <p className="font-medium break-words">{mermaidError}</p>
          <p className="text-xs mt-1 text-red-600">Please check your diagram syntax and try again</p>
        </div>

        {/* Show code as fallback - stable rendering */}
        <div className="w-full overflow-x-auto bg-white" style={{ contain: 'layout style paint' }}>
          <pre className="p-4 text-sm font-mono text-gray-700 whitespace-pre-wrap break-words">
            {value}
          </pre>
        </div>
      </div>
    );
  }

  // If it's a valid Mermaid diagram, render it using React component
  if (isMermaid && isMounted) {
    return (
      <div className="my-6 w-full">
        <div className="bg-white rounded-lg overflow-hidden">
          {/* Header with copy button */}
          <div className="flex items-center justify-end px-3 py-2 bg-white ">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors
                ${copied ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}
              `}
              aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Diagram content */}
          <div className="p-4">
            <div className="flex justify-center items-center min-h-[200px] w-full">
              {isLoading && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <div className="text-gray-500 text-sm">Rendering diagram...</div>
                </div>
              )}
              {renderedSvg && !isLoading && (
                <div
                  key={svgKey}
                  className="w-full flex justify-center mermaid-svg-container"
                  dangerouslySetInnerHTML={{ __html: renderedSvg }}
                  style={{
                    maxWidth: '800px',
                  }}
                />
              )}
              {!isLoading && !renderedSvg && !mermaidError && (
                <div className="text-gray-400 text-sm">Initializing diagram...</div>
              )}
            </div>
          </div>

          {/* Hidden component that does the actual rendering */}
          <div>
            <MermaidDiagram
              content={value}
              onError={handleMermaidError}
              onSuccess={handleMermaidSuccess}
              onLoading={handleMermaidLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  // If it's Mermaid but not mounted yet (SSR), show loading
  if (isMermaid && !isMounted) {
    return (
      <div className="my-6 w-full">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex justify-center items-center min-h-[200px] w-full">
            <div className="text-gray-400 text-sm">Loading diagram renderer...</div>
          </div>
        </div>
      </div>
    );
  }

  // For non-Mermaid code blocks, render a minimal, light theme block
  return (
    <div className="group relative my-4 rounded-lg w-full border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-white">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {languageInfo.icon}
          <span className="font-medium">{languageInfo.label}</span>
          {fileName && (
            <span className="ml-2 text-xs text-gray-400 truncate max-w-[160px]">{fileName}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors
            ${copied ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}
          `}
          aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneLight}
          showLineNumbers={showLineNumbers}
          wrapLines
          lineNumberStyle={{
            minWidth: "2.25em",
            paddingRight: "0.75em",
            color: "#9CA3AF",
            textAlign: "left",
            userSelect: "none",
          }}
          customStyle={{
            margin: 0,
            background: "transparent",
            borderRadius: 0,
            padding: "0.875rem 1rem",
            fontSize: "13.5px",
            width: "100%",
          }}
          codeTagProps={{
            className: "font-mono",
            style: { whiteSpace: "pre" },
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;