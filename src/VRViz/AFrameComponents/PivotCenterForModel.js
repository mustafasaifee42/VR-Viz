import * as THREE from "three";
import AFRAME from "aframe";

AFRAME.registerComponent("pivot-center-model", {
  dependencies: ["material-modifcation"],
  schema: {
    pivotX: { type: "number", default: Infinity },
    pivotY: { type: "number", default: Infinity },
    pivotZ: { type: "number", default: Infinity },
    xPosition: { type: "number", default: 0 },
    yPosition: { type: "number", default: 0 },
    zPosition: { type: "number", default: 0 },
  },
  init: function () {
    this.obj = this.el;
    this.clickedMeshes = [];
    this.x_cord = 0;
    this.y_cord = 0;
    this.model = this.el.object3D;
    this.min = { x: [], y: [], z: [] };
    this.max = { x: [], y: [], z: [] };
    this.mouseDownTime = 0;
    this.mouseUpTime = 0;
    this.el.addEventListener("model-loaded", () => {
      let bboxCenter = new THREE.Box3()
        .setFromObject(this.el.object3D)
        .getCenter();
      let xPivot = this.data.pivotX,
        yPivot = this.data.pivotY,
        zPivot = this.data.pivotZ;
      if (isNaN(this.data.pivotX)) xPivot = bboxCenter.x;
      if (isNaN(this.data.pivotY)) yPivot = bboxCenter.y;
      if (isNaN(this.data.pivotZ)) zPivot = bboxCenter.z;
      this.el.setAttribute(
        "pivot",
        `${xPivot - this.data.xPosition} ${yPivot - this.data.yPosition} ${
          zPivot - this.data.zPosition
        }`
      );
    });
  },
});
