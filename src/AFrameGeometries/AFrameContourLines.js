import * as THREE from 'three';
import AFRAME from 'aframe';

AFRAME.registerPrimitive('a-frame-contour-lines', {
  defaultComponents: {
    aframecontourlines: {},
  },
  mappings: {
    points: 'aframecontourlines.points',
    color:'aframecontourlines.color',
    opacity: 'aframecontourlines.opacity',
  }
});

AFRAME.registerComponent("aframecontourlines", {
  schema: {
    points:{type:'string',default:'[]'},
    color:{type:'string',default:'[]'},
    opacity:{type:'number',default:1}
  },
  init: function() {
    this.obj = this.el;
    this.model = this.el.object3D;
    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial( { 
      vertexColors: THREE.VertexColors,
      linewidth: 1,
      opacity:this.data.opacity,
      transparent:true,
      linecap: 'round', //ignored by WebGLRenderer
      linejoin:  'round' //ignored by WebGLRenderer
    } ) ;
    let strokeVer = [], colors = [];
    let strokeVerticesArray = JSON.parse(this.data.points)
    let colorListArray = JSON.parse(this.data.color)
    for(let  i = 0; i < strokeVerticesArray.length; i++){
      strokeVer.push(parseFloat(strokeVerticesArray[i].x),parseFloat(strokeVerticesArray[i].y),parseFloat(strokeVerticesArray[i].z))
      let color = new THREE.Color(colorListArray[i])
      colors.push( color.r, color.g, color.b)
    }
    let strokeVerFloat = new Float32Array(strokeVer)
    let colorsFloat = new Float32Array(colors)
    geometry.addAttribute( 'position', new THREE.BufferAttribute( strokeVerFloat, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colorsFloat, 3 ) );
    let line = new THREE.LineSegments( geometry, material );
    this.model.add(line)
  }
});
