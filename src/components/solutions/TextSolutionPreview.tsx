import type {FileItem} from "@/store/problems-store.ts";
import {useEffect, useState} from "react";
import {readTextFile} from "@/utils/file-utils.ts";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Maximize2} from "lucide-react";
import type {TFunction} from "i18next";

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
                <Maximize2 className="h-4 w-4"/>
              </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[80vh] max-w-4xl flex-col">
              <DialogHeader>
                <DialogTitle>
                  {t("file-label", {
                    fileName: item.displayName,
                    source: tCommon(`sources.${item.source}`),
                  })}
                </DialogTitle>
              </DialogHeader>
              <div
                className="flex-1 overflow-auto rounded-md bg-slate-950 p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                {content}
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
        <div
          className="max-h-96 overflow-hidden overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs font-mono text-slate-300 whitespace-pre-wrap break-all">
          {content}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};