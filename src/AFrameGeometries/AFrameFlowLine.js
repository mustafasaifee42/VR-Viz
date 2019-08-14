import * as THREE from 'three';
import AFRAME from 'aframe';

AFRAME.registerPrimitive('a-frame-flowLine', {
  defaultComponents: {
    curvefrompoints: {},
  },

  mappings: {
    points: 'curvefrompoints.points',
    opacity: 'curvefrompoints.opacity',
    color: 'curvefrompoints.color',
    strokewidth: 'curvefrompoints.strokewidth',
    resolution: 'curvefrompoints.resolution',
    curviness:'curvefrompoints.curviness'
  }
});

AFRAME.registerComponent("curvefrompoints", {
  schema: {
    points:{type:'string',default:''},
    color:{type:'string',default:'#000000'},
    strokewidth:{type:'number',default:1},
    opacity:{type:'number',default:1},
    resolution:{type:'number',default:500},
    curviness:{type:'number',default: 0.5}
  },
  init: function() {
    this.obj = this.el;
    this.model = this.el.object3D;
    this.model = this.el.object3D;
    let dataPoints = JSON.parse(this.data.points)
    let pointVecs = []
    for(let  i = 0; i < dataPoints.length; i++){
      let vec = new THREE.Vector3( parseFloat(dataPoints[i].x), parseFloat(dataPoints[i].y), parseFloat(dataPoints[i].z) )
      pointVecs.push(vec)
    }
    function getPointInBetweenByPerc(pointA, pointB, percentage) {
      let dir = pointB.clone().sub(pointA);
      let len = dir.length();
      dir = dir.normalize().multiplyScalar(len*percentage);
      return pointA.clone().add(dir);
    }
    let curveObject, curve, points
    let material = new THREE.LineBasicMaterial({
      color: this.data.color,
      linewidth: this.data.strokewidth,
      opacity:this.data.opacity,
      transparent: true,
      linecap: 'round', //ignored by WebGLRenderer
      linejoin:  'round' //ignored by WebGLRenderer
    });
    let pointset1 = getPointInBetweenByPerc(pointVecs[0],pointVecs[1],this.data.curviness)
    let pointset2 = getPointInBetweenByPerc(pointVecs[1],pointVecs[2],1 - this.data.curviness)
    pointset1.z = pointVecs[1].z
    pointset2.z = pointVecs[1].z
    curve = new THREE.QuadraticBezierCurve3( pointVecs[0],pointset1,pointVecs[1] );
    points = curve.getPoints( this.data.resolution );
    let curve1 = new THREE.QuadraticBezierCurve3( pointVecs[1],pointset2,pointVecs[2] );
    let points1 = curve1.getPoints( this.data.resolution );

    points1.forEach(d => {
      points.push(d)
    })
    
    let bufferGeom = new THREE.BufferGeometry()
    let strokeVer = []
    for(let  i = 0; i < points.length; i++){
      strokeVer.push(parseFloat(points[i].x),parseFloat(points[i].y),parseFloat(points[i].z))
    }
    let strokeVerFloat = new Float32Array(strokeVer)
    bufferGeom.addAttribute( 'position', new THREE.BufferAttribute( strokeVerFloat, 3 ) );
    
    let obj = new AFRAME.THREE.Object3D()
    curveObject = new THREE.Line( bufferGeom, material )
    obj.add(curveObject)
    this.el.setObject3D("mesh", obj);
  }
});