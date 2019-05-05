import * as AFRAME from 'aframe';

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}


let coordinates = AFRAME.utils.coordinates;

AFRAME.registerComponent('plane-from-vertices', {
  schema: {
    face:{type:'boolean',default: true},
    faceColor: { type:'color',default: '#333' },
    faceOpacity: {type:'number',default: 1},
    path: {
      default: [
        { x: -0.5, y: 0, z: 0 },
        { x: 0.5, y: 0, z: 0 }
      ],
      
      parse: function (value) {
        return value.split(',').map(coordinates.parse);
      },

      stringify: function (data) {
        return data.map(coordinates.stringify).join(',');
      }
    },

    stroke:{type:'boolean',default:false},
    strokeWidth:{type:'number',default: 1},
    strokeColor:{type:'color',default:'#000'},
  },


  update: function (oldData) {
    let strokeGeometry = new AFRAME.THREE.Geometry();
    let bufferGeometry = new AFRAME.THREE.BufferGeometry();
    let vertices = [];
    this.data.path.forEach(function (vec3) {
      vertices.push( vec3.x, vec3.y,vec3.z )
      strokeGeometry.vertices.push(
        new AFRAME.THREE.Vector3(vec3.x, vec3.y, vec3.z)
      );
    });
    let indices = [0, 1, 2, 0, 2, 3];
    bufferGeometry.setIndex( indices );
    bufferGeometry.addAttribute( 'position', new AFRAME.THREE.Float32BufferAttribute( vertices, 3 ) );
    
    
    var material = new AFRAME.THREE.MeshPhongMaterial( {
      color: this.data.faceColor, 
      shininess: 250,
      side: AFRAME.THREE.DoubleSide,
      transparent: true,
      opacity: this.data.faceOpacity
    });
    
    let strokeMaterial = new AFRAME.THREE.LineBasicMaterial({
      color: this.data.strokeColor,
      linewidth: this.data.strokeWidth,
      linecap: 'round', //ignored by WebGLRenderer
      linejoin:  'round' //ignored by WebGLRenderer
    });
  
  
    // Apply mesh.
    let faceMesh = new AFRAME.THREE.Mesh(bufferGeometry, material);

    // Apply mesh.
    let lineMesh = new AFRAME.THREE.Line(strokeGeometry, strokeMaterial);
    let group = new AFRAME.THREE.Group();
    if(this.data.stroke)
      group.add( lineMesh );
    if(this.data.face)
      group.add( faceMesh );
    
    this.el.setObject3D('group', group);
  },

});
