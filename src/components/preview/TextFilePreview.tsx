import { FileItem } from "@/store/problems-store";
import { useEffect, useState } from "react";
import { readTextFile } from "@/utils/file-utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "../ui/dialog";
import CodeRenderer from "@/components/markdown/CodeRenderer";

export interface TextFilePreviewProps {
  item: FileItem;
}

export const TextFilePreview = ({ item }: TextFilePreviewProps) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    let canceled = false;
    readTextFile(item.url).then((text) => {
      if (!canceled) {
        setContent(text);
      }
    });
    return () => {
      canceled = true;
    };
  }, [item.url]);

  const language = item.displayName.split('.').pop() || "txt";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex h-full w-full cursor-pointer overflow-hidden bg-muted/50 p-3 text-[10px] font-mono text-muted-foreground break-all whitespace-pre-wrap">
          {content.slice(0, 300)}
        </div>
      </DialogTrigger>
      <DialogContent className="flex h-[85vh] w-[75vw] max-w-[75vw] sm:max-w-[75vw] flex-col p-6 pt-12" onClick={(e) => e.stopPropagation()}>
        <DialogHeader className="sr-only">
          <DialogTitle>{item.displayName}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden rounded-md text-left text-sm">
          <CodeRenderer language={language} content={content} filename={item.displayName} className="h-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
