import { useCallback } from "react";
import { useReactFlow, getNodesBounds } from "@xyflow/react";
import { toPng, toBlob } from "html-to-image";
import "./App.css";

export default function ImageExportControls() {
  const { getNodes } = useReactFlow();

  const getImageOptions = useCallback(() => {
    const nodesBounds = getNodesBounds(getNodes());
    const padding = 20;
    const imageWidth = nodesBounds.width + padding * 2;
    const imageHeight = nodesBounds.height + padding * 2;
    const tx = -nodesBounds.x + padding;
    const ty = -nodesBounds.y + padding;
    return {
      backgroundColor: "#ffffff",
      width: imageWidth,
      height: imageHeight,
      canvasWidth: imageWidth,
      canvasHeight: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        overflow: "hidden",
        transformOrigin: "top left",
        transform: `translate(${tx}px, ${ty}px) scale(1)`,
      },
    };
  }, [getNodes]);

  const onDownload = useCallback(() => {
    const reactFlowElement = document.querySelector(".react-flow__viewport");

    toPng(reactFlowElement as HTMLElement, getImageOptions()).then(
      (dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-drawing.png";
        link.href = dataUrl;
        link.click();
      },
    );
  }, [getImageOptions]);

  const onCopyToClipboard = useCallback(() => {
    const reactFlowElement = document.querySelector(".react-flow__viewport");

    toBlob(reactFlowElement as HTMLElement, getImageOptions()).then((blob) => {
      // Use the modern Clipboard API
      navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob as Blob }),
      ]);
    });
  }, [getImageOptions]);

  return (
    <span className="drawing-control-section">
      <button
        onClick={onCopyToClipboard}
        title="Copy the diagram to the clipboard"
      >
        Copy
      </button>
      <button onClick={onDownload} title="Download the diagram as a PNG image">
        Download PNG
      </button>
    </span>
  );
}
