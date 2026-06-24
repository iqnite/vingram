import { useCallback, type Dispatch, type SetStateAction } from "react";
import { useReactFlow, type Node, type Edge } from "@xyflow/react";

const FLOW_KEY = "example-flow-save";

interface SaveRestoreControlsProps {
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}

export default function SaveRestoreControls({
  setNodes,
  setEdges,
}: SaveRestoreControlsProps) {
  const { toObject, setViewport } = useReactFlow();

  const onSave = useCallback(() => {
    const flowData = toObject();

    localStorage.setItem(FLOW_KEY, JSON.stringify(flowData));
  }, [toObject]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const storedFlow = localStorage.getItem(FLOW_KEY);

      if (storedFlow) {
        const flowData = JSON.parse(storedFlow);

        if (flowData) {
          setNodes(flowData.nodes || []);
          setEdges(flowData.edges || []);
          setViewport(flowData.viewport || { x: 0, y: 0, zoom: 1 });
        }
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  return (
    <div style={{ position: "absolute", top: 10, right: 10, zIndex: 100 }}>
      <button onClick={onSave}>Save</button>
      <button onClick={onRestore}>Restore</button>
    </div>
  );
}
