import * as THREE from 'three';
import AFRAME from 'aframe';

AFRAME.registerComponent("pivot-center", {
  schema: {
    pivotX: {type: 'number', default: Infinity},
    pivotY: {type: 'number', default: Infinity},
    pivotZ: {type: 'number', default: Infinity},
  },
  init: function() {
    this.obj = this.el;
    this.ifMouseDown = false;
    this.x_cord = 0;
    this.y_cord = 0;
    this.model = this.el.object3D;
    this.min = {'x':[],'y':[],'z':[]}
    this.max = {'x':[],'y':[],'z':[]}
    document.querySelector('a-scene').addEventListener('loaded', () => {
      var bboxCenter = new THREE.Box3().setFromObject(this.el.object3D).getCenter();
      let xPivot = this.data.pivotX, yPivot = this.data.pivotY, zPivot = this.data.pivotZ
      if(isNaN(this.data.pivotX))
        xPivot = bboxCenter.x
      if(isNaN(this.data.pivotY))
        yPivot = bboxCenter.y
      if(isNaN(this.data.pivotZ))
        zPivot = bboxCenter.z
      this.el.setAttribute('pivot',`${xPivot} ${yPivot} ${zPivot}`)
    })
  }
});