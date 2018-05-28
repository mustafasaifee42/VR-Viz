import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';
import * as THREE from 'three';

import GetDomain from '../Utils/GetDomain.js';
import GetMapShape from '../Utils/GetMapShape';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';
import ReadPLY from './ReadPLY.js';

AFRAME.registerGeometry('map', {
  schema: {
    vertices: {
      default: ['-10 10 0', '-10 -10 0', '10 -10 0', '10 10 0'],
    },
    extrude: {
      default: 1,
    }
  },

  init: function (data) {
    let vertex
    vertex = data.vertices.map(function (vertex) {
      var points = vertex.split(' ').map(function (x) { return parseFloat(x); });
      return ([points[0], points[1]]);
    });
    var shape = new THREE.Shape();
    shape.moveTo(vertex[0][0], vertex[0][1]);

    for (let i = 1; i < vertex.length; i++) {
      shape.lineTo(vertex[i][0], vertex[i][1])
    }

    var extrudeSettings = {
      steps: 1,
      amount: parseFloat(data.extrude),
      bevelEnabled: false,
    };

    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    this.geometry = geometry;
  }
});

class PrismMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    if (this.props.data) {
      switch (this.props.data.fileType) {
        case 'json': {
          json(this.props.data.dataFile, (error, data) => {

            if (error) {
              this.setState({
                error: true,
              });
            } else {
              this.setState({
                data: data,
              });
            }
          });
          break;
        }
        case 'csv': {
          csv(this.props.data.dataFile, (error, data) => {
            data = data.map(d => {
              for (let i = 0; i < this.props.data.fieldDesc.length; i++) {
                if (this.props.data.fieldDesc[i][1] === 'number')
                  d[this.props.data.fieldDesc[i][0]] = +d[this.props.data.fieldDesc[i][0]]
              }
              return d
            })
            if (error) {
              this.setState({
                error: true,
              });
            } else {
              this.setState({
                data: data,
              });
            }
          });
          break;
        }
        case 'ply': {
          let data = ReadPLY(this.props.data.dataFile);
          this.setState({
            data: data,
          })
          break;
        }
        case 'text': {
          text(this.props.data.dataFile, (error, text) => {

            let data = d3.csvParseRows(text).map(function (row) {
              return row.map(function (value) {
                return +value;
              });
            });
            if (error) {
              this.setState({
                error: true,
              });
            } else {
              this.setState({
                data: data,
              });
            }
          });
          break;
        }
        default: {
          csv(this.props.data.dataFile, (error, data) => {
            data = data.map(d => {
              for (let i = 0; i < this.props.data.fieldDesc.length; i++) {
                if (this.props.data.fieldDesc[i][1] === 'number')
                  d[this.props.data.fieldDesc[i][0]] = +d[this.props.data.fieldDesc[i][0]]
              }
              return d
            })
            if (error) {
              this.setState({
                error: true,
              });
            } else {
              this.setState({
                data: data,
              });
            }
          });
          break;
        }
      }
    } else {
      this.setState({
        data: 'NA',
      });
    }
  }

  render() {
    if (!this.state.data) {
      return <a-entity />
    }
    else {

      // Data Manipulation

      let data = {}
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.props.mark.map.style.fill.scale)
          data[this.state.data[i][this.props.mark.map.shapeIdentifier]] = { 'value': this.state.data[i][this.props.mark.map.style.extrusion.field], 'colorField': this.state.data[i][this.props.mark.map.style.fill.field] }
        else
          data[this.state.data[i][this.props.mark.map.shapeIdentifier]] = { 'value': this.state.data[i][this.props.mark.map.style.extrusion.field], 'colorField': 'NA' }
      }

      // Getting domain
      let colorDomain, extrusionDomain;

      if (this.props.mark.map.style.extrusion.scale) {
        if (!this.props.mark.map.style.extrusion.domain) {
          extrusionDomain = GetDomain(this.state.data, this.props.mark.map.style.extrusion.field, this.props.mark.map.style.extrusion.scaleType)
        } else
          extrusionDomain = this.props.mark.map.style.extrusion.domain
      }

      if (this.props.mark.map.style.fill.scale) {
        if (!this.props.mark.map.style.fill.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.map.style.fill.field, this.props.mark.map.style.fill.scaleType)
        } else
          colorDomain = this.props.mark.map.style.fill.domain
      }

      //Adding scales

      let colorScale, extrusionScale;

      extrusionScale = d3.scaleLinear()
        .domain(extrusionDomain)
        .range(this.props.mark.map.style.extrusion.value)

      if (this.props.mark.map.style.fill.scale)
        if (this.props.mark.map.style.fill.scaleType === 'ordinal')
          colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(this.props.mark.map.style.fill.color)
        else
          colorScale = d3.scaleLinear()
            .domain(colorDomain)
            .range(this.props.mark.map.style.fill.color)

      //Adding marks

      let geoData = GetMapShape(this.props.mark.map.data, this.props.mark.map.projection, this.props.mark.map.style.scale, this.props.mark.map.style.position, this.props.mark.map.shapeIdentifier);

      let shapes = geoData.map((d, i) => {
        let primitive = `primitive: map; vertices: ${d.vertices}; extrude: ${extrusionScale(data[d['code']]['value'])}`
        if (this.props.mark.map.style.fill.scale)
          return (<a-entity geometry={primitive} material={`color: ${colorScale(data[d['code']]['colorField'])}; metalness: 0.2; opacity:${this.props.mark.map.style.fill.opacity}`} />)
        else
          return (<a-entity geometry={primitive} material={`color: ${this.props.mark.map.style.fill.color}; metalness: 0.2; opacity:${this.props.mark.map.style.fill.opacity}`} />)
      })

      let border;
      if (this.props.mark.map.style.stroke)
        border = geoData.map((d, i) => <a-entity meshline={`lineWidth: ${this.props.mark.map.style.stroke.width}; path:${`${d.vertices.replace(/,/g, ` ${extrusionScale(data[d['code']]['value'])},`)} ${extrusionScale(data[d['code']]['value'])}`}; color:${this.props.mark.map.style.stroke.color}`} />);

      return (
        <a-entity rotation={this.props.mark.map.style.rotation} position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
          {shapes}
          {border}
        </a-entity>
      )
    }
  }
}
export default PrismMap