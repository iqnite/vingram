import { useCallback } from "react";
import {
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { toPng, toBlob } from "html-to-image";

export default function ImageExportControls() {
  const { getNodes } = useReactFlow();

  const getImageOptions = useCallback(() => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(nodesBounds, 1024, 768, 0.5, 2, {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    });

    return {
      backgroundColor: "#ffffff",
      width: 1024,
      height: 768,
      style: {
        width: "1024px",
        height: "768px",
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
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
    <div style={{ position: "absolute", top: 10, right: 10, zIndex: 100 }}>
      <button onClick={onDownload}>Download PNG</button>
      <button onClick={onCopyToClipboard}>Copy to Clipboard</button>
    </div>
  );
}
