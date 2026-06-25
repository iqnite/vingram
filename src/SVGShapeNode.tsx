import { Handle, Position } from "@xyflow/react";

export default function SVGShapeNode({
  id,
  data,
}: {
  id: string;
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
        (position, index) => (
          <Handle
            key={index}
            type="source"
            className="omni-handle"
            position={position}
            id={`${id}-${position}`}
            style={{ zIndex: 1 }}
          />
        ),
      )}
    </div>
  );
}
