import React from "react";
import VRViz from "./VRViz";
import mapData from "./mapData/mapData.json";

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
          type: "PrismMap",
          data: {
            dataFile: "data/prismMapData.csv",
            fileType: "csv",
            fieldDesc: [
              ["id", "text"],
              ["value", "number"],
              ["colorValue", "number"],
            ],
          },
          style: {
            origin: { x: 0, y: 0, z: 0 },
          },
          mark: {
            mapScale: 20,
            mapOrigin: [5, 5],
            rotation: "-45 0 0",
            data: mapData,
            projection: "Mercator",
            shapeIdentifier: "id",
            shapeKey: "countries",
            style: {
              extrusion: {
                field: "value",
                value: [0, 5],
              },
              fill: {
                scaleType: "ordinal",
                opacity: 0.9,
                field: "colorValue",
                color: ["green", "blue", "red", "yellow", "magenta", "cyan"],
              },
              stroke: {
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
