"use client";
import React, {memo, useMemo} from "react";
import CodeBlock from "../CodeBlock";
import {Streamdown} from "streamdown";
import {extractCode} from "@/util/helpers";

// ✅ Buffering utility
function bufferMarkdownContent(raw?: string): string {
  if (!raw) return "";

  let buffered = raw;
  const fenceCount = (raw.match(/```/g) || []).length;

  // If we are inside an open code block → append a fake closing fence
  if (fenceCount % 2 !== 0) {
    buffered += "\n```";
  }
  return buffered;
}

// Memoized component definitions
const StrongComponent = memo(({children}: any) => (
  <strong className="font-semibold text-base sm:text-[17px]">{children}</strong>
));
StrongComponent.displayName = "StrongComponent";

const H1Component = memo(({children}: any) => (
  <h1 className="text-2xl sm:text-3xl font-bold my-3 sm:my-5">{children}</h1>
));
H1Component.displayName = "H1Component";

const H2Component = memo(({children}: any) => (
  <h2 className="text-xl sm:text-2xl font-bold my-3 sm:my-5">{children}</h2>
));
H2Component.displayName = "H2Component";

const H3Component = memo(({children}: any) => (
  <h3 className="text-lg sm:text-xl font-semibold my-3 sm:my-5">{children}</h3>
));
H3Component.displayName = "H3Component";

const PComponent = memo(({children}: any) => <>{children}</>);
PComponent.displayName = "PComponent";

const BlockquoteComponent = memo(({children}: any) => (
  <blockquote className="border-l-4 border-gray-300 pl-3 sm:pl-4 italic my-2">
    {children}
  </blockquote>
));
BlockquoteComponent.displayName = "BlockquoteComponent";

const UlComponent = memo(({children}: any) => (
  <ul className="list-disc sm:pl-5 my-2 sm:my-3">{children}</ul>
));
UlComponent.displayName = "UlComponent";

const OlComponent = memo(({children}: any) => (
  <ol className="list-decimal px-4 sm:pl-5 my-2 sm:my-3">{children}</ol>
));
OlComponent.displayName = "OlComponent";

const LiComponent = memo(({children}: any) => (
  <li className="mb-1 sm:mb-2 text-dark-custom-dark-blue text-lg">{children}</li>
));
LiComponent.displayName = "LiComponent";

const AComponent = memo(({href, children}: any) => {
  const title = String(children) || href;
  return (
    <div className="my-2">
      <span className="text-sm sm:text-base font-medium text-gray-700">
        <span className="font-semibold">Link:</span>{" "}
        <a
          href={href}
          className="text-dark-logo-primary hover:text-blue-700 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
        </a>
      </span>
    </div>
  );
});
AComponent.displayName = "AComponent";

const ImgComponent = memo(({src, alt}: any) => (
  <div className="my-3 sm:my-4">
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className="max-w-full h-auto rounded-md mx-auto"
      loading="lazy"
    />
  </div>
));
ImgComponent.displayName = "ImgComponent";

const TableComponent = memo(({children}: any) => (
  <div className="overflow-auto">
    <table className="w-full border-collapse my-4 text-left">{children}</table>
  </div>
));
TableComponent.displayName = "TableComponent";

const ThComponent = memo(({children}: any) => (
  <th className="border px-4 py-2 bg-slate-100 font-bold">{children}</th>
));
ThComponent.displayName = "ThComponent";

const TdComponent = memo(({children}: any) => (
  <td className="border px-4 py-2 text-base sm:text-[17px]">{children}</td>
));
TdComponent.displayName = "TdComponent";

const EmComponent = memo(({children}: any) => (
  <em className="font-semibold text-base sm:text-[18px] sm:line">{children}</em>
));
EmComponent.displayName = "EmComponent";

const SupComponent = memo(({children}: any) => (
  <sup className="font-semibold text-base sm:text-[17px]">{children}</sup>
));
SupComponent.displayName = "SupComponent";

// Custom markdown component with buffering
const CustomMarkdown = memo(({content}: {content: string | undefined}) => {
  const bufferedContent = bufferMarkdownContent(content);

  const components = useMemo(
    () => ({
      pre: ({inline, className, children, node, ...props}: any) => {
        const {language, code} = extractCode(node);

        // Special case: LaTeX
        if (!inline && language === "latex") {
          const latexContent = String(code);
          try {
            return (
              <div className="max-w-full">
                <Streamdown>{latexContent}</Streamdown>
              </div>
            );
          } catch (error) {
            return (
              <div className="my-4 p-4 bg-red-50 rounded border border-red-200">
                <p className="text-red-600 text-sm mb-2">LaTeX Processing Error</p>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
                  {latexContent}
                </pre>
              </div>
            );
          }
        }

        // Normal code block
        if (!inline && language !== "latex") {
          return (
            <CodeBlock language={language} value={String(code || "")} key={`${language}-sd`} />
          );
        }

        // Inline code
        return (
          <code
            className="
              font-mono text-xs sm:text-sm px-1.5 sm:px-1.5 py-0.5 sm:py-1 rounded-md
              bg-logo-primary/10 text-gray-800
              break-words
            "
            {...props}
          >
            <span className="opacity-90">{children}</span>
          </code>
        );
      },
      strong: StrongComponent,
      h1: H1Component,
      h2: H2Component,
      h3: H3Component,
      p: PComponent,
      blockquote: BlockquoteComponent,
      ul: UlComponent,
      ol: OlComponent,
      li: LiComponent,
      a: AComponent,
      img: ImgComponent,
      table: TableComponent,
      th: ThComponent,
      td: TdComponent,
      em: EmComponent,
      sup: SupComponent,
    }),
    [],
  );

  return (
    <div className="max-w-full">
      <Streamdown children={bufferedContent} components={components} />
    </div>
  );
});

CustomMarkdown.displayName = "CustomMarkdown";

export default CustomMarkdown;
