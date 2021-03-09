import * as THREE from "three";
import AFRAME from "aframe";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";

AFRAME.registerPrimitive("a-frame-flowLine", {
  defaultComponents: {
    curvefrompoints: {},
  },

  mappings: {
    points: "curvefrompoints.points",
    opacity: "curvefrompoints.opacity",
    color: "curvefrompoints.color",
    strokewidth: "curvefrompoints.strokewidth",
    resolution: "curvefrompoints.resolution",
    curviness: "curvefrompoints.curviness",
  },
});

AFRAME.registerComponent("curvefrompoints", {
  schema: {
    points: { type: "string", default: "[]" },
    color: { type: "string", default: "[]" },
    strokewidth: { type: "number", default: 1 },
    opacity: { type: "number", default: 1 },
    resolution: { type: "number", default: 500 },
    curviness: { type: "number", default: 0.5 },
  },
  init: function () {
    function getPointInBetweenByPerc(pointA, pointB, percentage) {
      let dir = pointB.clone().sub(pointA);
      let len = dir.length();
      dir = dir.normalize().multiplyScalar(len * percentage);
      return pointA.clone().add(dir);
    }
    this.obj = this.el;
    this.model = this.el.object3D;
    let material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
      linewidth: this.data.strokewidth,
      opacity: this.data.opacity,
      transparent: true,
      linecap: "round", //ignored by WebGLRenderer
      linejoin: "round", //ignored by WebGLRenderer
    });
    let dataPoints = JSON.parse(this.data.points);
    let colorPoints = JSON.parse(this.data.color);
    let bufferGeomArray = dataPoints.map((d, j) => {
      let pointVecs = [];
      for (let i = 0; i < d.length; i++) {
        let vec = new THREE.Vector3(
          parseFloat(d[i].x),
          parseFloat(d[i].y),
          parseFloat(d[i].z)
        );
        pointVecs.push(vec);
      }
      let curve, points;
      let pointset1 = getPointInBetweenByPerc(
        pointVecs[0],
        pointVecs[1],
        this.data.curviness
      );
      let pointset2 = getPointInBetweenByPerc(
        pointVecs[1],
        pointVecs[2],
        1 - this.data.curviness
      );
      pointset1.z = pointVecs[1].z;
      pointset2.z = pointVecs[1].z;
      curve = new THREE.QuadraticBezierCurve3(
        pointVecs[0],
        pointset1,
        pointVecs[1]
      );
      points = curve.getPoints(this.data.resolution);
      let curve1 = new THREE.QuadraticBezierCurve3(
        pointVecs[1],
        pointset2,
        pointVecs[2]
      );
      let points1 = curve1.getPoints(this.data.resolution);

      points1.forEach((el) => {
        points.push(el);
      });
      let lineSegmentPoints = [],
        vertexColor = [];
      points.forEach((el, i) => {
        if (i === 0 || i === points.length - 1) {
          lineSegmentPoints.push(el.x);
          lineSegmentPoints.push(el.y);
          lineSegmentPoints.push(el.z);
          const col = new THREE.Color(colorPoints[j]);
          vertexColor.push(col.r);
          vertexColor.push(col.g);
          vertexColor.push(col.b);
        } else {
          lineSegmentPoints.push(el.x);
          lineSegmentPoints.push(el.y);
          lineSegmentPoints.push(el.z);
          lineSegmentPoints.push(el.x);
          lineSegmentPoints.push(el.y);
          lineSegmentPoints.push(el.z);
          const col = new THREE.Color(colorPoints[j]);
          vertexColor.push(col.r);
          vertexColor.push(col.g);
          vertexColor.push(col.b);
          vertexColor.push(col.r);
          vertexColor.push(col.g);
          vertexColor.push(col.b);
        }
      });
      let bufferGeom = new THREE.BufferGeometry();

      const strokeVerFloat = new Float32Array(lineSegmentPoints);
      const colorsFloat = new Float32Array(vertexColor);

      bufferGeom.setAttribute(
        "position",
        new THREE.BufferAttribute(strokeVerFloat, 3)
      );
      bufferGeom.setAttribute(
        "color",
        new THREE.BufferAttribute(colorsFloat, 3)
      );
      return bufferGeom;
    });

    let geoMergeBuffer = BufferGeometryUtils.mergeBufferGeometries(
      bufferGeomArray
    );

    let curveObject;
    let obj = new AFRAME.THREE.Object3D();
    curveObject = new THREE.LineSegments(geoMergeBuffer, material);
    obj.add(curveObject);
    this.el.setObject3D("mesh", obj);
  },
});
