import AFRAME from "aframe";
import * as THREE from "three";

AFRAME.registerComponent("click-rotation", {
  schema: {
    enabled: { type: "boolean", default: true },
    speed: { type: "number", default: 1 },
    yAxis: { type: "boolean", default: true },
    xAxis: { type: "boolean", default: true },
  },

  init: function () {
    this.obj = this.el;
    this.ifMouseDown = false;
    this.x_cord = 0;
    this.y_cord = 0;
    document.addEventListener("mousedown", (event) => {
      if (this.data.enabled) {
        this.x_cord = event.clientX;
        this.y_cord = event.clientY;
      }
    });
    this.el.addEventListener("mousedown", (event) => {
      if (this.data.enabled) {
        this.ifMouseDown = true;
        document
          .getElementById("head")
          .setAttribute("look-controls", "enabled: false");
      }
    });
    document.addEventListener("mouseup", (event) => {
      if (this.data.enabled) {
        this.ifMouseDown = false;
        document
          .getElementById("head")
          .setAttribute("look-controls", "enabled: true");
      }
    });
    document.addEventListener("mousemove", (event) => {
      if (this.ifMouseDown && this.data.enabled) {
        var temp_x = this.data.yAxis ? event.clientX - this.x_cord : 0;
        var temp_y = this.data.xAxis ? event.clientY - this.y_cord : 0;

        var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            temp_y * this.data.speed * (Math.PI / 180),
            temp_x * this.data.speed * (Math.PI / 180),
            0,
            "XYZ"
          )
        );

        this.el.object3D.quaternion.multiplyQuaternions(
          deltaRotationQuaternion,
          this.el.object3D.quaternion
        );
        this.x_cord = event.clientX;
        this.y_cord = event.clientY;
      }
    });
  },
});
