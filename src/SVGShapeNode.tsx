import { Handle, Position } from "@xyflow/react";

export default function SVGShapeNode({
  data,
}: {
  data: { svgContent: string };
}) {
  return (
    <div className="svg-node-wrapper">
      {/* TODO: Make handles configurable */}
      <Handle type="target" position={Position.Top} />

      {data.svgContent ? (
        <div
          className="svg-container"
          dangerouslySetInnerHTML={{ __html: data.svgContent }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      ) : (
        <div>Loading shape...</div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
