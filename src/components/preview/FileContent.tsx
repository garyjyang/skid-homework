import {FileItem} from "@/store/problems-store";
import {useTranslation} from "react-i18next";
import {PhotoView} from "react-photo-view";
import {isTextMimeType} from "@/utils/file-utils";
import {TextFilePreview} from "./TextFilePreview";

export type FileContentProps = {
  it: FileItem;
};

export default function FileContent({ it }: FileContentProps) {
  const { t } = useTranslation("commons", { keyPrefix: "preview" });

  if (it.mimeType.startsWith("image/")) {
    return (
      <PhotoView src={it.url} key={it.url}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={it.url}
          alt={t("image-alt")}
          className="h-full w-full cursor-pointer object-cover"
        />
      </PhotoView>
    );
  }

  if (isTextMimeType(it.mimeType, it.file.name)) {
    return <TextFilePreview item={it} />;
  }

  return (
    <div className="flex h-full w-full select-none items-center justify-center text-sm">
      {it.mimeType === "application/pdf"
        ? t("file-type.pdf")
        : t("file-type.unknown")}
    </div>
  );
}
