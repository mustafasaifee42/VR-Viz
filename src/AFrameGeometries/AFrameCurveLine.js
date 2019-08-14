import * as THREE from 'three';
import AFRAME from 'aframe';

AFRAME.registerPrimitive('a-frame-curve-line', {
  defaultComponents: {
    curveline: {},
  },

  mappings: {
    points: 'curveline.points',
    opacity: 'curveline.opacity',
    color: 'curveline.color',
    stroke_width: 'curveline.stroke_width',
    type: 'curveline.type',
    resolution: 'curveline.resolution'
  }
});


AFRAME.registerComponent("curveline", {
  schema: {
    points:{type:'string',default:''},
    type:{type:'string',default:'line'},
    color:{type:'string',default:'#000000'},
    stroke_width:{type:'number',default:1},
    opacity:{type:'number',default:1},
    resolution:{type:'number',default:500}
  },
  init: function() {
    this.obj = this.el;
    this.model = this.el.object3D;
    let dataPoints = JSON.parse(this.data.points)
    let pointVecs = []
    for(let  i = 0; i < dataPoints.length; i++){
      let vec = new THREE.Vector3( parseFloat(dataPoints[i].x), parseFloat(dataPoints[i].y), parseFloat(dataPoints[i].z) )
      pointVecs.push(vec)
    }
    let curveObject, curve, geometry, points
    let material = new THREE.LineBasicMaterial({
      color: this.data.color,
      linewidth: this.data.stroke_width,
      opacity:this.data.opacity,
      transparent: true,
      linecap: 'round', //ignored by WebGLRenderer
      linejoin:  'round' //ignored by WebGLRenderer
    });
    switch(this.data.type){
      case 'line':
        geometry = new THREE.Geometry();
        geometry.vertices  = pointVecs;
        curveObject = new THREE.Line( geometry, material );
        break;
      case 'lineSegment':
        geometry = new THREE.Geometry();
        geometry.vertices  = pointVecs;
        curveObject = new THREE.LineSegments( geometry, material );
        break;
      case 'CatmullRomCurve':
        curve = new THREE.CatmullRomCurve3( pointVecs );
        points = curve.getPoints( this.data.resolution );
        geometry = new THREE.Geometry().setFromPoints( points );
        // Create the final object to add to the scene
        curveObject = new THREE.Line( geometry, material )
        break;
      default:
        geometry = new THREE.Geometry();
        geometry.vertices  = pointVecs;
        curveObject = new THREE.Line( geometry, material );
        break;
    }
    let obj = new AFRAME.THREE.Object3D()
    obj.add(curveObject)
    this.el.setObject3D("mesh", obj);
  }
});