import React, { Component } from 'react';
import * as d3 from 'd3';

class CrossSectionView extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  startAnimation = () => {
    d3.select(`#${this.props.index}`)
      .transition()
      .duration(this.props.animateRotation.duration)
      .ease(d3.easeLinear)
      .attrTween("rotation", () => d3.interpolate(`${this.props.animateRotation.initialAngles[0]} ${this.props.animateRotation.initialAngles[1]} ${this.props.animateRotation.initialAngles[2]}`, `${this.props.animateRotation.finalAngles[0]} ${this.props.animateRotation.finalAngles[1]} ${this.props.animateRotation.finalAngles[2]}`));
}
  componentWillMount(){
    if(this.props.animateRotation) {
      this.startAnimation();
      window.setInterval(this.startAnimation, this.props.animateRotation.duration);
    }
  }

  render() {
    let pivot
    if(this.props.style.pivot)
      pivot = this.props.style.pivot;
    else
      pivot = `0 0 0`
    return (
      <a-entity pivot={pivot} gltf-model={`url(${this.props.object})`} position={`${this.props.style.position[0]} ${this.props.style.position[1]} ${this.props.style.position[2]}`} scale={`${this.props.style.scale[0]} ${this.props.style.scale[1]} ${this.props.style.scale[2]}`} modify-materials={`opacity: ${this.props.style.opacity}; color: ${this.props.style.color}`} play-all-model-animations />
    )
  }
}
export default CrossSectionView