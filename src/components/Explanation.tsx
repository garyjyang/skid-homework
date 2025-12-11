import { ExplanationMode } from "@/store/settings-store";
import { useTranslation } from "react-i18next";
import { MemoizedMarkdown } from "./MarkdownRenderer";
import { ExplanationStep } from "@/store/problems-store";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export type ExplanationProps = {
  mode: ExplanationMode;
  content?: string | null;
  steps?: ExplanationStep[] | null;
};

export default function Explanation({
  mode,
  content,
  steps,
}: ExplanationProps) {
  const { t } = useTranslation("commons", { keyPrefix: "solution-viewer" });

  const [visibleStepCounter, setVisibleStepCounter] = useState(0);
  const [hasMoreHints, setHasMoreHints] = useState(steps?.length !== 0);

  const visibleSteps = useMemo(() => {
    return steps?.slice(0, visibleStepCounter);
  }, [visibleStepCounter, steps]);

  if (mode === "explanation") {
    return (
      <div>
        <div className="mb-1 text-sm font-medium text-slate-300">
          {t("explanation")}
        </div>
        <div className="rounded-lg bg-slate-900/40 p-3 text-sm leading-relaxed">
          <MemoizedMarkdown source={content ?? "<Empty Explanation>"} />
        </div>
      </div>
    );
  }

  const nextHint = () => {
    if (visibleStepCounter >= (steps?.length ?? 0)) {
      // no more available steps
      setHasMoreHints(false);
      return;
    }
    setVisibleStepCounter((c) => c + 1);
  };

  // steps mode
  return (
    <>
      {visibleSteps?.map((step) => {
        return (
          <>
            <Label className="text-3xl">{step.title}</Label>
            <MemoizedMarkdown source={step.content} />
          </>
        );
      }) ?? "No steps available."}

      <Button onClick={nextHint} disabled={!hasMoreHints}>
        Hint me ({visibleSteps?.length}/{steps?.length})
      </Button>
    </>
  );
}
