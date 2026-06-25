import "./App.css";

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

export interface SnappingOptions {
  snapToGrid: boolean;
  snapToRotation: boolean;
  gridSize: number;
  rotationSnapAngle: number;
}
