import * as THREE from "three";
import AFRAME from "aframe";

AFRAME.registerComponent("modify-material", {
  schema: {
    stroke: { type: "boolean", default: false },
    strokeWidth: { type: "number", default: 1 },
    strokeColor: { type: "string", default: "#000000" },
    edgeThresholdAngle: { type: "number", default: 20 },
    modifyMaterial: { type: "boolean", default: false },
    material: { type: "string", default: "none" },
    materialColor: { type: "string", default: "#ff0000" },
    materialOpacity: { type: "number", default: 1 },
    shininess: { type: "number", default: 30 },
    emissive: { type: "string", default: "#3a3a3a" },
    specular: { type: "string", default: "#ffffff" },
    emphasisMaterial: { type: "boolean", default: false },
    emphasisMeshName: { type: "array", default: [] },
    emphasisOpacity: { type: "number", default: 1 },
    emphasisColor: { type: "string", default: "#ffff00" },
  },
  init: function () {
    this.obj = this.el;
    this.model = this.el.object3D;
    this.el.addEventListener("model-loaded", () => {
      // Go over the submeshes and modify materials we want.
      this.model.traverse((node) => {
        if (node.isMesh) {
          let material;
          switch (this.data.material) {
            case "basic":
              material = new THREE.MeshBasicMaterial({
                opacity: this.data.materialOpacity,
                side: THREE.DoubleSide,
                transparent: true,
              });
              break;
            case "normal":
              material = new THREE.MeshNormalMaterial({
                opacity: this.data.materialOpacity,
                side: THREE.DoubleSide,
                transparent: true,
              });
              break;
            case "lambert":
              material = new THREE.MeshLambertMaterial({
                opacity: this.data.materialOpacity,
                color: this.data.materialColor,
                side: THREE.DoubleSide,
                transparent: true,
              });
              break;
            case "phong":
              material = new THREE.MeshPhongMaterial({
                color: this.data.materialColor,
                emissive: this.data.emissive,
                transparent: true,
                side: THREE.DoubleSide,
                opacity: this.data.materialOpacity,
                shininess: this.data.shininess,
                specular: this.data.specular,
              });
              break;
            default:
              material = node.material;
          }
          material.opacity = this.data.materialOpacity;
          material.transparent = true;
          if (this.data.modifyMaterial) node.material = material;
          if (this.data.stroke) {
            let edges = new THREE.EdgesGeometry(
              node.geometry,
              this.data.edgeThresholdAngle
            );
            let line = new THREE.LineSegments(
              edges,
              new THREE.LineBasicMaterial({
                color: this.data.strokeColor,
                linewidth: this.data.strokeWidth,
                linecap: "round", //ignored by WebGLRenderer
                linejoin: "round", //ignored by WebGLRenderer
              })
            );
            line.quaternion.set(
              node.quaternion.x,
              node.quaternion.y,
              node.quaternion.z,
              node.quaternion.w
            );
            line.rotation.set(
              node.rotation.x,
              node.rotation.y,
              node.rotation.z,
              node.rotation.order
            );
            line.position.set(
              node.position.x,
              node.position.y,
              node.position.z
            );
            line.scale.set(node.scale.x, node.scale.y, node.scale.z);
            node.parent.add(line);
            node.userData = {
              clicked: false,
              emphasized: false,
            };
            if (this.data.emphasisMaterial) {
              this.data.emphasisMeshName.forEach((d) => {
                if (node.name.includes(d)) {
                  node.userData.emphasized = true;
                  node.material.opacity = this.data.emphasisOpacity;
                  if (
                    this.data.material === "lambert" ||
                    this.data.material === "phong" ||
                    this.data.material === "basic"
                  )
                    node.material.color = new THREE.Color(
                      this.data.emphasisColor
                    );
                }
              });
            }
          }
        }
      });
    });
  },
});
