import React from "react";
import "./App.css";
import type { SnappingOptions } from "./SnappingOptions";

export default function SnappingControls({
  setSnappingOptions,
}: {
  setSnappingOptions: React.Dispatch<React.SetStateAction<SnappingOptions>>;
}) {
  return (
    <span className="drawing-control-section">
      <input
        type="checkbox"
        title="Toggle grid and rotation snapping"
        onChange={(e) =>
          setSnappingOptions((prev) => ({
            ...prev,
            snapToGrid: e.target.checked,
            snapToRotation: e.target.checked,
          }))
        }
      />
      Snap
    </span>
  );
}
