import * as THREE from "three";
import AFRAME from "aframe";

AFRAME.registerPrimitive("a-frame-mesh-from-points", {
  defaultComponents: {
    aframemeshfrompoints: {},
  },
  mappings: {
    points: "aframemeshfrompoints.points",
    color: "aframemeshfrompoints.color",
    opacity: "aframemeshfrompoints.opacity",
    material_type: "aframemeshfrompoints.material_type",
    stroke_bool: "aframemeshfrompoints.stroke_bool",
    stroke_width: "aframemeshfrompoints.stroke_width",
    stroke_color: "aframemeshfrompoints.stroke_color",
    stroke_opacity: "aframemeshfrompoints.stroke_opacity",
  },
});

AFRAME.registerComponent("aframemeshfrompoints", {
  schema: {
    points: { type: "string", default: "[]" },
    color: { type: "string", default: "[]" },
    opacity: { type: "number", default: 1 },
    material_type: { type: "string", default: "standard" },
    stroke_bool: { type: "boolean", default: false },
    stroke_width: { type: "number", default: 1 },
    stroke_color: { type: "string", default: "#000000" },
    stroke_opacity: { type: "number", default: 1 },
  },
  init: function () {
    this.obj = this.el;
    this.model = this.el.object3D;
    var material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      opacity: this.data.opacity,
      transparent: true,
    });
    //create a triangular geometry
    var geometry = new THREE.BufferGeometry();
    const pointVecs = JSON.parse(this.data.points);
    const colorMatrix = JSON.parse(this.data.color);

    const vertColor = [];

    colorMatrix.forEach((d) => {
      let col = new THREE.Color(d);
      vertColor.push(col.r);
      vertColor.push(col.g);
      vertColor.push(col.b);
    });
    const vertices = new Float32Array(pointVecs);
    const vertexColor = new Float32Array(vertColor);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(vertexColor, 3));
    let meshObj = new THREE.Mesh(geometry, material);
    meshObj.geometry.computeBoundingBox();
    this.model.add(meshObj);
    let line = new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({
        color: this.data.stroke_color,
        linewidth: this.data.stroke_width,
        opacity: this.data.stroke_opacity,
        transparent: true,
        linecap: "round", //ignored by WebGLRenderer
        linejoin: "round", //ignored by WebGLRenderer
      })
    );
    if (this.data.stroke_bool) this.model.add(line);
  },
});
