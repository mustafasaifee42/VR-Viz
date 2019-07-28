import * as THREE from 'three';
import AFRAME from 'aframe';

AFRAME.registerComponent("pivot-center-model", {
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
    this.el.addEventListener('model-loaded', () => {
      const obj = this.el.getObject3D('mesh');
      // Go over the submeshes and modify materials we want.
      obj.traverse(node => {
        if(node.material) {
          if(node.type !== 'Group') {  
            node.geometry.center() 
            const box = new THREE.Box3().setFromObject(node);
            if(!Number.isNaN(box.min.x))
              this.min.x.push(box.min.x)
            if(!Number.isNaN(box.min.y))
              this.min.y.push(box.min.y)
            if(!Number.isNaN(box.min.z))
              this.min.z.push(box.min.z)
            if(!Number.isNaN(box.max.x))
              this.max.x.push(box.max.x)
            if(!Number.isNaN(box.max.y))
              this.max.y.push(box.max.y)
            if(!Number.isNaN(box.max.z))
              this.max.z.push(box.max.z)
          }
        }
      })
      let xPivot = this.data.pivotX, yPivot = this.data.pivotY, zPivot = this.data.pivotZ
      if(isNaN(this.data.pivotX))
        xPivot = `${Math.min(...this.min.x) + (Math.max(...this.max.x) - Math.min(...this.min.x)) / 2}`
      if(isNaN(this.data.pivotY))
        yPivot = `${Math.min(...this.min.y) + (Math.max(...this.max.y) - Math.min(...this.min.y)) / 2}`
      if(isNaN(this.data.pivotZ))
        zPivot = `${Math.min(...this.min.z) + (Math.max(...this.max.z) - Math.min(...this.min.z)) / 2}`
      this.el.setAttribute('pivot',`${xPivot} ${yPivot} ${zPivot}`)
    })
  }
});