import * as AFRAME from 'aframe';
import * as THREE from 'three';

AFRAME.registerComponent('modify-materials', {
  schema: {
    opacity: {type: 'float', default: 0.5},
    color: {type: 'string', default: 'black'}
  },
  init: function () {
    var self = this;
    let opacity = self.data.opacity;
    let color = self.data.color;
    this.el.addEventListener('model-loaded', () => {
      // Grab the mesh / scene.
      const obj = this.el.getObject3D('mesh');
      // Go over the submeshes and modify materials we want.
      obj.traverse(node => {
        if(node.material) {
          if(node.type === 'Mesh') {    
            node.material = new THREE.MeshLambertMaterial({
              opacity: opacity,
              color:color,
              transparent: true,
            });
          }
        }
      });
    });
  }
});