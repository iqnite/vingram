import React, { useCallback, useEffect, useState } from "react";
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
import "./App.css";
import "./flow.css";
import ImageExportControls from "./ImageExportControls";
import JsonExportImportControls from "./JsonExportImportControls";

const AUTOSAVE_KEY = "vingram-autosave";
const LIBRARY_URLS_KEY = "vingram-library-urls";

const libraryUrls = ["/shapes.json"];
const nodeTypes = {
  svgShapeNode: SvgShapeNode,
};

const defaultEdgeOptions = {
  type: "straight",
  zIndex: 1000,
  style: {
    strokeWidth: 1,
    stroke: "#010101",
    strokeDasharray: "5 5",
  },
};

const getId = () => `dndnode_${crypto.randomUUID()}`;

function DnDFlow() {
  const [isConnecting, setIsConnecting] = useState(false);
  const onConnectStart = useCallback(() => setIsConnecting(true), []);
  const onConnectEnd = useCallback(() => setIsConnecting(false), []);

  const [isRestored, setIsRestored] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { screenToFlowPosition, setViewport, toObject } = useReactFlow();

  useEffect(() => {
    const restoreData = () => {
      const storedFlow = localStorage.getItem(AUTOSAVE_KEY);
      if (storedFlow) {
        const flowData = JSON.parse(storedFlow);
        if (flowData) {
          setNodes(flowData.nodes || []);
          setEdges(flowData.edges || []);
          setViewport(flowData.viewport || { x: 0, y: 0, zoom: 1 });
        }
      }
      const storedLibraryUrls = localStorage.getItem(LIBRARY_URLS_KEY);
      if (storedLibraryUrls) {
        const libraryUrls = JSON.parse(storedLibraryUrls);
        for (const url of libraryUrls) {
          if (!libraryUrls.includes(url)) libraryUrls.push(url);
        }
      }
      setIsRestored(true);
    };
    restoreData();
  }, [setNodes, setEdges, setViewport]);

  useEffect(() => {
    if (isRestored) {
      const flowData = toObject();
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(flowData));
      localStorage.setItem(LIBRARY_URLS_KEY, JSON.stringify(libraryUrls));
    }
  }, [nodes, edges, isRestored, toObject]);

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
      <Sidebar libraryUrls={libraryUrls} />
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
          connectionLineStyle={defaultEdgeOptions.style}
          onDrop={onDrop}
          onDragOver={onDragOver}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div className="drawing-controls">
        <ImageExportControls />
        <JsonExportImportControls setNodes={setNodes} setEdges={setEdges} />
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
