import { ChevronsUp } from "lucide-react";
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockItem,
  CodeBlockContent,
  BundledLanguage,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
} from "../ui/shadcn-io/code-block";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type CodeRendererProps = {
  language: string;
  content: string;
};

export default function CodeRenderer({ language, content }: CodeRendererProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <CodeBlock
      data={[
        {
          language: language,
          filename: "Scratch",
          code: content,
        },
      ]}
      defaultValue={language}
    >
      <CodeBlockHeader>
        <CodeBlockFiles>
          {(item) => (
            <CodeBlockFilename key={item.language} value={item.language}>
              {item.filename}
            </CodeBlockFilename>
          )}
        </CodeBlockFiles>
        {language}

        <button
          className={cn(
            "rounded-full hover:bg-background p-1 mx-1",
            collapsed && "bg-background",
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronsUp
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              collapsed ? "rotate-180" : "rotate-0",
            )}
          />
        </button>
        <CodeBlockCopyButton
          onCopy={() => console.log("Copied code to clipboard")}
          onError={() => console.error("Failed to copy code to clipboard")}
        />
      </CodeBlockHeader>

      <CodeBlockBody>
        {(item) => (
          <CodeBlockItem key={item.language} value={item.language}>
            <CodeBlockContent language={item.language as BundledLanguage}>
              {!collapsed
                ? item.code
                : "Code collpased. Click the button to expand."}
            </CodeBlockContent>
          </CodeBlockItem>
        )}
      </CodeBlockBody>
    </CodeBlock>
  );
}
