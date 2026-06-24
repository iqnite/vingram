import { useEffect, useState } from "react";
import { ReactFlow } from "@xyflow/react";

import SVGShapeNode from "./SVGShapeNode";
import { createSvgNode } from "./shapemanager";

import "./App.css";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  svgShapeNode: SVGShapeNode,
};

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges] = useState([]);

  useEffect(() => {
    async function initializeNodes() {
      const node1 = await createSvgNode(
        "node-1",
        "/shapes/AchromaticDoublet.svg",
        {
          x: 100,
          y: 100,
        },
      );
      const node2 = await createSvgNode("node-2", "/shapes/Beamsplitter.svg", {
        x: 300,
        y: 100,
      });
      const node3 = await createSvgNode("node-3", "/shapes/ConvexLens.svg", {
        x: 200,
        y: 300,
      });

      setNodes([node1, node2, node3] as never[]);
    }

    initializeNodes();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}></ReactFlow>
    </div>
  );
}
