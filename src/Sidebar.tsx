import React from "react";
import SVGShapeNode from "./SVGShapeNode";

export default function Sidebar({ shapeUrls }: { shapeUrls: string[] }) {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    svgUrl: string,
  ) => {
    event.dataTransfer.setData("application/reactflow-type", nodeType);
    event.dataTransfer.setData("application/reactflow-url", svgUrl);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      style={{
        width: "200px",
        borderRight: "1px solid #ccc",
        padding: "10px",
        overflowY: "auto",
      }}
    >
      <div className="description">Drag these shapes onto the canvas:</div>
      {shapeUrls.map((svgName) => (
        <div
          className="dndnode"
          draggable
          onDragStart={(event) =>
            onDragStart(event, "svgShapeNode", `/shapes/${svgName}`)
          }
          style={{
            padding: "10px",
            border: "1px solid #333",
            marginTop: "10px",
            cursor: "grab",
          }}
          title={svgName.split("/").pop()?.split(".")[0].replaceAll("_", " ")}
        >
          {SVGShapeNode({
            data: {
              svgContent: `<img src="/shapes/${svgName}" alt="${svgName}" style="max-width: 100%; max-height: 50px;" />`,
            },
          })}
        </div>
      ))}
    </aside>
  );
}
