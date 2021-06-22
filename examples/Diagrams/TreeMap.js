import VRViz from "./VRViz";

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
          type: "TreeMap",
          data: {
            dataFile: "data/TreeMap.json",
            fileType: "json",
          },
          style: {
            origin: { x: 0, y: 0, z: 0 },
            dimensions: {
              width: 5,
              depth: 5,
              height: 1.5,
            },
          },
          mark: {
            style: {
              paddingInner: 0.01,
              paddingOuter: 0.005,
              extrusion: {
                field: "size",
                startFromZero: true,
              },
              fill: {
                scaleType: "ordinal",
                opacity: 1,
              },
            },
          },
        },
      ]}
    />
  );
}

export default App;
