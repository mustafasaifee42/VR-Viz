import * as THREE from "three";
import AFRAME from "aframe";

AFRAME.registerComponent("animate-points-on-curve", {
  schema: {
    points: { type: "string", default: "[]" },
    strokewidth: { type: "number", default: 1 },
    resolution: { type: "number", default: 500 },
    curviness: { type: "number", default: 0.5 },
    duration: { type: "number", default: 500 },
  },
  init: function () {
    function getPointInBetweenByPerc(pointA, pointB, percentage) {
      let dir = pointB.clone().sub(pointA);
      let len = dir.length();
      dir = dir.normalize().multiplyScalar(len * percentage);
      return pointA.clone().add(dir);
    }
    this.pointsSet = [];
    let dataPoints = JSON.parse(this.data.points);
    let pointVecs = [];
    for (let i = 0; i < dataPoints.length; i++) {
      let vec = new THREE.Vector3(
        parseFloat(dataPoints[i].x),
        parseFloat(dataPoints[i].y),
        parseFloat(dataPoints[i].z)
      );
      pointVecs.push(vec);
    }
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
    this.curve1 = new THREE.QuadraticBezierCurve3(
      pointVecs[0],
      pointset1,
      pointVecs[1]
    );
    this.curve2 = new THREE.QuadraticBezierCurve3(
      pointVecs[1],
      pointset2,
      pointVecs[2]
    );
  },

  update: function (oldData) {
    this.initialPosition = this.el.object3D.position;
    this.reset();
  },
  reset: function () {
    // Reset to initial state
    this.interval = 0;
  },

  getI_: function (interval, dur) {
    let i = 0;

    if (interval >= dur) {
      // Time is up, we should be at the end of the path
      i = 1;
    } else if (interval < 0) {
      // so keep entity at the beginning of the path
      i = 0;
    } else {
      // Update path position based on timing
      i = interval / dur;
    }

    return i;
  },
  tick: function (time, timeDelta) {
    // Only update position if we didn't reach
    // the end of the path
    this.interval = this.interval + timeDelta;
    let i = this.getI_(this.interval, this.data.duration);
    if (i >= 1) {
      // We have reached the end of the path
      // but we are looping through the curve,
      // so restart here.
      this.interval = 0;
    } else {
      if (i < 0.5) {
        let p = this.curve1.getPoint(i * 2);
        this.el.setAttribute("position", p);
      } else {
        let p = this.curve2.getPoint((i - 0.5) * 2);
        this.el.setAttribute("position", p);
      }
    }
  },
});
