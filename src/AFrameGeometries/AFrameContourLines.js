import * as THREE from "three";
import AFRAME from "aframe";

AFRAME.registerPrimitive("a-frame-contour-lines", {
  defaultComponents: {
    aframecontourlines: {},
  },
  mappings: {
    points: "aframecontourlines.points",
    color: "aframecontourlines.color",
    opacity: "aframecontourlines.opacity",
  },
});

AFRAME.registerComponent("aframecontourlines", {
  schema: {
    points: { type: "string", default: "[]" },
    color: { type: "string", default: "[]" },
    opacity: { type: "number", default: 1 },
  },
  init: function () {
    this.obj = this.el;
    this.model = this.el.object3D;
    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
      linewidth: 1,
      opacity: this.data.opacity,
      transparent: true,
      linecap: "round", //ignored by WebGLRenderer
      linejoin: "round", //ignored by WebGLRenderer
    });
    let strokeVer = [],
      colors = [];
    const strokeVerticesArray = JSON.parse(this.data.points);
    const colorListArray = JSON.parse(this.data.color);
    for (let i = 0; i < strokeVerticesArray.length; i++) {
      strokeVer.push(
        parseFloat(strokeVerticesArray[i].x),
        parseFloat(strokeVerticesArray[i].y),
        parseFloat(strokeVerticesArray[i].z)
      );
      const color = new THREE.Color(colorListArray[i]);
      colors.push(color.r, color.g, color.b);
    }
    const strokeVerFloat = new Float32Array(strokeVer);
    const colorsFloat = new Float32Array(colors);
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(strokeVerFloat, 3)
    );
    geometry.setAttribute("color", new THREE.BufferAttribute(colorsFloat, 3));
    const line = new THREE.LineSegments(geometry, material);
    this.model.add(line);
  },
});
