import { Position } from "@xyflow/react";
import OmniHandleNode from "./OmniHandleNode";

export default function SVGShapeNode({
  data,
}: {
  data: { svgContent: string };
}) {
  return (
    <div className="svg-node-wrapper">
      {/* TODO: Make handles configurable */}
      <OmniHandleNode position={Position.Top} />

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

      <OmniHandleNode position={Position.Bottom} />
    </div>
  );
}
