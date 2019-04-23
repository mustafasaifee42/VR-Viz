import * as AFRAME from 'aframe';
import * as THREE from 'three';

AFRAME.registerGeometry('planeFromVertices', {
  schema: {
    vertices: {
      default: ['-10 10 0', '-10 -10 0', '10 -10 0'],
    }
  },

  init: function (data) {
    var geometry = new THREE.Geometry();
    geometry.vertices = data.vertices.map(function (vertex) {
      var points = vertex.split(' ').map(function (x) { return parseFloat(x); });
      return new THREE.Vector3(points[0], points[1], points[2]);
    });
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(0, 2, 3));
    this.geometry = geometry;
  }
});