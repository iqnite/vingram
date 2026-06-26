import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  onClick,
  ...props
}: {
  id: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
  onClick: () => void;
}) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    if (!node) return;
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${crypto.randomUUID()}`,
      position,
    });
    onClick();
  }, [id, getNode, addNodes, onClick]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
    onClick();
  }, [id, setNodes, setEdges, onClick]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      onClick={onClick}
      {...props}
    >
      <button onClick={duplicateNode}>Duplicate</button>
      <button onClick={deleteNode}>Delete</button>
    </div>
  );
}
