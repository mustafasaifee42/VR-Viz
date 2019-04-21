import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as THREE from 'three';
import * as d3 from 'd3';

AFRAME.registerComponent('modify-materials', {
  schema: {
    opacity: {type: 'float', default: 0.5},
    color: {type: 'string', default: 'black'}
  },
  init: function () {
    // Wait for model to load.
    
    var self = this;
    let opacity = self.data.opacity;
    let color = self.data.color;
    this.el.addEventListener('model-loaded', () => {
      // Grab the mesh / scene.
      const obj = this.el.getObject3D('mesh');
      // Go over the submeshes and modify materials we want.
      obj.traverse(node => {
        if(node.material) {
          if(node.type === 'Mesh') {    
            node.material = new THREE.MeshLambertMaterial({
              opacity: opacity,
              color:color,
              transparent: true,
            });
          }
        }
      });
    });
  }
});


AFRAME.registerComponent('play-all-model-animations', {
  init: function () {
    this.model = null;
    this.mixer = null;

    var model = this.el.getObject3D('mesh');
    if (model) {
      this.load(model);
    } else {
      this.el.addEventListener('model-loaded', function (e) {
        this.load(e.detail.model);
      }.bind(this));
    }
  },

  load: function (model) {
    this.model = model;
    this.mixer = new THREE.AnimationMixer(model);
    this.model.animations.forEach(animation => {
      this.mixer.clipAction(animation, model).play();
    });
  },

  tick: function (t, dt) {
    if (this.mixer && !isNaN(dt)) {
      this.mixer.update(dt / 1000);
    }
  }
});

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