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
          type: "RectangleChart",
          data: {
            dataFile: "data/rectangleChart.csv",
            fileType: "csv",
            fieldDesc: [
              ["Year", "text"],
              ["Type", "number"],
              ["Tornadoes", "number"],
              ["Deaths", "number"],
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
                field: "Year",
              },
            },
            type: "box",
            style: {
              padding: {
                x: 0.1,
              },
              depth: {
                field: "Deaths",
              },
              height: {
                field: "Tornadoes",
              },
              fill: {
                opacity: 0.4,
                scaleType: "ordinal",
                field: "Type",
                color: ["red", "green"],
              },
            },
            mouseOver: {
              focusedObject: {
                opacity: 1,
                fill: "#333",
              },
              nonFocusedObject: {
                opacity: 0,
              },
              label: {
                value: (d) =>
                  `Year:${d.Year}\nType:${d.Type}\nDeaths:${d.Deaths}\nTornadoes:${d.Tornadoes}\n`,
                align: "center",
                fontSize: 1,
                backgroundColor: "#333",
                backgroundOpacity: 1,
                fontColor: "#fff",
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

export default App;
