import * as THREE from "three";
import AFRAME from "aframe";

AFRAME.registerPrimitive("a-frame-shape", {
  defaultComponents: {
    aframeshape: {},
  },
  mappings: {
    points: "aframeshape.points",
    color: "aframeshape.color",
    opacity: "aframeshape.opacity",
    stroke_bool: "aframeshape.stroke_bool",
    stroke_color: "aframeshape.stroke_color",
    shape_position: "aframeshape.shape_position",
  },
});

AFRAME.registerComponent("aframeshape", {
  schema: {
    points: { type: "string", default: "[]" },
    color: { type: "string", default: "#000" },
    opacity: { type: "number", default: 1 },
    stroke_bool: { type: "boolean", default: false },
    stroke_color: { type: "string", default: "#000000" },
    shape_position: { type: "array", default: [0, 0, 0] },
  },
  init: function () {
    this.obj = this.el;
    let mat = new THREE.MeshStandardMaterial({
      color: this.data.color,
      opacity: this.data.opacity,
      side: THREE.DoubleSide,
      transparent: true,
    });

    let dataPoints = JSON.parse(this.data.points);
    let shape = new THREE.Shape();
    shape.moveTo(parseFloat(dataPoints[0].x), parseFloat(dataPoints[0].y));
    for (let i = 1; i < dataPoints.length; i++) {
      shape.lineTo(parseFloat(dataPoints[i].x), parseFloat(dataPoints[i].y));
    }

    let geometry = new THREE.ShapeGeometry(shape);

    let mesh = new THREE.Mesh(geometry, mat);
    mesh.geometry.computeBoundingBox();
    mesh.material.transparent = true;
    this.el.setObject3D("mesh", new AFRAME.THREE.Object3D());
    this.el.object3D.children[0].add(mesh);
  },
});
