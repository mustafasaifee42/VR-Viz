import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';
import GetDomain from '../Utils/GetDomain.js';

class AxisBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <a-entity line={`start: 0, 0, 0; end: ${this.props.width} 0 0; color: ${this.props.color}`}
        line__2={`start: 0, 0, 0; end: 0 ${this.props.height} 0; color: ${this.props.color}`}
        line__3={`start: 0, 0, 0; end: 0 0 ${this.props.depth}; color: ${this.props.color}`}
        line__4={`start: ${this.props.width}, ${this.props.height}, ${this.props.depth}; end: 0 ${this.props.height} ${this.props.depth}; color: ${this.props.color}`}
        line__5={`start: ${this.props.width}, ${this.props.height}, ${this.props.depth}; end: ${this.props.width} 0 ${this.props.depth}; color: ${this.props.color}`}
        line__6={`start: ${this.props.width}, ${this.props.height}, ${this.props.depth}; end: ${this.props.width} ${this.props.height} 0; color: ${this.props.color}`}
        line__7={`start: ${this.props.width}, 0, ${this.props.depth}; end: 0 0 ${this.props.depth}; color: ${this.props.color}`}
        line__8={`start: ${this.props.width}, 0, ${this.props.depth}; end: ${this.props.width} 0 0; color: ${this.props.color}`}
        line__9={`start: 0, ${this.props.height}, 0; end: 0 ${this.props.height} ${this.props.depth}; color: ${this.props.color}`}
        line__10={`start: 0, ${this.props.height}, 0; end: ${this.props.width} ${this.props.height} 0; color: ${this.props.color}`}
        line__11={`start: 0, 0, ${this.props.depth}; end: 0 ${this.props.height} ${this.props.depth}; color: ${this.props.color}`}
        line__12={`start: ${this.props.width}, 0, 0; end: ${this.props.width} ${this.props.height} 0; color: ${this.props.color}`} 
       />
    )
  }
}
export default AxisBox