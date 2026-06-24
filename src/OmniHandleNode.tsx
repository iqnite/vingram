import { Handle, Position } from "@xyflow/react";

export default function OmniHandleNode({ position }: { position: Position }) {
  return (
    <div>
      <Handle
        type="target"
        position={position}
        id={`target-handle-${position}`}
        style={{ zIndex: 10 }}
      />
      <Handle
        type="source"
        position={position}
        id={`source-handle-${position}`}
        style={{ zIndex: 1 }}
      />
    </div>
  );
}
