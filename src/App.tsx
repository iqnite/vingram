import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
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
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, , onEdgesChange] = useEdgesState<Edge>([]);

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow-type");
      const svgUrl = event.dataTransfer.getData("application/reactflow-url");

      if (!type || !svgUrl) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = await createSvgNode(getId(), svgUrl, position);

      setNodes((nds) => nds.concat(newNode as Node));
    },
    [screenToFlowPosition, setNodes],
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
      <div style={{ flexGrow: 1, height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
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
  return (
    <ReactFlowProvider>
      <DnDFlow />
    </ReactFlowProvider>
  );
}
