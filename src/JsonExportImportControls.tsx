import React, { useCallback, useRef } from "react";
import { useReactFlow, type Node, type Edge } from "@xyflow/react";
import "./App.css";

interface JsonExportImportControlsProps {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export default function JsonExportImportControls({
  setNodes,
  setEdges,
}: JsonExportImportControlsProps) {
  const { toObject, setViewport } = useReactFlow();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSaveJson = useCallback(() => {
    const flowData = toObject();
    const jsonString = JSON.stringify(flowData, null, 2); // formatting with 2 spaces
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-diagram.json";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [toObject]);

  const onLoadJson = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const flowData = JSON.parse(content);

          if (flowData) {
            setNodes(flowData.nodes || []);
            setEdges(flowData.edges || []);
            setViewport(flowData.viewport || { x: 0, y: 0, zoom: 1 });
          }
        } catch (error) {
          alert(
            "Failed to parse JSON file. Make sure it's a valid React Flow export.",
          );
          console.error(error);
        }
      };

      reader.readAsText(file);

      // Reset the input so the user can upload the same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [setNodes, setEdges, setViewport],
  );

  return (
    <span className="drawing-control-section">
      <button onClick={onSaveJson}>Download JSON</button>
      <button onClick={() => fileInputRef.current?.click()}>Upload JSON</button>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onLoadJson}
      />
    </span>
  );
}
