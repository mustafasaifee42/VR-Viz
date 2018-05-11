import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';
import * as THREE from 'three';

import GetDomain from '../Utils/GetDomain.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';
import ReadPLY from './ReadPLY.js';

AFRAME.registerGeometry('planeFromVertices', {
  schema: {
    vertices: {
      default: ['-10 10 0', '-10 -10 0', '10 -10 0'],
    }
  },

  init: function (data) {
    var geometry = new THREE.Geometry();
    geometry.vertices = data.vertices.map(function (vertex) {
      var points = vertex.split(' ').map(function (x) { return parseFloat(x); });
      return new THREE.Vector3(points[0], points[1], points[2]);
    });
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(0, 2, 3));
    this.geometry = geometry;
  }
});

class ContourMap extends Component {
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

      let dataFormatted = []
      for (let i = 0; i < this.state.data.length - 1; i++) {
        for (let k = 0; k < this.state.data[i].length - 1; k++) {
          dataFormatted.push([]);
          dataFormatted[dataFormatted.length - 1].push(i)
          dataFormatted[dataFormatted.length - 1].push(this.state.data[i][k])
          dataFormatted[dataFormatted.length - 1].push(k)
          dataFormatted[dataFormatted.length - 1].push(i + 1)
          dataFormatted[dataFormatted.length - 1].push(this.state.data[i + 1][k])
          dataFormatted[dataFormatted.length - 1].push(k)
          dataFormatted[dataFormatted.length - 1].push(i + 1)
          dataFormatted[dataFormatted.length - 1].push(this.state.data[i + 1][k + 1])
          dataFormatted[dataFormatted.length - 1].push(k + 1)
          dataFormatted[dataFormatted.length - 1].push(i)
          dataFormatted[dataFormatted.length - 1].push(this.state.data[i][k + 1])
          dataFormatted[dataFormatted.length - 1].push(k + 1)
        }
      }

      // Getting domain
      let colorDomain;

      if (this.props.mark.style.color.scale) {
        if (!this.props.mark.style.color.domain) {
          colorDomain = [d3.min(dataFormatted, d => d[1]), d3.max(dataFormatted, d => d[1])]
        } else
          colorDomain = this.props.mark.style.color.domain
      }

      //Adding scales

      let colorScale;

      if (this.props.mark.style.color.scale)
        colorScale = d3.scaleLinear()
          .domain(colorDomain)
          .range(this.props.mark.style.color.fill)


      //Drawing Contour

      let shapes = dataFormatted.map((d, i) => {
        let color = this.props.mark.style.color.fill;
        if (this.props.mark.style.color.scale)
          color = colorScale(d[1])
        return (<a-entity geometry={`primitive: planeFromVertices; vertices: ${d[0] * this.props.mark.style.scale.ground} ${(d[1] - this.props.heightThreshold) * this.props.mark.style.scale.height} ${d[2] * this.props.mark.style.scale.ground}, ${d[3] * this.props.mark.style.scale.ground} ${(d[4] - this.props.heightThreshold) * this.props.mark.style.scale.height} ${d[5] * this.props.mark.style.scale.ground}, ${d[6] * this.props.mark.style.scale.ground} ${(d[7] - this.props.heightThreshold) * this.props.mark.style.scale.height} ${d[8] * this.props.mark.style.scale.ground}, ${d[9] * this.props.mark.style.scale.ground} ${(d[10] - this.props.heightThreshold) * this.props.mark.style.scale.height} ${d[11] * this.props.mark.style.scale.ground}`} material={`color: ${color}; side: double; opacity:${this.props.mark.style.opacity}`} />)
      })

      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
          {shapes}
        </a-entity>
      )
    }
  }
}
export default ContourMap