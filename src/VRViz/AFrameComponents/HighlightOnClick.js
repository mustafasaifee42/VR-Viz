import * as THREE from "three";
import AFRAME from "aframe";

AFRAME.registerComponent("highlight-on-click", {
  dependencies: ["material-modifcation"],
  schema: {
    highlightEffect: { type: "boolean", default: false },
    highlightedOpacity: { type: "number", default: 0.8 },
    emphasisOpacity: { type: "number", default: 1 },
    materialOpacity: { type: "number", default: 1 },
    highlightedColor: { type: "string", default: "#ff0000" },
    materialColor: { type: "string", default: "#ff0000" },
    emphasisColor: { type: "string", default: "#ff0000" },
  },
  init: function () {
    this.obj = this.el;
    this.model = this.el.object3D;
    this.el.addEventListener("model-loaded", () => {
      if (this.data.highlightEffect) {
        this.el.addEventListener("click", (evt) => {
          let object;
          if (evt.detail.intersection) object = evt.detail.intersection.object;
          object.traverse((node) => {
            if (node.isMesh) {
              if (node.userData.clicked) {
                node.material.opacity = this.data.materialOpacity;
                if (node.userData.emphasized) {
                  node.material.opacity = this.data.emphasisOpacity;
                }
                if (
                  node.material.type === "MeshLambertMaterial" ||
                  node.material.type === "MeshPhongMaterial" ||
                  node.material.type === "MeshBasicMaterial"
                ) {
                  node.material.color = new THREE.Color(
                    this.data.materialColor
                  );
                  if (node.userData.emphasized) {
                    node.material.color = new THREE.Color(
                      this.data.emphasisColor
                    );
                  }
                }
                node.userData.clicked = false;
              } else {
                node.userData.clicked = true;
                node.material.opacity = this.data.highlightedOpacity;
                if (
                  node.material.type === "MeshLambertMaterial" ||
                  node.material.type === "MeshPhongMaterial" ||
                  node.material.type === "MeshBasicMaterial"
                )
                  node.material.color = new THREE.Color(
                    this.data.highlightedColor
                  );
              }
            }
          });
        });
      }
    });
  },
});
