import VRViz from "./VRViz";

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
        floor: {
          style: {
            color: "#fff",
            texture: false,
            width: 100,
            depth: 100,
          },
        },
      }}
      graph={[
        {
          type: "ContourPlot",
          style: {
            origin: [0, 0, 0],
            dimensions: {
              width: 10,
              height: 10,
              depth: 10,
            },
          },
          mark: {
            type: "line",
            position: {
              x: {
                scaleType: "linear",
                function: (y) => Math.sin(y),
              },
              y: {
                scaleType: "linear",
                domain: [0, 6 * Math.PI],
                range: [0, 10],
                steps: 150,
              },
              z: {
                scaleType: "linear",
                function: (y) => Math.cos(y),
              },
            },
            style: {
              opacity: 1,
              color: "red",
            },
          },
          axis: {
            "axis-box": {
              color: "black",
            },
            "x-axis": {
              orient: "bottom-back",
              title: {
                text: "",
                fontSize: 10,
                color: "black",
                opacity: 1,
              },
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
              title: {
                text: "",
                fontSize: 10,
                color: "black",
                opacity: 1,
              },
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
              title: {
                text: "",
                fontSize: 10,
                color: "black",
                opacity: 1,
              },
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
        },
      ]}
    />
  );
}

export default App;
