import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { drag } from "d3-drag";
import "./flow.css";

export default function SVGShapeNode({
  id,
  data,
}: {
  id: string;
  data: { svgContent: string; rotation?: number };
}) {
  const rotateControlRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const { updateNodeData } = useReactFlow();
  const rotation = data.rotation ?? 0;

  useEffect(() => {
    if (!rotateControlRef.current) return;
    const selection = select(rotateControlRef.current);
    const dragHandler = drag().on("drag", (event) => {
      const dx = event.x - 100;
      const dy = event.y - 100;
      const rad = Math.atan2(dx, dy);
      const deg = rad * (180 / Math.PI);
      const newRotation = 180 - deg;
      updateNodeData(id, { rotation: newRotation });
      updateNodeInternals(id);
    });
    // eslint-disable-next-line no-unused-vars
    selection.call(dragHandler as (selection: unknown) => void);
  }, [id, updateNodeData, updateNodeInternals]);

  return (
    <div
      className="svg-node-wrapper"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div
        ref={rotateControlRef}
        className="nodrag rotatable-node__handle rotate-control"
      >
        ⟳
      </div>

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
