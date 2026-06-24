import React, { useCallback, useState } from "react";
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
  addEdge,
  type Connection,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import Sidebar from "./Sidebar";
import SvgShapeNode from "./SVGShapeNode";
import { createSvgNode } from "./shapeManager";
import { shapes } from "./shapes";
import "./App.css";
import "./flow.css";

const nodeTypes = {
  svgShapeNode: SvgShapeNode,
};

const defaultEdgeOptions = {
  type: "straight",
  zIndex: 1000,
  style: {
    strokeWidth: 2,
    stroke: "#000",
  },
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function DnDFlow() {
  const [isConnecting, setIsConnecting] = useState(false);

  const onConnectStart = useCallback(() => setIsConnecting(true), []);
  const onConnectEnd = useCallback(() => setIsConnecting(false), []);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = { ...params, type: "straight", zIndex: 1000 };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );

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
      <div
        className={`react-flow ${isConnecting ? "is-connecting" : ""}`}
        style={{ flexGrow: 1, height: "100%" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          connectionLineType={ConnectionLineType.Straight}
          connectionLineStyle={{ stroke: "#000", strokeWidth: 2 }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          defaultEdgeOptions={defaultEdgeOptions}
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
