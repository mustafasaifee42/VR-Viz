import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';

import GetDomain from '../Utils/GetDomain.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';
import ReadPLY from './ReadPLY.js';


class PointCloud extends Component {
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
      // Getting domain for axis
      let colorDomain;

      if (this.props.mark.points.style.fill.scale) {
        if (!this.props.mark.points.style.fill.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.points.style.fill.field, this.props.mark.points.style.fill.type)
        } else
          colorDomain = this.props.mark.points.style.fill.domain
      }

      //Adding Scale

      let colorScale;

      if (this.props.mark.points.style.fill.scale)
        if (this.props.mark.points.style.fill.scaleType === 'ordinal')
          colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(this.props.mark.points.style.fill.color)
        else
          colorScale = d3.scaleLinear()
            .domain(colorDomain)
            .range(this.props.mark.points.style.fill.color)


      //Adding marks
      let marks
      if ((!this.state.data[0].r) || (!this.state.data[0].g) || (!this.state.data[0].r)) {
        if (this.props.mark.points.type === 'sphere') {
          if (!this.props.mark.points.style.fill.scale)
            marks = this.state.data.map((d, i) => <a-sphere key={i} opacity={this.props.mark.points.style.fill.opacity} color={`${this.props.mark.points.style.fill.color}`} radius={this.props.mark.points.style.radius} position={`${d.x * this.props.style.scale} ${d.y * this.props.style.scale} ${d.z * this.props.style.scale}`} />)
          else
            marks = this.state.data.map((d, i) => <a-sphere key={i} opacity={this.props.mark.points.style.fill.opacity} color={`${colorScale(d[this.props.mark.points.style.fill.field])}`} radius={this.props.mark.points.style.radius} position={`${d.x * this.props.style.scale} ${d.y * this.props.style.scale} ${d.z * this.props.style.scale}`} />)
        } else {
          if (!this.props.mark.points.style.fill.scale)
            marks = this.state.data.map((d, i) => <a-box key={i} opacity={this.props.mark.points.style.fill.opacity} color={`${this.props.mark.points.style.fill.color}`} width={this.props.mark.points.style.radius} height={this.props.mark.points.style.radius} depth={this.props.mark.points.style.radius} position={`${d.x * this.props.style.scale} ${d.y * this.props.style.scale} ${d.z * this.props.style.scale}`} />)
          else
            marks = this.state.data.map((d, i) => <a-box key={i} opacity={this.props.mark.points.style.fill.opacity} color={`${colorScale(d[this.props.mark.points.style.fill.field])}`} width={this.props.mark.points.style.radius} height={this.props.mark.points.style.radius} depth={this.props.mark.points.style.radius} position={`${d.x * this.props.style.scale} ${d.y * this.props.style.scale} ${d.z * this.props.style.scale}`} />)
        }
      } else {
        if (this.props.mark.points.type === 'sphere')
          marks = this.state.data.map((d, i) => <a-sphere key={i} opacity={this.props.mark.points.style.fill.opacity} color={`rgb(${d.r},${d.g},${d.b})`} radius={this.props.mark.points.style.radius} position={`${d.x * this.props.style.scale} ${d.y * this.props.style.scale} ${d.z * this.props.style.scale}`} />)
        else
          marks = this.state.data.map((d, i) => <a-box key={i} opacity={this.props.mark.points.style.fill.opacity} color={`rgb(${d.r},${d.g},${d.b})`} width={this.props.mark.points.style.radius} height={this.props.mark.points.style.radius} depth={this.props.mark.points.style.radius} position={`${d.x * this.props.style.scale} ${d.y * this.props.style.scale} ${d.z * this.props.style.scale}`} />)
      }

      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
          {marks}
        </a-entity>
      )
    }
  }
}
export default PointCloud