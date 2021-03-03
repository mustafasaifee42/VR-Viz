import * as THREE from "three";
import AFRAME from "aframe";
import { ConicPolygonGeometry } from "three-conic-polygon-geometry";

AFRAME.registerPrimitive("a-frame-globe", {
  defaultComponents: {
    aframeglobe: {},
  },
  mappings: {
    points: "aframeglobe.points",
    color: "aframeglobe.color",
    opacity: "aframeglobe.opacity",
    extrude: "aframeglobe.extrude",
    radius: "aframeglobe.radius",
    stroke_bool: "aframeglobe.stroke_bool",
    stroke_color: "aframeglobe.stroke_color",
  },
});

AFRAME.registerComponent("aframeglobe", {
  schema: {
    points: { type: "string", default: "[]" },
    extrude: { type: "number", default: 0 },
    color: { type: "string", default: "red" },
    opacity: { type: "number", default: 0.5 },
    radius: { type: "number", default: 5 },
    stroke_bool: { type: "boolean", default: false },
    stroke_color: { type: "string", default: "#000000" },
  },
  init: function () {
    this.obj = this.el;
    const strokeColor = this.data.stroke_bool
      ? this.data.stroke_color
      : this.data.color;
    const polygonGeoJson = JSON.parse(this.data.points);
    const materials = [
      new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: strokeColor,
        opacity: this.data.opacity,
        transparent: true,
      }), // side material
      new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: this.data.color,
        opacity: this.data.opacity,
        transparent: true,
      }), // bottom cap material
      new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: this.data.color,
        opacity: this.data.opacity,
        transparent: true,
      }), // top cap material
    ];
    const polygonMeshes = [];
    const polygons =
      polygonGeoJson.type === "Polygon"
        ? [polygonGeoJson.coordinates]
        : polygonGeoJson.coordinates;
    polygons.forEach((coords) => {
      polygonMeshes.push(
        new THREE.Mesh(
          new ConicPolygonGeometry(
            coords,
            this.data.radius,
            this.data.radius * (1 + this.data.extrude)
          ),
          materials
        )
      );
    });
    this.el.setObject3D("mesh", new AFRAME.THREE.Object3D());
    polygonMeshes.forEach((d) => {
      this.el.object3D.children[0].add(d);
    });
  },
});
