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
          position: "5 5 20",
          rotation: "0 0 0",
        },
        reloadPageOnExitVR: true,
      }}
      graph={[
        {
          type: "MapStackedBarChart",
          data: {
            dataFile: "data/mapStackedBarChart.csv",
            fileType: "csv",
            fieldDesc: [
              ["latitude", "number"],
              ["longitude", "number"],
              ["value", "number"],
              ["value1", "number"],
            ],
          },
          style: {
            origin: [0, 0, 0],
          },
          mark: {
            mapScale: 20,
            mapOrigin: [5, 5],
            rotation: "-75 0 0",
            map: {
              data: mapData,
              projection: "Mercator",
              shapeIdentifier: "id",
              shapeKey: "countries",
              style: {
                extrusion: 0.1,
                fill: {
                  opacity: 0.001,
                  color: "#333333",
                },
                stroke: {
                  width: 1,
                  color: "#444444",
                },
              },
            },
            bars: {
              type: "box",
              style: {
                depth: 0.2,
                width: 0.2,
                height: {
                  scaleType: "linear",
                  field: ["value", "value1"],
                  value: [0, 5],
                  startFromZero: true,
                },
                fill: {
                  opacity: 0.6,
                  scaleType: "ordinal",
                  color: ["#b71c1c", "#2196f3"],
                  field: ["value", "value1"],
                },
              },
            },
          },
        },
      ]}
    />
  );
}

export default App;
