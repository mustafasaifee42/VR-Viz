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
    return (
      <a-entity click-rotation={`enabled:${clickRotation}`} pivot-center-model={`pivotX:${this.props.style.xPivot};pivotY:${this.props.style.yPivot};pivotZ:${this.props.style.zPivot}`} gltf-model={`url(${this.props.object})`} position={`${this.props.style.position[0]} ${this.props.style.position[1]} ${this.props.style.position[2]}`} scale={`${this.props.style.scale[0]} ${this.props.style.scale[1]} ${this.props.style.scale[2]}`} modify-materials={`opacity: ${this.props.style.opacity}; color: ${this.props.style.color}`} play-all-model-animations >  
        {animation}
      </a-entity>
    )
  }
}
export default CrossSectionView