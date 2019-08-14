import * as THREE from 'three';
import AFRAME from 'aframe';

AFRAME.registerPrimitive('a-frame-map', {
  defaultComponents: {
    aframemap: {}
  },
  mappings: {
    points: 'aframemap.points',
    color:'aframemap.color',
    opacity: 'aframemap.opacity',
    extrude: 'aframemap.extrude',
    stroke_bool: 'aframemap.stroke_bool',
    stroke_color: 'aframemap.stroke_color',
  }
});

AFRAME.registerComponent("aframemap", {
  schema: {
    points:{type:'string',default:'[]'},
    color:{type:'string',default:'#000'},
    opacity:{type:'number',default:1},
    extrude:{type:'number',default:0.00001},
    stroke_bool:{type:'boolean', default:false},
    stroke_color:{type:'string',default:'#000000'}
  },
  init: function() {
    this.obj = this.el;
    let mat = new THREE.MeshStandardMaterial( { color: this.data.color , opacity: this.data.opacity, transparent:true  } )
    if(this.data.stroke_bool)
      mat = [new THREE.MeshStandardMaterial( { color: this.data.color , opacity: this.data.opacity, transparent:true  } ),new THREE.MeshStandardMaterial( { color: this.data.stroke_color , opacity: this.data.opacity, transparent:true  } )]
    
    let dataPoints = JSON.parse(this.data.points)
    let shapeArray = dataPoints.map(d => {
      let shape = new THREE.Shape();
      shape.moveTo( parseFloat(d[0].x) , parseFloat(d[0].y) )
      for (let i = 1; i < d.length; i++) {
        shape.lineTo( parseFloat(d[i].x) , parseFloat(d[i].y) )
      }
      shape.lineTo( parseFloat(d[0].x) , parseFloat(d[0].y) )
      return shape
    })
  
    let extrudeSettings = {
      steps: 1,
      amount : parseFloat(this.data.extrude),
      bevelEnabled: false,
    };
    let geometry = new THREE.ExtrudeBufferGeometry(shapeArray, extrudeSettings);

    let mesh = new THREE.Mesh( geometry, mat) ;

    this.el.setObject3D("mesh", new AFRAME.THREE.Object3D());
    this.el.object3D.children[0].add( mesh )
    mesh.geometry.computeBoundingBox()

    let cent = mesh.geometry.boundingBox.getCenter(), size = mesh.geometry.boundingBox.getSize()
    let box = document.createElement('a-box');
    box.setAttribute('position',`${cent.x} ${cent.y} ${cent.z}`)
    box.setAttribute('width',`${size.x}`)
    box.setAttribute('height',`${size.y}`)
    box.setAttribute('depth',this.data.extrude)
    box.setAttribute('opacity',0)
    this.el.appendChild(box);
  }
});
