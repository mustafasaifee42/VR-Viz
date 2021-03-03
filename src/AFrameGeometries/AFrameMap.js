import * as THREE from "three";
import AFRAME from "aframe";

AFRAME.registerPrimitive("a-frame-map", {
  defaultComponents: {
    aframemap: {},
  },
  mappings: {
    points: "aframemap.points",
    color: "aframemap.color",
    opacity: "aframemap.opacity",
    extrude: "aframemap.extrude",
    stroke_bool: "aframemap.stroke_bool",
    stroke_color: "aframemap.stroke_color",
    boundingboxclass: "aframemap.boundingboxclass",
  },
});

AFRAME.registerComponent("aframemap", {
  schema: {
    points: { type: "string", default: "[]" },
    extrude: { type: "string", default: "[]" },
    color: { type: "string", default: "[]" },
    opacity: { type: "number", default: 1 },
    stroke_bool: { type: "boolean", default: false },
    stroke_color: { type: "string", default: "#000000" },
    boundingboxclass: { type: "string" },
  },
  init: function () {
    this.obj = this.el;
    const mat = new THREE.MeshStandardMaterial({
      opacity: this.data.opacity,
      transparent: true,
      vertexColors: THREE.FaceColors,
    });
    const dataPoints = JSON.parse(this.data.points);
    const shapeArray = dataPoints.map((d) => {
      const shape = new THREE.Shape();
      shape.moveTo(parseFloat(d[0].x), parseFloat(d[0].y));
      for (const i = 1; i < d.length; i++) {
        shape.lineTo(parseFloat(d[i].x), parseFloat(d[i].y));
      }
      shape.lineTo(parseFloat(d[0].x), parseFloat(d[0].y));
      return shape;
    });

    const colorAray = JSON.parse(this.data.color);
    const extrusionsettingArray = JSON.parse(this.data.extrude).map((d) => ({
      steps: 1,
      depth: parseFloat(d),
      bevelEnabled: false,
    }));
    const geoArray = shapeArray.map((d, i) => {
      const geometry = new THREE.ExtrudeGeometry(d, extrusionsettingArray[i]);
      geometry.faces.forEach((d, j) => {
        d.color =
          d.normal.z === 0 && this.data.stroke_bool
            ? new THREE.Color(this.data.stroke_color)
            : new THREE.Color(colorAray[i]);
      });
      return geometry;
    });
    let geoMerge = new THREE.BufferGeometry();
    geoArray.forEach((d, i) => {
      geoMerge.merge(d);
    });
    geoMerge.computeBoundingSphere();
    geoMerge.computeBoundingBox();
    const mesh = new THREE.Mesh(geoMerge, mat);
    this.el.setObject3D("mesh", new AFRAME.THREE.Object3D());
    this.el.object3D.children[0].add(mesh);
  },
});
