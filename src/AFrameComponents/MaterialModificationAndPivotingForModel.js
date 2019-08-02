import * as THREE from 'three';
import AFRAME from 'aframe';

AFRAME.registerComponent("material-modifcation-pivot-center-model", {
  schema: {
    pivotX: {type: 'number', default: Infinity},
    pivotY: {type: 'number', default: Infinity},
    pivotZ: {type: 'number', default: Infinity},
    stroke:{type:'boolean',default:false},
    strokeWidth:{type:'number',default: 1},
    strokeColor:{type:'string',default:'#000000'},
    edgeThresholdAngle:{type:'number',default:20},
    modifyMaterial:{type:'boolean',default: false},
    material:{type:'string',default:'none'},
    materialColor: { type:'string',default: '#ff0000' },
    materialOpacity: {type:'number',default: 1},
    highlightEffect:{type:'boolean',default: false},
    emphasisMaterial: {type:'boolean',default: false},
    emphasisMeshName:{type:'array', default:[]},
    emphasisOpacity: {type:'number',default: 0.8},
    emphasisColor: { type:'string',default: '#ffff00' },
    shininess: {type:'number',default: 30},
    emissive: { type:'string',default: '#3a3a3a' },
    specular: { type:'string',default: '#ffffff' },
    highlightedOpacity: {type:'number',default: 0.8},
    highlightedColor: { type:'string',default: '#ff0000' }
  },
  init: function() {
    this.obj = this.el;
    this.clickedMeshes = []
    this.x_cord = 0;
    this.y_cord = 0;
    this.model = this.el.object3D;
    this.min = {'x':[],'y':[],'z':[]}
    this.max = {'x':[],'y':[],'z':[]}
    this.mouseDownTime = 0;
    this.mouseUpTime = 0;
    this.el.addEventListener('model-loaded', () => {;
      // Go over the submeshes and modify materials we want.
        this.model.traverse((node) => {
          if(node.material) {
            if(node.type === 'Mesh') {
              
              let material = node.material;
              material.opacity = this.data.materialOpacity;
              material.transparent = true
              if(this.data.material === 'normal')
                material = new THREE.MeshNormalMaterial({
                  opacity: this.data.materialOpacity,
                  side: THREE.DoubleSide,
                  transparent: true,
                });
              if(this.data.material === 'lambert')
                material = new THREE.MeshLambertMaterial({
                  opacity: this.data.materialOpacity,
                  color: this.data.materialColor,
                  side: THREE.DoubleSide,
                  transparent: true,
                });
              if(this.data.material === 'phong')
                material =  new THREE.MeshPhongMaterial({
                    color: this.data.materialColor,
                    emissive: this.data.emissive,
                    transparent:true,
                    side: THREE.DoubleSide,
                    opacity:this.data.materialOpacity,
                    shininess: this.data.shininess,
                    specular: this.data.specular,
                })
              if(this.data.modifyMaterial)
                node.material = material
              let geometry = new THREE.Geometry().fromBufferGeometry( node.geometry );
              geometry.mergeVertices()
              node.geometry = geometry
              if(this.data.stroke){
                let edges = new THREE.EdgesGeometry( node.geometry,this.data.edgeThresholdAngle );
                let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { 
                  color: this.data.strokeColor,
                  linewidth: this.data.strokeWidth,
                  linecap: 'round', //ignored by WebGLRenderer
                  linejoin:  'round' //ignored by WebGLRenderer
                } ) );
                line.quaternion.set(node.quaternion.x,node.quaternion.y,node.quaternion.z,node.quaternion.w)
                line.rotation.set(node.rotation.x,node.rotation.y,node.rotation.z,node.rotation.order)
                line.position.set(node.position.x,node.position.y,node.position.z)
                line.scale.set(node.scale.x,node.scale.y,node.scale.z)
                node.parent.add(line)
                node.userData = {
                  'clicked':false,
                  'emphasized':false
                }
              }
            }
          }
        })
      let bboxCenter = new THREE.Box3().setFromObject(this.el.object3D).getCenter();
      let xPivot = this.data.pivotX, yPivot = this.data.pivotY, zPivot = this.data.pivotZ
      if(isNaN(this.data.pivotX))
        xPivot = bboxCenter.x
      if(isNaN(this.data.pivotY))
        yPivot = bboxCenter.y
      if(isNaN(this.data.pivotZ))
        zPivot = bboxCenter.z
      this.el.setAttribute('pivot',`${xPivot} ${yPivot} ${zPivot}`)
      if(this.data.emphasisMaterial){
        this.data.emphasisMeshName.forEach(d => {
          this.model.traverse((node) => {
            if(node.material) {
              if(node.type === 'Mesh') {
                if(node.name.includes(d)){
                  node.userData.emphasized = true
                  node.material.opacity = this.data.emphasisOpacity
                  if(node.material.type === "MeshLambertMaterial" || node.material.type === "MeshPhongMaterial")
                    node.material.color = new THREE.Color(this.data.emphasisColor)
                }
              }
            }
          })
        })
      }
      if(this.data.highlightEffect){
        this.el.addEventListener('mousedown', (evt) => {
          this.mouseDownTime  = evt.timeStamp
        })
        this.el.addEventListener('mouseup', (evt) => {
          this.mouseUpTime  = evt.timeStamp;
          let object
          if(evt.detail.intersection)
            object = evt.detail.intersection.object;
          let clickPeriod = this.mouseUpTime - this.mouseDownTime
          if(clickPeriod < 500){
          
            // name of object and its children
            object.traverse((node) => {
              if(node.material) {
                if(node.userData.clicked){
                  node.material.opacity = this.data.materialOpacity
                  if(node.userData.emphasized) {
                    node.material.opacity = this.data.emphasisOpacity
                  }
                  if(node.material.type === "MeshLambertMaterial" || node.material.type === "MeshPhongMaterial"){
                    node.material.color = new THREE.Color(this.data.materialColor)
                    if(node.userData.emphasized) {
                      node.material.color = new THREE.Color(this.data.emphasisColor)
                    }
                  }
                  node.userData.clicked = false
                }
                else {
                  node.userData.clicked = true
                  node.material.opacity = this.data.highlightedOpacity
                  if(node.material.type === "MeshLambertMaterial" || node.material.type === "MeshPhongMaterial")
                    node.material.color = new THREE.Color(this.data.highlightedColor)
                }
              }
            });  
          }
        })
      }
    })
  }
});