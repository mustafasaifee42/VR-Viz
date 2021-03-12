import React, { Component } from "react";
import "./App.css";
import VRViz from "./VRViz";
import mapData from "./mapData/mapData.json";

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
            type: "MeshPlot",
            data: {
              dataFile: "data/meshPlot.csv",
              fileType: "csv",
              fieldDesc: [
                ["Alpha", "text"],
                ["-10", "number"],
                ["0", "number"],
                ["10", "number"],
              ],
            },
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
                  scaleType: "ordinal",
                  field: "Alpha",
                },
                z: {
                  domain: ["-10", "0", "10"],
                },
              },
              style: {
                stroke: {
                  color: "black",
                  width: 2,
                },
                fill: {
                  axis: "x",
                  color: ["green", "blue"],
                  opacity: 0.7,
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
          },
        ]}
      />
    );
  }
}

export default App;
