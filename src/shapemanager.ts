const svgCache = new Map();

/**
 * Loads an SVG from a URL, preferring the cache if available.
 * * @param {string} url - The path or URL to the SVG file.
 * @returns {Promise<string|null>} The raw SVG string, or null if it fails.
 */
export async function loadSvgShape(
  url: string,
  forceReload: boolean = false,
): Promise<string | null> {
  if (svgCache.has(url) && !forceReload) {
    return svgCache.get(url);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const svgContent = await response.text();
    svgCache.set(url, svgContent);
    return svgContent;
  } catch (error) {
    console.error(`Failed to load SVG from ${url}:`, error);
    return null;
  }
}

/**
 * Generates a React Flow Node object using a fetched SVG.
 * * @param {string} id - The unique ID for the React Flow node.
 * @param {string} svgUrl - The path or URL to the SVG file.
 * @param {object} position - The {x, y} coordinates for the node.
 * @param {object} [extraData={}] - Any additional data to pass to the node.
 * @returns {Promise<object>} A valid React Flow Node object.
 */
export async function createSvgNode(
  id: string,
  svgUrl: string,
  position: object = { x: 0, y: 0 },
  extraData: object = {},
): Promise<object> {
  const svgString = await loadSvgShape(svgUrl);

  return {
    id: id,
    type: "svgShapeNode",
    position: position,
    data: {
      ...extraData,
      svgContent: svgString,
    },
  };
}
