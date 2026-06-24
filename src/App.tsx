import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";

function App() {
  const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "Start Node" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "Second Node" } },
  ];

  const initialEdges = [
    { id: "e1-2", source: "1", target: "2", animated: true },
  ];
  return (
    <>
      <section id="center">
        <div style={{ width: "100vw", height: "100vh" }}>
          <ReactFlow nodes={initialNodes} edges={initialEdges} />
        </div>
      </section>
    </>
  );
}

export default App;
