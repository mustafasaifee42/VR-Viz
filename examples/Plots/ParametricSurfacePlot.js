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
        floor: {
          style: {
            color: "#ccc",
            texture: false,
            width: 100,
            depth: 100,
          },
        },
      }}
      graph={[
        {
          type: "ParametricSurfacePlot",
          style: {
            origin: { x: 0, y: 0, z: 0 },
            dimensions: {
              width: 10,
              height: 10,
              depth: 10,
            },
          },
          mark: {
            position: {
              x: {
                function: (u, v) => Math.cos(u) * (3 + Math.cos(v)),
              },
              y: {
                function: (u, v) => Math.sin(v),
              },
              z: {
                function: (u, v) => Math.sin(u) * (3 + Math.cos(v)),
              },
            },
            style: {
              fill: {
                opacity: 0.4,
                color: "red",
              },
              stroke: {
                width: 1,
                color: "black",
              },
            },
          },
          axis: {
            "axis-box": {
              color: "black",
            },
            "x-axis": {
              orient: "bottom-back",
              ticks: {
                noOfTicks: 10,
                size: 0.1,
                color: "black",
                opacity: 1,
                fontSize: 10,
              },
              grid: {
                color: "black",
                opacity: 1,
              },
            },
            "y-axis": {
              orient: "bottom-back",
              ticks: {
                noOfTicks: 10,
                size: 0.1,
                color: "black",
                opacity: 1,
                fontSize: 10,
              },
              grid: {
                color: "black",
                opacity: 1,
              },
            },
            "z-axis": {
              orient: "bottom-back",
              ticks: {
                noOfTicks: 10,
                size: 0.1,
                color: "black",
                opacity: 1,
                fontSize: 10,
              },
              grid: {
                color: "black",
                opacity: 1,
              },
            },
          },
          parameter: {
            parameter1: {
              domain: [0, 2 * Math.PI],
              steps: 50,
            },
            parameter2: {
              domain: [0, 2 * Math.PI],
              steps: 50,
            },
          },
        },
      ]}
    />
  );
}

export default App;
