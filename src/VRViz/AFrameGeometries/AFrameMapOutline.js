import * as THREE from "three";
import AFRAME from "aframe";

AFRAME.registerPrimitive("a-frame-map-outline", {
  defaultComponents: {
    aframemap: {},
  },
  mappings: {
    points: "aframemapoutline.points",
    extrude: "aframemapoutline.extrude",
    stroke_bool: "aframemapoutline.stroke_bool",
    stroke_color: "aframemapoutline.stroke_color",
  },
});

AFRAME.registerComponent("aframemapoutline", {
  schema: {
    points: { type: "string", default: "[]" },
    extrude: { type: "number", default: 0.00001 },
    stroke_bool: { type: "boolean", default: false },
    stroke_color: { type: "string", default: "#000000" },
  },
  init: function () {
    if (this.data.stroke_bool) {
      this.obj = this.el;
      const dataPoints = JSON.parse(this.data.points);
      const outlinePnts = [];
      dataPoints.forEach((d) => {
        outlinePnts.push(
          parseFloat(d[0].x),
          parseFloat(d[0].y),
          parseFloat(this.data.extrude)
        );
        for (let i = 1; i < d.length; i++) {
          outlinePnts.push(
            parseFloat(d[i].x),
            parseFloat(d[i].y),
            parseFloat(this.data.extrude)
          );
          outlinePnts.push(
            parseFloat(d[i].x),
            parseFloat(d[i].y),
            parseFloat(this.data.extrude)
          );
        }
        outlinePnts.push(
          parseFloat(d[0].x),
          parseFloat(d[0].y),
          parseFloat(this.data.extrude)
        );
      });
      const lineMaterial = new THREE.LineBasicMaterial({
        color: this.data.stroke_color,
        linewidth: 1,
        opacity: 1,
        linecap: "round", //ignored by WebGLRenderer
        linejoin: "round", //ignored by WebGLRenderer
      });

      let lineGeometry = new THREE.BufferGeometry();
      const strokeVerFloat = new Float32Array(outlinePnts);
      lineGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(strokeVerFloat, 3)
      );

      const line = new THREE.LineSegments(lineGeometry, lineMaterial);
      this.el.object3D.add(line);
    }
  },
});
