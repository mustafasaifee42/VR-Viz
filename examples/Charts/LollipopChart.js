import React, { Component } from "react";
import "./App.css";
import VRViz from "./Component/Visualization.js";
import mapData from "./mapData/mapData.json";

class App extends Component {
  render() {
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
            position: "10 0 20",
            rotation: "0 0 0",
          },
        }}
        graph={[
          {
            type: "LollipopChart",
            data: {
              dataFile: "data/barGraph.csv",
              fileType: "csv",
              fieldDesc: [
                ["Year", "text"],
                ["Month", "text"],
                ["Tornadoes", "number"],
                ["Deaths", "number"],
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
              type: "box",
              position: {
                y: {
                  startFromZero: true,
                  field: "Tornadoes",
                },
                x: {
                  field: "Month",
                  domain: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ],
                },
                z: {
                  field: "Year",
                },
              },
              style: {
                padding: {
                  x: 0.1,
                  z: 0.1,
                },
                radius: {
                  value: 0.1,
                },
                fill: {
                  opacity: 0.8,
                  scaleType: "linear",
                  field: "Deaths",
                  color: ["red", "green"],
                },
              },
              droplines: {
                style: {
                  radius: 0.01,
                  fill: {
                    opacity: 0.8,
                    scaleType: "linear",
                    field: "Deaths",
                    color: ["red", "green"],
                  },
                },
              },
            },
            axis: {
              "x-axis": {
                orient: "back-bottom",
                title: {
                  text: "",
                  fontSize: 10,
                  color: "white",
                  opacity: 0.7,
                },
                ticks: {
                  noOfTicks: 10,
                  size: 0.1,
                  color: "white",
                  opacity: 0.7,
                  fontSize: 1,
                },
                grid: {
                  color: "white",
                  opacity: 0.7,
                },
              },
              "y-axis": {
                orient: "back-left",
                title: {
                  text: "",
                  fontSize: 10,
                  color: "white",
                  opacity: 0.7,
                },
                ticks: {
                  noOfTicks: 10,
                  size: 0.1,
                  color: "white",
                  opacity: 0.7,
                  fontSize: 1,
                },
                grid: {
                  color: "white",
                  opacity: 0.7,
                },
              },
              "z-axis": {
                orient: "bottom-left",
                title: {
                  text: "",
                  fontSize: 10,
                  color: "white",
                  opacity: 0.7,
                },
                ticks: {
                  noOfTicks: 10,
                  size: 0.1,
                  color: "white",
                  opacity: 0.7,
                  fontSize: 1,
                },
                grid: {
                  color: "white",
                  opacity: 0.7,
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
