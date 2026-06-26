import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from "react";
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
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import Sidebar from "./Sidebar";
import SVGShapeNode from "./SVGShapeNode";
import { createSvgNode } from "./ShapeManager";
import "./App.css";
import "./flow.css";
import ContextMenu from "./ContextMenu";
import ImageExportControls from "./ImageExportControls";
import JsonExportImportControls from "./JsonExportImportControls";
import SnappingControls from "./SnappingControls";
import { SnappingContext, defaultSnappingOptions } from "./SnappingOptions";

const AUTOSAVE_KEY = "vingram-autosave";
const LIBRARY_URLS_KEY = "vingram-library-urls";
const DEFAULT_LIBRARY_URLS = ["/vingram/shapes.json"];

const nodeTypes = {
  svgShapeNode: SVGShapeNode,
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
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);
  const [snappingOptions, setSnappingOptions] = useState(
    defaultSnappingOptions,
  );
  const [libraryUrls, setLibraryUrls] = useState<string[]>(() => {
    const saved = localStorage.getItem(LIBRARY_URLS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        console.error("Error parsing saved library URLs");
      }
    }
    return DEFAULT_LIBRARY_URLS;
  });

  useEffect(() => {
    localStorage.setItem(LIBRARY_URLS_KEY, JSON.stringify(libraryUrls));
  }, [libraryUrls]);

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
  }, [nodes, edges, isRestored, toObject, libraryUrls]);

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

      if (!type || !svgUrl) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = await createSvgNode(getId(), svgUrl, position);

      setNodes((nds) => nds.concat(newNode as Node));
    },
    [screenToFlowPosition, setNodes],
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent<Element>, node: Node) => {
      event.preventDefault();
      if (!ref || !ref.current) return;
      const pane = (ref.current as HTMLElement).getBoundingClientRect();
      const menuPadding = 0;
      setMenu({
        id: node.id,
        top:
          event.clientX < pane.width - menuPadding
            ? event.clientY - pane.top + menuPadding
            : undefined,
        left:
          event.clientX < pane.width - menuPadding
            ? event.clientX - pane.left + menuPadding
            : undefined,
        right:
          event.clientX >= pane.width - menuPadding
            ? pane.width - (event.clientX - pane.left) + menuPadding
            : undefined,
        bottom:
          event.clientX >= pane.width - menuPadding
            ? pane.height - (event.clientY - pane.top) + menuPadding
            : undefined,
      } as unknown as SetStateAction<null>);
    },
    [setMenu],
  );
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <SnappingContext.Provider value={snappingOptions}>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Sidebar libraryUrls={libraryUrls} setLibraryUrls={setLibraryUrls} />
        <div
          className={`react-flow ${isConnecting ? "is-connecting" : ""}`}
          style={{ flexGrow: 1, height: "100%" }}
        >
          <ReactFlow
            ref={ref}
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
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionMode={ConnectionMode.Loose}
            fitView
            snapToGrid={snappingOptions.snapToGrid}
            snapGrid={[snappingOptions.gridSize, snappingOptions.gridSize]}
          >
            <Background />
            <Controls />
            {menu && (
              <ContextMenu
                onClick={onPaneClick}
                {...(menu as ContextMenuProps)}
              />
            )}
          </ReactFlow>
        </div>
        <div className="drawing-controls">
          <SnappingControls setSnappingOptions={setSnappingOptions} />
          <ImageExportControls />
          <JsonExportImportControls setNodes={setNodes} setEdges={setEdges} />
        </div>
      </div>
    </SnappingContext.Provider>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <DnDFlow />
    </ReactFlowProvider>
  );
}

interface ContextMenuProps {
  id: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
}
