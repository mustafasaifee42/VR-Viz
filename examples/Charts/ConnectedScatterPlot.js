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
            type: "ConnectedScatterPlot",
            data: {
              dataFile: "data/ConnectedScatterPlot.csv",
              fileType: "csv",
              fieldDesc: [
                ["Year", "text"],
                ["Cars", "number"],
                ["Trucks", "number"],
                ["Bikes", "number"],
              ],
            },
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
                  field: "Cars",
                },
                y: {
                  field: "Trucks",
                },
                z: {
                  field: "Bikes",
                },
              },
              points: {
                type: "sphere",
                style: {
                  radius: {
                    value: 0.05,
                  },
                  fill: {
                    opacity: 1,
                    color: "red",
                  },
                },
                mouseOver: {
                  focusedObject: {
                    opacity: 1,
                    fill: "#333",
                  },
                  nonFocusedObject: {
                    opacity: 0.1,
                  },
                  label: {
                    value: (d) =>
                      `Year:${d.Year}\nCars:${d.Cars}\nTrucks:${d.Trucks}\nBikes:${d.Bikes}`,
                    align: "center",
                    fontSize: 1,
                    backgroundColor: "#333",
                    backgroundOpacity: 1,
                    fontColor: "#fff",
                  },
                },
              },
              line: {
                style: {
                  stroke: {
                    color: "black",
                    opacity: 1,
                  },
                },
              },
              label: {
                field: "Year",
                style: {
                  color: "black",
                  fontSize: 2,
                  opacity: 1,
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
