import VRViz from "./VRViz";

import mapData from "./mapData/mapData.json";

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
          position: "0 5 10",
          rotation: "0 0 0",
          nearClipping: 0.5,
          fov: 80,
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
          type: "BarGraph",
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
          mark: {
            type: "cone",
            class: (d, i) => `boxes`,
            id: (d, i) => `boxes_${d.Month}_${d.Year}`,
            position: {
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
              height: {
                startFromZero: true,
                field: "Tornadoes",
              },
              fill: {
                opacity: 0.4,
                scaleType: "linear",
                field: "Deaths",
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
                  `Year:${d.Year}\nMonth:${d.Month}\nDeaths:${d.Deaths}\nTornadoes:${d.Tornadoes}\n`,
                align: "center",
                fontSize: 1,
                backgroundColor: "#333",
                backgroundOpacity: 1,
                fontColor: "#fff",
              },
            },
          },
        },
      ]}
    />
  );
}

export default App;
