import React, { useEffect, useState } from "react";
import SVGShapeNode from "./SVGShapeNode";
import LibraryManager from "./LibraryManager";
import { fetchLibrary, type LibraryData } from "./shapeManager";

export default function Sidebar({
  libraryUrls,
  setLibraryUrls,
}: {
  libraryUrls: string[];
  setLibraryUrls: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [libraries, setLibraries] = useState<LibraryData[]>([]);
  const [isLibraryManagerDisplayed, setIsLibraryManagerDisplayed] =
    useState(false);

  useEffect(() => {
    const loadLibraries = async () => {
      try {
        const fetchedLibraries = await Promise.all(
          libraryUrls.map(async (url) => fetchLibrary(url)),
        );
        setLibraries(
          fetchedLibraries.filter((lib): lib is LibraryData => lib !== null),
        );
      } catch (error) {
        console.error("Error loading libraries:", error);
      }
    };
    loadLibraries();
  }, [libraryUrls]);

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    svgUrl: string,
  ) => {
    event.dataTransfer.setData("application/reactflow-type", nodeType);
    event.dataTransfer.setData("application/reactflow-url", svgUrl);
    event.dataTransfer.effectAllowed = "move";
  };

  const toggleLibraryManagerDisplay = () => {
    setIsLibraryManagerDisplayed(!isLibraryManagerDisplayed);
  };

  return (
    <aside
      style={{
        width: "200px",
        borderRight: "1px solid #ccc",
        padding: "10px",
        overflowY: "auto",
      }}
    >
      <div className="description">Drag these shapes onto the canvas:</div>
      {libraries.map((library, index) => {
        const svgNames = library.svgNames;
        const baseUrl = library.baseUrl;
        if (!svgNames || !baseUrl) {
          console.error("Invalid library data:", library);
          return null;
        }
        return (
          <React.Fragment key={`library-${baseUrl}-${index}`}>
            {svgNames.map((svgName: string) => (
              <div
                className="dndnode"
                draggable
                onDragStart={(event) =>
                  onDragStart(event, "svgShapeNode", `${baseUrl}${svgName}`)
                }
                style={{
                  padding: "10px",
                  border: "1px solid #333",
                  marginTop: "10px",
                  cursor: "grab",
                }}
                title={svgName
                  .split("/")
                  .pop()
                  ?.split(".")[0]
                  .replaceAll("_", " ")}
              >
                <SVGShapeNode
                  data={{
                    svgContent: `<img src="${baseUrl}${svgName}" alt="${svgName}" style="max-width: 100%; max-height: 50px;" />`,
                  }}
                />
              </div>
            ))}
          </React.Fragment>
        );
      })}
      <button onClick={() => toggleLibraryManagerDisplay()}>
        Show/Hide libraries
      </button>
      <LibraryManager
        libraryUrls={libraryUrls}
        display={isLibraryManagerDisplayed}
        setLibraryUrls={setLibraryUrls}
      />
    </aside>
  );
}
