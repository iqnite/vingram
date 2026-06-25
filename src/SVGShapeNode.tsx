import { Handle, Position } from "@xyflow/react";

export default function SVGShapeNode({
  data,
}: {
  data: { svgContent: string };
}) {
  return (
    <div className="svg-node-wrapper">
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

      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map(
        (position) => (
          <Handle
            type="source"
            className="omni-handle"
            position={position}
            id={`source-handle-${position}`}
            style={{ zIndex: 1 }}
          />
        ),
      )}
    </div>
  );
}
