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
          type: "CrossSectionView",
          style: {
            position: [-10, 5, 0],
            scale: [1, 1, 1],
          },
          mark: {
            material: {
              type: "phong",
              fill: {
                opacity: 0.4,
                color: "#ff0000",
                shininess: 30,
                emissive: "#000000",
                specular: "#ffffff",
              },
              stroke: {
                width: 1,
                color: "#ffff00",
                edgeThresholdAngle: 10,
              },
              emphasisMaterial: {
                opacity: 0.8,
                color: "#ffff00",
                meshes: ["Adam", "Eyelid"],
              },
              highlightOnClick: {
                opacity: 0.8,
                color: "#ff0000",
              },
            },
            object: "data/Duck.gltf",
          },
        },
      ]}
    />
  );
}

export default App;
