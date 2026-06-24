import React, {
  useState,
  useCallback,
  useRef,
  type SetStateAction,
} from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import Sidebar from "./Sidebar";
import SvgShapeNode from "./SVGShapeNode";
import { createSvgNode } from "./shapeManager";
import { shapes } from "./shapes";

const nodeTypes = {
  svgShapeNode: SvgShapeNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function DnDFlow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Required to allow dropping
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // Retrieve the data we attached in the Sidebar
      const type = event.dataTransfer.getData("application/reactflow-type");
      const svgUrl = event.dataTransfer.getData("application/reactflow-url");

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // Translate the pixel coordinates to React Flow coordinates
      const position = (
        reactFlowInstance as unknown as {
          // eslint-disable-next-line no-unused-vars
          screenToFlowPosition: ({ x, y }: { x: number; y: number }) => void;
        }
      )?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Use our shapeManager module to fetch/cache the SVG and build the node
      const newNode = await createSvgNode(
        getId(),
        svgUrl,
        position as unknown as { x: number; y: number },
      );

      setNodes((nds) => nds.concat(newNode as never[]));
    },
    [reactFlowInstance, setNodes],
  );

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Sidebar shapeUrls={shapes} />
      <div style={{ flexGrow: 1, height: "100%" }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={(instance) =>
            setReactFlowInstance(instance as unknown as SetStateAction<null>)
          }
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return <DnDFlow />;
}
