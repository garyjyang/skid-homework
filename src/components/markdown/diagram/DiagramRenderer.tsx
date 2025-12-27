import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

export type DiagramRendererProps = {
  content: string;
  children: ReactNode;
};

export default function DiagramRenderer({
  content,
  children,
}: DiagramRendererProps) {
  const { t } = useTranslation("commons", { keyPrefix: "md.diagram" });
  const [isCodeView, setIsCodeView] = useState(false);

  const toggleView = () => {
    setIsCodeView(!isCodeView);
  };

  return (
    <div className="mermaid-container">
      <div style={{ padding: "8px", textAlign: "right" }}>
        <Button variant="ghost" onClick={toggleView}>
          {isCodeView ? t("view-diagram") : t("view-code")}
        </Button>
      </div>
      {isCodeView ? (
        <pre>
          <code>{content}</code>
        </pre>
      ) : (
        children
      )}
    </div>
  );
}
