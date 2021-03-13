import React from "react";
import VRViz from "./VRViz";

function App() {
  return (
    <VRViz
      scene={{
        sky: {
          style: {
            color: "#ccc",
            texture: false,
          },
        },
        lights: [
          {
            type: "directional",
            color: "#fff",
            position: "0 1 1",
            intensity: 1,
            decay: 1,
          },
          {
            type: "ambient",
            color: "#fff",
            intensity: 1,
            decay: 1,
          },
        ],
        camera: {
          position: "0 0 10",
          rotation: "0 0 0",
        },
      }}
      graph={[
        {
          type: "ContourMap",
          data: {
            dataFile: "data/contourMapData.csv",
            fileType: "text",
          },
          style: {
            origin: { x: 0, y: 0, z: 0 },
            objectScale: {
              ground: 0.1,
              height: 0.1,
            },
          },
          mark: {
            type: "plane",
            heightThreshold: 100,
            style: {
              fill: {
                scaleType: "linear",
                opacity: 0.4,
                color: ["green", "blue"],
              },
              stroke: {
                width: 1,
                opacity: 0.4,
                color: "black",
              },
            },
          },
        },
      ]}
    />
  );
}

export default App;
