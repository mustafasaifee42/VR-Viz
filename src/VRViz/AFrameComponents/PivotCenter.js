import * as THREE from "three";
import AFRAME from "aframe";

AFRAME.registerComponent("pivot-center", {
  schema: {
    ignoreX: { type: "boolean", default: false },
    ignoreY: { type: "boolean", default: false },
    ignoreZ: { type: "boolean", default: false },
    pivotX: { type: "number", default: Infinity },
    pivotY: { type: "number", default: Infinity },
    pivotZ: { type: "number", default: Infinity },
    xPosition: { type: "number", default: 0 },
    yPosition: { type: "number", default: 0 },
    zPosition: { type: "number", default: 0 },
  },
  init: function () {
    this.obj = this.el;
    this.ifMouseDown = false;
    this.x_cord = 0;
    this.y_cord = 0;
    this.model = this.el.object3D;
    this.min = { x: Infinity, y: Infinity, z: Infinity };
    this.max = { x: -Infinity, y: -Infinity, z: -Infinity };
    const min = (a, b) => {
      if (isFinite(b)) {
        return Math.min(a, b);
      }
      return a;
    };
    const max = (a, b) => {
      if (isFinite(b)) {
        return Math.max(a, b);
      }
      return a;
    };
    if (this.el.sceneEl.hasLoaded) {
      this.model.traverse((node) => {
        const box = new THREE.Box3().setFromObject(node);
        this.min.x = min(this.min.x, box.min.x);
        this.min.y = min(this.min.y, box.min.y);
        this.min.z = min(this.min.z, box.min.z);
        this.max.x = max(this.max.x, box.max.x);
        this.max.y = max(this.max.y, box.max.y);
        this.max.z = max(this.max.z, box.max.z);
      });
      let xPivot = this.data.pivotX,
        yPivot = this.data.pivotY,
        zPivot = this.data.pivotZ;
      if (isNaN(this.data.pivotX))
        xPivot = `${this.min.x + (this.max.x - this.min.x) / 2}`;
      if (isNaN(this.data.pivotY))
        yPivot = `${this.min.y + (this.max.y - this.min.y) / 2}`;
      if (isNaN(this.data.pivotZ))
        zPivot = `${this.min.z + (this.max.z - this.min.z) / 2}`;
      if (this.data.ignoreX) xPivot = "0";
      if (this.data.ignoreY) yPivot = "0";
      if (this.data.ignoreZ) zPivot = "0";
      this.el.setAttribute(
        "pivot",
        `${xPivot - this.data.xPosition} ${yPivot - this.data.yPosition} ${
          zPivot - this.data.zPosition
        }`
      );
    }

    this.el.sceneEl.addEventListener("loaded", () => {
      if (this.el.sceneEl.hasLoaded) {
        this.model.traverse((node) => {
          const box = new THREE.Box3().setFromObject(node);
          this.min.x = min(this.min.x, box.min.x);
          this.min.y = min(this.min.y, box.min.y);
          this.min.z = min(this.min.z, box.min.z);
          this.max.x = max(this.max.x, box.max.x);
          this.max.y = max(this.max.y, box.max.y);
          this.max.z = max(this.max.z, box.max.z);
        });
        let xPivot = this.data.pivotX,
          yPivot = this.data.pivotY,
          zPivot = this.data.pivotZ;
        if (isNaN(this.data.pivotX))
          xPivot = `${this.min.x + (this.max.x - this.min.x) / 2}`;
        if (isNaN(this.data.pivotY))
          yPivot = `${this.min.y + (this.max.y - this.min.y) / 2}`;
        if (isNaN(this.data.pivotZ))
          zPivot = `${this.min.z + (this.max.z - this.min.z) / 2}`;
        if (this.data.ignoreX) xPivot = "0";
        if (this.data.ignoreY) yPivot = "0";
        if (this.data.ignoreZ) zPivot = "0";
        this.el.setAttribute(
          "pivot",
          `${xPivot - this.data.xPosition} ${yPivot - this.data.yPosition} ${
            zPivot - this.data.zPosition
          }`
        );
      }
    });
  },
});
