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
    boundingboxclass:'aframemap.boundingboxclass',
  }
});

AFRAME.registerComponent("aframemap", {
  schema: {
    points:{type:'string',default:'[]'},
    extrude:{type:'string',default:'[]'},
    color:{type:'string',default:'[]'},
    opacity:{type:'number',default:1},
    stroke_bool:{type:'boolean', default:false},
    stroke_color:{type:'string',default:'#000000'},
    boundingboxclass:{type:'string'}
  },
  init: function() {
    this.obj = this.el;
    let mat = new THREE.MeshStandardMaterial( { opacity: this.data.opacity, transparent:true , vertexColors: THREE.FaceColors  } )
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
    
    let colorAray = JSON.parse(this.data.color) 
    let extrusionsettingArray = JSON.parse(this.data.extrude).map(d => {
      let obj = {
        steps: 1,
        amount : parseFloat(d),
        bevelEnabled: false, 
      }
      return obj
    })
    let geoArray = shapeArray.map((d, i) => {
      let geometry = new THREE.ExtrudeGeometry(d, extrusionsettingArray[i]);
      geometry.faces.forEach((d, j) => {
        if(d.normal.z === 0 && this.data.stroke_bool)
          d.color = new THREE.Color(this.data.stroke_color)
        else
          d.color = new THREE.Color(colorAray[i])
      })
      return geometry
    })
    let geoMerge = new THREE.Geometry()
    geoArray.forEach((d,i) => {
      geoMerge.merge(d);
    })
    geoMerge.computeBoundingSphere()
    geoMerge.computeBoundingBox()
    let mesh = new THREE.Mesh( geoMerge, mat) ;
    this.el.setObject3D("mesh", new AFRAME.THREE.Object3D());
    this.el.object3D.children[0].add( mesh )
  }
});
