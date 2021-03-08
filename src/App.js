import VRViz from "./VRViz";
import mapData from "./mapData/mapData.json";

function App() {
  return (
    <VRViz
      scene={{
        sky: {
          style: {
            color: "#fff",
            texture: false,
          },
        },
        lights: [
          {
            type: "ambient",
            color: "#fff",
            intensity: 1,
            decay: 1,
          },
        ],
        camera: {
          position: "0 5 10",
          rotation: "0 0 0",
          nearClipping: 0.5,
          fov: 80,
        },
      }}
      graph={[
        {
          type: "FlowMap",
          data: {
            dataFile: "data/flowMap.csv",
            fileType: "csv",
            fieldDesc: [
              ["source_latitude", "number"],
              ["source_longitude", "number"],
              ["target_latitude", "number"],
              ["target_longitude", "number"],
            ],
          },
          style: {
            origin: [0, 0, 0],
          },
          mark: {
            mapScale: 20,
            mapOrigin: [5, 5],
            rotation: "-90 0 0",
            map: {
              data: mapData,
              projection: "Mercator",
              shapeIdentifier: "id",
              shapeKey: "countries",
              style: {
                extrusion: 0.0000001,
                fill: {
                  color: "#111",
                  opacity: 1,
                },
                stroke: {
                  width: 1,
                  color: "#444",
                },
              },
            },
            flowlines: {
              style: {
                opacity: 0.4,
                stroke: {
                  color: "#2196f3",
                },
              },
            },
            nodes: {
              source: {
                type: "sphere",
              },
              target: {
                type: "sphere",
              },
            },
          },
        },
      ]}
    />
  );
}

export default App;
