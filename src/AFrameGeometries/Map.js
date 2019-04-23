import * as AFRAME from 'aframe';
import * as THREE from 'three';

AFRAME.registerGeometry('map', {
  schema: {
    vertices: {
      default: ['-10 10 0', '-10 -10 0', '10 -10 0', '10 10 0'],
    },
    extrude: {
      default: 1,
    }
  },

  init: function (data) {
    let vertex
    vertex = data.vertices.map(function (vertex) {
      var points = vertex.split(' ').map(function (x) { return parseFloat(x); });
      return ([points[0], points[1]]);
    });
    var shape = new THREE.Shape();
    shape.moveTo(vertex[0][0], vertex[0][1]);

    for (let i = 1; i < vertex.length; i++) {
      shape.lineTo(vertex[i][0], vertex[i][1])
    }

    var extrudeSettings = {
      steps: 1,
      amount: parseFloat(data.extrude),
      bevelEnabled: false,
    };

    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    this.geometry = geometry;
  }
});