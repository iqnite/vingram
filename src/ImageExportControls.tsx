import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { toPng, toBlob, toSvg } from "html-to-image";
import "./App.css";
import DropdownMenu from "./DropdownMenu";

export default function ImageExportControls() {
  const { fitView, getNodes } = useReactFlow();

  const onDownload = useCallback(
    async (format: "png" | "svg") => {
      fitView({
        padding: 0.2,
        nodes: getNodes(),
        duration: 0,
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      const reactFlowElement = document.querySelector(
        ".react-flow__viewport",
      ) as HTMLElement;

      (format === "png" ? toPng : toSvg)(
        reactFlowElement,
        format === "png"
          ? {
              backgroundColor: "#ffffff",
            }
          : {},
      ).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `my-drawing.${format}`;
        link.href = dataUrl;
        link.click();
      });
    },
    [fitView, getNodes],
  );

  const onCopyToClipboard = useCallback(async () => {
    fitView({
      padding: 0.2,
      nodes: getNodes(),
      duration: 0,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    const reactFlowElement = document.querySelector(
      ".react-flow__viewport",
    ) as HTMLElement;

    toBlob(reactFlowElement, {
      backgroundColor: "#ffffff",
    })
      .then((blob) => {
        if (blob) {
          navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        }
      })
      .catch((err) => console.error("Copy failed:", err));
  }, [fitView, getNodes]);

  return (
    <span className="drawing-control-section">
      <DropdownMenu
        title="Export"
        options={[
          { name: "Copy to clipboard", callback: onCopyToClipboard },
          { name: "Download PNG", callback: () => onDownload("png") },
          { name: "Download SVG", callback: () => onDownload("svg") },
        ]}
      />
    </span>
  );
}
