import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';
import * as THREE from 'three';
import 'aframe-curve-component';

import GetDomain from '../Utils/GetDomain.js';
import GetMapShape from '../Utils/GetMapShape';
import GetMapCoordinates from '../Utils/GetMapCoordinates';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';
import ReadPLY from './ReadPLY.js';

class FlowMap extends Component {
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

      // Getting domain

      let colorDomain, opacityDomain;

      if (this.props.mark.flowlines.style.opacity.scale) {
        if (!this.props.mark.flowlines.style.opacity.domain) {
          opacityDomain = GetDomain(this.state.data, this.props.mark.flowlines.style.opacity.field, this.props.mark.flowlines.style.opacity.type)
        } else
          opacityDomain = this.props.mark.flowlines.style.opacity.domain
      }

      if (this.props.mark.flowlines.style.color.scale) {
        if (!this.props.mark.flowlines.style.color.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.flowlines.style.color.field, this.props.mark.flowlines.style.color.type)
        } else
          colorDomain = this.props.mark.flowlines.style.color.fill
      }

      //Adding scales

      let colorScale, opacityScale;

      if (this.props.mark.flowlines.style.opacity.scale)
        opacityScale = d3.scaleLinear()
          .domain(opacityDomain)
          .range(this.props.mark.flowlines.style.opacity.value)

      if (this.props.mark.flowlines.style.color.scale)
        if (this.props.mark.flowlines.style.color.scaleType === 'ordinal')
          colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(this.props.mark.flowlines.style.color.fill)
        else
          colorScale = d3.scaleLinear()
            .domain(colorDomain)
            .range(this.props.mark.flowlines.style.color.fill)


      //Drawing Map

      let geoData = GetMapShape(this.props.mark.map.data, this.props.mark.map.projection, this.props.mark.map.style.scale, this.props.mark.map.style.position, this.props.mark.map.shapeIdentifier);

      let shapes = geoData.map((d, i) => {
        console.log(d.vertices)
        let primitive = `primitive: map; vertices: ${d.vertices}; extrude: ${this.props.mark.map.style.extrusion.value}`;
        return (<a-entity geometry={primitive} material={`color: ${this.props.mark.map.style.fill.color}; metalness: 0.2; opacity:${this.props.mark.map.style.fill.opacity}`} />)
      })

      let border;
      if (this.props.mark.map.style.stroke)
        border = geoData.map((d, i) => <a-entity meshline={`lineWidth: ${this.props.mark.map.style.stroke.width}; path:${`${d.vertices.replace(/,/g, " 0,")} 0`}; color:${this.props.mark.map.style.stroke.color}`} />);

      //Adding Bars

      let curves = this.state.data.map((d, i) => {

        let source_position = GetMapCoordinates(d.source_longitude, d.source_latitude, this.props.mark.map.projection, this.props.mark.map.style.scale, this.props.mark.map.style.position);

        source_position[1] = -1 * source_position[1];
        source_position.push(0)

        let target_position = GetMapCoordinates(d.target_longitude, d.target_latitude, this.props.mark.map.projection, this.props.mark.map.style.scale, this.props.mark.map.style.position);

        target_position[1] = -1 * target_position[1];
        target_position.push(0)

        let middle_point
        if (this.props.height)
          middle_point = [(target_position[0] + source_position[0]) / 2, (target_position[1] + source_position[1]) / 2, d[this.props.height.field] * this.props.height.scale]
        else {
          let distance = Math.sqrt((target_position[0] - source_position[0]) * (target_position[0] - source_position[0]) + (target_position[1] - source_position[1]) * (target_position[1] - source_position[1]))
          middle_point = [(target_position[0] + source_position[0]) / 2, (target_position[1] + source_position[1]) / 2, distance / 4]
        }

        let pointsData = [source_position, middle_point, target_position]
        let points = pointsData.map((d, i) => <a-curve-point key={i} position={`${d[0]} ${d[1]} ${d[2]}`} />);

        let curve = <a-curve id={`lineGraph${i}`}>
          {points}
        </a-curve>

        return curve

      });

      let flowLines = this.state.data.map((d, i) => {
        let opacity = this.props.mark.flowlines.style.opacity.value;
        if (this.props.mark.flowlines.style.opacity.scale) {
          opacity = opacityScale(d[this.props.mark.flowlines.style.opacity.field])
        }

        let color = this.props.mark.flowlines.style.color.fill;
        if (this.props.mark.flowlines.style.color.scale) {
          color = colorScale(d[this.props.mark.flowlines.style.color.field])
        }

        let flowLine = <a-draw-curve curveref={`#lineGraph${i}`} material={`shader: line; color: ${color}; opacity: ${opacity}`} />

        return flowLine
      })

      return (
        <a-entity rotation={this.props.mark.map.style.rotation} position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
          {shapes}
          {curves}
          {border}
          {flowLines}
        </a-entity>
      )
    }
  }
}
export default FlowMap