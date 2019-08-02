import React, { Component } from 'react';

class CrossSectionView extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    let  clickRotation = 'true',animation;
    if(this.props.animateRotation){
      clickRotation='false'
      animation  = <a-animation
          attribute="rotation"
          easing="linear"
          dur={`${this.props.animateRotation.duration}`}
          from={this.props.animateRotation.initialAngles}
          to={this.props.animateRotation.finalAngles}
          repeat="indefinite"
        />
    }
    let modifyMaterial=false,material='none',materialOpacity = 1,shininess=30,emissive='#000000',specular='#ffffff',emphasisMaterial=false,emphasisOpacity=0.8,emphasisColor='#ffff00',highlightEffect=false,highlightedOpacity=0.8, meshName = "", highlightedColor='#ffff00',materialColor = '#ff0000',stroke = false, strokeWidth = 1, strokeColor = '#000000', edgeThresholdAngle = 20;
    if(this.props.material){
      modifyMaterial = true
      if(this.props.material.type)
        material = this.props.material.type
      if(this.props.material.fill){
        if(this.props.material.fill.opacity)
          materialOpacity = this.props.material.fill.opacity
        if(this.props.material.fill.color)
          materialColor =this.props.material.fill.color
        if(this.props.material.fill.shininess)
          shininess =this.props.material.fill.shininess
        if(this.props.material.fill.emissive)
          emissive =this.props.material.fill.emissive
        if(this.props.material.fill.specular)
          specular =this.props.material.fill.specular
      }
      if(this.props.material.stroke){
        stroke = true
        if(this.props.material.stroke.width)
          strokeWidth = this.props.material.stroke.width
        if(this.props.material.stroke.color)
          strokeColor = this.props.material.stroke.color
        if(this.props.material.stroke.edgeThresholdAngle)
          edgeThresholdAngle = this.props.material.stroke.edgeThresholdAngle
      }
      if(this.props.material.highlightOnClick){
        highlightEffect = true 
        if(this.props.material.highlightOnClick.opacity)
          highlightedOpacity = this.props.material.highlightOnClick.opacity
        if(this.props.material.highlightOnClick.color)
          highlightedColor =this.props.material.highlightOnClick.color
      }
      if(this.props.material.emphasisMaterial){
        emphasisMaterial = true
        if (this.props.material.emphasisMaterial.meshes) {
          this.props.material.emphasisMaterial.meshes.forEach(d => {
            if(meshName === "")
              meshName = d
            else
              meshName = `${meshName},${d}`
          })
        }
        if(this.props.material.emphasisMaterial.opacity)
          emphasisOpacity = this.props.material.emphasisMaterial.opacity
        if(this.props.material.emphasisMaterial.color)
          emphasisColor =this.props.material.emphasisMaterial.color
      }
    }
    return (
      <a-entity  >
        <a-entity click-rotation={`enabled:${clickRotation}`}  gltf-model={`url(${this.props.object})`} position={`${this.props.style.position[0]} ${this.props.style.position[1]} ${this.props.style.position[2]}`} play-all-model-animations material-modifcation-pivot-center-model={`specular:${specular};shininess:${shininess};emissive:${emissive};emphasisMaterial:${emphasisMaterial};emphasisMeshName:${meshName};emphasisOpacity:${emphasisOpacity};emphasisColor:${emphasisColor};highlightEffect:${highlightEffect};highlightedOpacity:${highlightedOpacity};highlightedColor:${highlightedColor};modifyMaterial:${modifyMaterial};material:${material};materialColor:${materialColor};materialOpacity:${materialOpacity};edgeThresholdAngle:${edgeThresholdAngle};stroke:${stroke};strokeWidth:${strokeWidth};strokeColor:${strokeColor};pivotX:${this.props.style.xPivot};pivotY:${this.props.style.yPivot};pivotZ:${this.props.style.zPivot}`} scale={`${this.props.style.scale[0]} ${this.props.style.scale[1]} ${this.props.style.scale[2]}`} />  
        {animation}
      </a-entity>
    )
  }
}
export default CrossSectionView