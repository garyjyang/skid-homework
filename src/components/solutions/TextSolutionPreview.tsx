import type { FileItem } from "@/store/problems-store.ts";
import { useEffect, useState } from "react";
import { readTextFile } from "@/utils/file-utils.ts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Maximize2 } from "lucide-react";
import type { TFunction } from "i18next";
import CodeRenderer from "@/components/markdown/CodeRenderer.tsx";

export interface TextSolutionPreviewProps {
  item: FileItem;
  t: TFunction<"commons", "solutions">;
  tCommon: TFunction<"commons">;
}

export const TextSolutionPreview = ({
  item,
  t,
  tCommon,
}: TextSolutionPreviewProps) => {
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    let ignore = false;
    readTextFile(item.url)
      .then((text) => {
        if (!ignore) {
          setContent(text);
        }
      })
      .catch((error) => {
        console.error("Failed to read text file for preview:", item.url, error);
        if (!ignore) {
          // Optionally clear content or keep previous content; here we clear.
          setContent("");
        }
      });
    return () => {
      ignore = true;
    };
  }, [item.url]);

  const language = item.displayName.split(".").pop() || "txt";

  return (
    <Collapsible defaultOpen>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-slate-400">
          {t("file-label", {
            fileName: item.displayName,
            source: tCommon(`sources.${item.source}`),
          })}
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="flex h-[85vh] w-[75vw] max-w-[75vw] sm:max-w-[75vw] flex-col p-6 pt-12"
              onClick={(e) => e.stopPropagation()}
            >
              <DialogHeader className="sr-only">
                <DialogTitle>
                  {t("file-label", {
                    fileName: item.displayName,
                    source: tCommon(`sources.${item.source}`),
                  })}
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-hidden rounded-md text-left text-sm">
                <CodeRenderer
                  language={language}
                  content={content}
                  filename={item.displayName}
                  className="h-full"
                />
              </div>
            </DialogContent>
          </Dialog>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 px-2">
              {t("toggle-preview")}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <div className="max-h-96 overflow-hidden rounded-xl border border-slate-700 text-left text-sm">
          <CodeRenderer
            language={language}
            content={content}
            filename={item.displayName}
            className="h-full max-h-96"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
