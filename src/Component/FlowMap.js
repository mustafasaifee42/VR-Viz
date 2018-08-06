import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';
import * as THREE from 'three';
import 'aframe-curve-component';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import GetMapShape from '../Utils/GetMapShape';
import GetMapCoordinates from '../Utils/GetMapCoordinates';
import ReadPLY from '../Utils/ReadPLY.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';

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
                if ((this.props.data.fieldDesc[i][1] === 'date') || (this.props.data.fieldDesc[i][1] === 'time'))
                  d[this.props.data.fieldDesc[i][0]] = moment(d[this.props.data.fieldDesc[i][0]], this.props.data.fieldDesc[i][2])['_d']
                if (this.props.data.fieldDesc[i][1] === 'jsonObject')
                  d[this.props.data.fieldDesc[i][0]] = JSON.parse(d[this.props.data.fieldDesc[i][0]])
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
                if ((this.props.data.fieldDesc[i][1] === 'date') || (this.props.data.fieldDesc[i][1] === 'time'))
                  d[this.props.data.fieldDesc[i][0]] = moment(d[this.props.data.fieldDesc[i][0]], this.props.data.fieldDesc[i][2])['_d']
                if (this.props.data.fieldDesc[i][1] === 'jsonObject')
                  d[this.props.data.fieldDesc[i][0]] = JSON.parse(d[this.props.data.fieldDesc[i][0]])
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

      console.log(this.props.mark.flowlines.style.opacity.scaleType)

      if (this.props.mark.flowlines.style.opacity.scaleType) {
        if (!this.props.mark.flowlines.style.opacity.domain) {
          opacityDomain = GetDomain(this.state.data, this.props.mark.flowlines.style.opacity.field, this.props.mark.flowlines.style.opacity.scaleType, this.props.mark.flowlines.style.opacity.startFromZero)
        } else
          opacityDomain = this.props.mark.flowlines.style.opacity.domain
      }

      if (this.props.mark.flowlines.style.stroke.scaleType) {
        if (!this.props.mark.flowlines.style.stroke.color) {
          colorDomain = GetDomain(this.state.data, this.props.mark.flowlines.style.stroke.field, this.props.mark.flowlines.style.stroke.scaleType, this.props.mark.flowlines.style.stroke.startFromZero)
        } else
          colorDomain = this.props.mark.flowlines.style.stroke.color
      }

      //Adding scales

      let colorScale, opacityScale;
      if (this.props.mark.flowlines.style.opacity.scaleType)
        opacityScale = d3.scaleLinear()
          .domain(opacityDomain)
          .range(this.props.mark.flowlines.style.opacity.value)

      if (this.props.mark.flowlines.style.stroke.scaleType) {
        let colorRange = d3.schemeCategory10;
        if (this.props.mark.flowlines.style.stroke.color)
          colorRange = this.props.mark.flowlines.style.stroke.color;
        if (this.props.mark.flowlines.style.stroke.scaleType === 'ordinal')
          colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(colorRange)
        else
          colorScale = d3.scaleLinear()
            .domain(colorDomain)
            .range(colorRange)
      }


      //Drawing Map

      let geoData = GetMapShape(this.props.mark.map.data, this.props.mark.map.projection, this.props.mark.mapScale, this.props.mark.mapOrigin, this.props.mark.map.shapeIdentifier, this.props.mark.map.shapeKey);

      let shapes = geoData.map((d, i) => {
        let primitive = `primitive: map; vertices: ${d.vertices}; extrude: ${this.props.mark.map.style.extrusion.value}`;
        return (<a-entity geometry={primitive} material={`color: ${this.props.mark.map.style.fill.color}; metalness: 0.2; opacity:${this.props.mark.map.style.fill.opacity}`} />)
      })

      let border;
      if (this.props.mark.map.style.stroke)
        border = geoData.map((d, i) => <a-entity meshline={`lineWidth: ${this.props.mark.map.style.stroke.width}; path:${`${d.vertices.replace(/,/g, " 0,")} 0`}; color:${this.props.mark.map.style.stroke.color}`} />);

      //Adding Bars
      let sourceNode, targetNode;

      if (this.props.mark.nodes) {
        if (this.props.mark.nodes.source) {
          sourceNode = this.state.data.map((d, i) => {

            let source_position = GetMapCoordinates(d.source_longitude, d.source_latitude, this.props.mark.map.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);

            source_position[1] = -1 * source_position[1];
            switch (this.props.mark.nodes.source.type) {
              case 'sphere':
                {
                  return <a-sphere key={i} opacity={this.props.mark.nodes.source.style.fill.opacity} color={this.props.mark.nodes.source.style.fill.color} radius={this.props.mark.nodes.source.style.radius.value} position={`${source_position[0]} ${source_position[1]} 0`} />
                }
              case 'box':
                {
                  return <a-box key={i} opacity={this.props.mark.nodes.source.style.fill.opacity} color={this.props.mark.nodes.source.style.fill.color} width={this.props.mark.nodes.source.style.radius.value} height={this.props.mark.nodes.source.style.radius.value} depth={this.props.mark.nodes.source.style.radius.value} position={`${source_position[0]} ${source_position[1]} 0`} />
                }
              default:
                {
                  return <a-sphere key={i} opacity={this.props.mark.nodes.source.style.fill.opacity} color={this.props.mark.nodes.source.style.fill.color} radius={this.props.mark.nodes.source.style.radius.value} position={`${source_position[0]} ${source_position[1]} 0`} />
                }
            }
          })
        }

        if (this.props.mark.nodes.target) {
          targetNode = this.state.data.map((d, i) => {

            let target_position = GetMapCoordinates(d.target_longitude, d.target_latitude, this.props.mark.map.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);

            target_position[1] = -1 * target_position[1];

            switch (this.props.mark.nodes.target.type) {
              case 'sphere':
                {
                  return <a-sphere key={i} opacity={this.props.mark.nodes.target.style.fill.opacity} color={this.props.mark.nodes.target.style.fill.color} radius={this.props.mark.nodes.target.style.radius.value} position={`${target_position[0]} ${target_position[1]} 0`} />
                }
              case 'box':
                {
                  return <a-box key={i} opacity={this.props.mark.nodes.target.style.fill.opacity} color={this.props.mark.nodes.target.style.fill.color} width={this.props.mark.nodes.target.style.radius.value} height={this.props.mark.nodes.target.style.radius.value} depth={this.props.mark.nodes.target.style.radius.value} position={`${target_position[0]} ${target_position[1]} 0`} />
                }
              default:
                {
                  return <a-sphere key={i} opacity={this.props.mark.nodes.target.style.fill.opacity} color={this.props.mark.nodes.target.style.fill.color} radius={this.props.mark.nodes.target.style.radius.value} position={`${target_position[0]} ${target_position[1]} 0`} />
                }
            }
          })
        }
      }

      let curves = this.state.data.map((d, i) => {

        let source_position = GetMapCoordinates(d.source_longitude, d.source_latitude, this.props.mark.map.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);

        source_position[1] = -1 * source_position[1];
        source_position.push(0)

        let target_position = GetMapCoordinates(d.target_longitude, d.target_latitude, this.props.mark.map.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);

        target_position[1] = -1 * target_position[1];
        target_position.push(0)
        let middle_point
        if (this.props.mark.flowlines.style.height) {
          middle_point = [(target_position[0] + source_position[0]) / 2, (target_position[1] + source_position[1]) / 2, d[this.props.mark.flowlines.style.height.field] * this.props.mark.flowlines.style.height.scaleFactor]
        }
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
        if (this.props.mark.flowlines.style.opacity.scaleType) {
          opacity = opacityScale(d[this.props.mark.flowlines.style.opacity.field])
        }

        let color = this.props.mark.flowlines.style.stroke.color;
        if (this.props.mark.flowlines.style.stroke.scaleType) {
          color = colorScale(d[this.props.mark.flowlines.style.stroke.field])
        }

        let flowLine = <a-draw-curve curveref={`#lineGraph${i}`} material={`shader: line; color: ${color}; opacity: ${opacity}`} />

        return flowLine
      })


      let graphTitle
      if (this.props.title) {
        graphTitle = <a-text color={this.props.title.color} wrapCount={this.props.title.wrapCount} lineHeight={this.props.title.lineHeight} width={this.props.title.width} value={this.props.title.value} anchor='align' side='double' align={this.props.title.align} position={this.props.title.position} rotation={this.props.title.rotation} />
      }
      return (
        <a-entity rotation={this.props.mark.rotation} position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} id={this.props.index}>
          {shapes}
          {curves}
          {border}
          {sourceNode}
          {targetNode}
          {flowLines}
          {graphTitle}
        </a-entity>
      )
    }
  }
}
export default FlowMap