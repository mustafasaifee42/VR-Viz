import VRViz from "./VRViz";
import sfMapData from "./mapData/sfMapData.json";

function App() {
  return (
    <VRViz
      scene={{
        sky: {
          style: {
            color: "#333",
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
          position: "0 0 0",
          rotation: "0 0 0",
        },
      }}
      graph={[
        {
          type: "IsolineMap",
          style: {
            origin: { x: 0, y: 0, z: 0 },
          },
          data: {
            dataFile: "data/mapContourLines.csv",
            fileType: "csv",
            fieldDesc: [
              ["geojson", "jsonObject"],
              ["objectid", "number"],
              ["isoline_ty", "text"],
              ["shape_len", "text"],
              ["elevation", "number"],
            ],
          },
          style: {
            origin: { x: 0, y: 0, z: 0 },
          },
          mark: {
            mapScale: 2500,
            mapOrigin: [4978.205, 1862.288],
            rotation: "-90 0 0",
            map: {
              data: sfMapData,
              projection: "Mercator",
              shapeIdentifier: "id",
              shapeKey: "neighbourhood",
              style: {
                extrusion: 0.0000001,
                fill: {
                  opacity: 1,
                  color: "red",
                },
                stroke: {
                  width: 1,
                  color: "black",
                },
              },
            },
            isoLines: {
              elevation: {
                field: "elevation",
                value: [0, 2],
              },
              style: {
                stroke: {
                  width: 1,
                  scaleType: "linear",
                  field: "elevation",
                  color: ["green", "blue"],
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
