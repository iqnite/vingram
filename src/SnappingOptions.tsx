import { createContext } from "react";

export interface SnappingOptions {
  snapToGrid: boolean;
  snapToRotation: boolean;
  gridSize: number;
  rotationSnapAngle: number;
}

export const defaultSnappingOptions: SnappingOptions = {
  snapToGrid: true,
  snapToRotation: true,
  gridSize: 10,
  rotationSnapAngle: 15,
};

export const SnappingContext = createContext<SnappingOptions>(
  defaultSnappingOptions,
);
