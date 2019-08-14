import * as THREE from 'three';
import AFRAME from 'aframe';

AFRAME.registerPrimitive('a-frame-mesh-from-points', {
  defaultComponents: {
    aframemeshfrompoints: {}
  },
  mappings: {
    points: 'aframemeshfrompoints.points',
    faces: 'aframemeshfrompoints.faces',
    color:'aframemeshfrompoints.color',
    opacity: 'aframemeshfrompoints.opacity',
    materialType: 'aframemeshfrompoints.materialType',
    stroke_vertices: 'aframemeshfrompoints.stroke_vertices',
    stroke_bool: 'aframemeshfrompoints.stroke_bool',
    stroke_width: 'aframemeshfrompoints.stroke_width',
    stroke_color: 'aframemeshfrompoints.stroke_color',
    stroke_opacity:'aframemeshfrompoints.stroke_opacity'
  }
});

AFRAME.registerComponent("aframemeshfrompoints", {
  schema: {
    points:{type:'string',default:'[]'},
    faces:{type:'string',default:'[]'},
    color:{type:'string',default:'[]'},
    opacity:{type:'number',default:1},
    materialType:{type:'string',default:'standard'},
    stroke_vertices:{type:'string'},
    stroke_bool: {type:'boolean',default:false},
    stroke_width: {type:'number',default:1},
    stroke_color: {type:'string',default:'#000000'},
    stroke_opacity:{type:'number', default: 1}
  },
  init: function() {
    this.obj = this.el;
    this.model = this.el.object3D;
    var material = new THREE.MeshStandardMaterial( { vertexColors: THREE.VertexColors, side : THREE.DoubleSide, opacity: this.data.opacity , transparent: true } );
    //create a triangular geometry
    var geometry = new THREE.Geometry();
    let dataPoints = JSON.parse(this.data.points)
    let strokeVerticesArray = JSON.parse(this.data.stroke_vertices)
    let pointVecs = [], faceVecs = [], strokeVer = []
    for(let  i = 0; i < dataPoints.length; i++){
      let vec = new THREE.Vector3( parseFloat(dataPoints[i].x), parseFloat(dataPoints[i].y), parseFloat(dataPoints[i].z) )
      pointVecs.push(vec)
    }
    for(let  i = 0; i < strokeVerticesArray.length; i++){
      let vec = new THREE.Vector3( parseFloat(strokeVerticesArray[i].x), parseFloat(strokeVerticesArray[i].y), parseFloat(strokeVerticesArray[i].z) )
      strokeVer.push(vec)
    }
    geometry.vertices = pointVecs
    let faces = JSON.parse(this.data.faces)
    let vertColor = JSON.parse(this.data.color)
    for(let  i = 0; i < faces.length; i++){
      let face = new THREE.Face3( faces[i][0], faces[i][1], faces[i][2] )
      face.vertexColors[0] =  new THREE.Color(vertColor[i][0]); 
      face.vertexColors[1] =  new THREE.Color(vertColor[i][1]); 
      face.vertexColors[2] =  new THREE.Color(vertColor[i][2]); 
      faceVecs.push(face)
    }
    geometry.faces = faceVecs
    geometry.mergeVertices();
    let meshObj =  new THREE.Mesh( geometry, material ) 
    meshObj.geometry.computeBoundingBox();
    let cent = meshObj.geometry.boundingBox.getCenter(), size = meshObj.geometry.boundingBox.getSize()
    meshObj.geometry = new THREE.BufferGeometry().fromGeometry(meshObj.geometry)
    this.model.add( meshObj )
    let lineGeometry = new THREE.Geometry();
    lineGeometry.vertices = strokeVer
    let line = new THREE.LineSegments( lineGeometry, new THREE.LineBasicMaterial( { 
      color: this.data.stroke_color,
      linewidth: this.data.stroke_width,
      opacity:this.data.stroke_opacity,
      transparent:true,
      linecap: 'round', //ignored by WebGLRenderer
      linejoin:  'round' //ignored by WebGLRenderer
    } ) );
    if(this.data.stroke_bool)
      this.model.add(line)
    let box = document.createElement('a-box');
    box.setAttribute('position',`${cent.x} ${cent.y} ${cent.z}`)
    box.setAttribute('width',`${size.x}`)
    box.setAttribute('height',`${size.y}`)
    box.setAttribute('depth',`${size.z}`)
    box.setAttribute('opacity',0)
    this.el.appendChild(box);
  }
});
