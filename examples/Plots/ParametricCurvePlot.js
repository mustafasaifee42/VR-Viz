import React, { Component } from "react";
import "./App.css";
import VRViz from "./Component/Visualization.js";

class App extends Component {
  render() {
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
            type: "ParametricCurvePlot",
            style: {
              origin: [0, 0, 0],
              dimensions: {
                width: 10,
                height: 10,
                depth: 10,
              },
            },
            mark: {
              position: {
                x: {
                  function: (y) => Math.sin(y),
                },
                y: {
                  function: (y) => Math.sin(y),
                },
                z: {
                  function: (y) => Math.cos(y),
                },
              },
              style: {
                opacity: 0.4,
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
            parameter: {
              domain: [0, 6 * Math.PI],
              steps: 150,
            },
          },
        ]}
      />
    );
  }
}

export default App;