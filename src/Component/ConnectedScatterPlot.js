import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import 'aframe-curve-component';
import * as d3 from 'd3';

import GetDomain from '../Utils/GetDomain.js';
import Axis from './Axis.js';
import AxisBox from './AxisBox.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';
import ReadPLY from './ReadPLY.js';


class ConnectedScatterPlot extends Component {
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
    if (!this.state.data)
      return (<a-entity />)
    // Getting domain for axis
    else {
      let xDomain, yDomain, zDomain, colorDomain, radiusDomain;

      if (!this.props.x.domain)
        xDomain = GetDomain(this.state.data, this.props.x.field, this.props.x.type)
      else
        xDomain = this.props.x.domain

      if (!this.props.y.domain)
        yDomain = GetDomain(this.state.data, this.props.y.field, this.props.y.type)
      else
        yDomain = this.props.y.domain

      if (!this.props.z.domain)
        zDomain = GetDomain(this.state.data, this.props.z.field, this.props.z.type)
      else
        zDomain = this.props.z.domain


      if (this.props.mark.points.style.fill.scale) {
        if (!this.props.mark.points.style.fill.domain)
          colorDomain = GetDomain(this.state.data, this.props.mark.points.style.fill.field, this.props.mark.points.style.fill.type)
        else
          colorDomain = this.props.mark.points.style.fill.domain
      }

      if (this.props.mark.points.style.radius.scale) {
        if (!this.props.mark.points.style.radius.domain) {
          radiusDomain = [d3.min(this.state.data, d => d[this.props.mark.points.style.radius.field]), d3.max(this.state.data, d => d[this.props.mark.points.style.radius.field])]
        } else
          radiusDomain = this.props.mark.style.radius.domain
      }


      //Adding scales

      let xScale, yScale, zScale, colorScale, scale;

      if (this.props.x.range)
        xScale = d3.scaleLinear()
          .domain(xDomain)
          .range(this.props.x.range)
      else
        xScale = d3.scaleLinear()
          .domain(xDomain)
          .range([0, this.props.style.dimensions.width])

      if (this.props.y.range)
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range(this.props.y.range)
      else
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range([0, this.props.style.dimensions.height])

      if (this.props.z.range)
        zScale = d3.scaleLinear()
          .domain(zDomain)
          .range(this.props.z.range)
      else
        zScale = d3.scaleLinear()
          .domain(zDomain)
          .range([0, this.props.style.dimensions.depth])

      if (this.props.mark.points.style.fill.scale)
        if (this.props.mark.points.style.fill.type === 'ordinal')
          colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(this.props.mark.points.style.fill.color)
        else
          colorScale = d3.scaleLinear()
            .domain(colorDomain)
            .range(this.props.mark.points.style.fill.color)


      if (this.props.mark.points.style.radius.scale)
        scale = d3.scaleLinear()
          .domain(radiusDomain)
          .range(this.props.mark.points.style.radius.value)
      else
        scale = d3.scaleLinear()
          .domain([0, 1])
          .range([this.props.mark.points.style.radius.value, this.props.mark.points.style.radius.value])

      //Axis
      let xAxis, yAxis, zAxis;

      if (this.props.x.axis.axis) {
        xAxis = <Axis
          tickValues={xScale.ticks(this.props.x.axis.ticks['no-of-ticks'])}
          tick={this.props.x.axis.ticks}
          scale={xScale}
          axis={'x'}
          orient={this.props.x.axis.orient}
          title={this.props.x.axis.title}
          dimensions={this.props.style.dimensions}
        />
      } else
        xAxis = <a-entity />

      if (this.props.y.axis.axis) {
        yAxis = <Axis
          tickValues={yScale.ticks(this.props.y.axis.ticks['no-of-ticks'])}
          tick={this.props.y.axis.ticks}
          scale={yScale}
          axis={'y'}
          orient={this.props.y.axis.orient}
          title={this.props.y.axis.title}
          dimensions={this.props.style.dimensions}
        />
      } else
        yAxis = <a-entity />

      if (this.props.z.axis.axis) {
        zAxis = <Axis
          tickValues={zScale.ticks(this.props.z.axis.ticks['no-of-ticks'])}
          tick={this.props.z.axis.ticks}
          scale={zScale}
          axis={'z'}
          orient={this.props.z.axis.orient}
          title={this.props.z.axis.title}
          dimensions={this.props.style.dimensions}
        />

      } else
        zAxis = <a-entity />


      let box;
      if (this.props.style['axis-box']) {
        box = <AxisBox
          width={this.props.style.dimensions.width}
          height={this.props.style.dimensions.height}
          depth={this.props.style.dimensions.depth}
          color={this.props.style['axis-box-color']}
        />
      } else {
        box = <a-entity />
      }


      //Adding marks
      let marks;
      switch (this.props.mark.points.type) {
        case 'box':
          {
            marks = this.state.data.map((d, i) => {
              if (this.props.mark.points.style.fill.scale) {
                if (this.props.mark.points.style.radius.scale)
                  return <a-box key={i} color={`${colorScale(d[this.props.mark.points.style.fill.field])}`} opacity={this.props.mark.points.style.opacity} depth={`${scale(d[this.props.mark.points.style.radius.field])}`} height={`${scale(d[this.props.mark.points.style.radius.field])}`} width={`${scale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-box key={i} color={`${colorScale(d[this.props.mark.points.style.fill.field])}`} opacity={this.props.mark.points.style.opacity} depth={this.props.mark.points.style.radius.value} height={this.props.mark.points.style.radius.value} width={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              } else {
                if (this.props.mark.points.style.radius.scale)
                  return <a-box key={i} color={`${this.props.mark.points.style.fill.color}`} opacity={this.props.mark.points.style.opacity} depth={`${scale(d[this.props.mark.points.style.radius.field])}`} height={`${scale(d[this.props.mark.points.style.radius.field])}`} width={`${scale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-box key={i} color={`${this.props.mark.points.style.fill.color}`} opacity={this.props.mark.points.style.opacity} depth={this.props.mark.points.style.radius.value} height={this.props.mark.points.style.radius.value} width={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              }
            });
            break;
          }
        case 'sphere':
          {
            marks = this.state.data.map((d, i) => {
              if (this.props.mark.points.style.fill.scale) {
                if (this.props.mark.points.style.radius.scale)
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${colorScale(d[this.props.mark.points.style.fill.field])}`} radius={`${scale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${colorScale(d[this.props.mark.points.style.fill.field])}`} radius={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              } else {
                if (this.props.mark.points.style.radius.scale)
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${this.props.mark.points.style.fill.color}`} radius={`${scale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${this.props.mark.points.style.fill.color}`} radius={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              }
            });
            break;
          }
        default:
          {
            marks = this.state.data.map((d, i) => {
              if (this.props.mark.points.style.fill.scale) {
                if (this.props.mark.points.style.radius.scale)
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${colorScale(d[this.props.mark.points.style.fill.field])}`} radius={`${scale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${colorScale(d[this.props.mark.points.style.fill.field])}`} radius={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              } else {
                if (this.props.mark.points.style.radius.scale)
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${this.props.mark.points.style.fill.color}`} radius={`${scale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${this.props.mark.points.style.fill.color}`} radius={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              }
            });
            break;
          }
      }

      let labels;
      if (this.props.mark.label) {
        if (this.props.mark.points.style.radius.scale)
          labels = this.state.data.map((d, i) => <a-text key={i} opacity={this.props.mark.label.style.opacity} color={this.props.mark.label.style.color} width={this.props.mark.label.style.size} value={`${d[this.props.mark.label.field]}`} anchor='align' side='double' side='double' align='left' position={`${xScale(d[this.props.x.field]) + 0.05 + scale(d[this.props.mark.points.style.radius.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />);
        else
          labels = this.state.data.map((d, i) => <a-text key={i} opacity={this.props.mark.label.style.opacity} color={this.props.mark.label.style.color} width={this.props.mark.label.style.size} value={`${d[this.props.mark.label.field]}`} anchor='align' side='double' side='double' align='left' position={`${xScale(d[this.props.x.field]) + 0.05 + this.props.mark.points.style.radius.value} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />);
      }

      let points = this.state.data.map((d, i) => <a-curve-point key={i} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />);

      let curve = <a-curve id={'lineGraph'}>
        {points}
      </a-curve>

      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
          {marks}
          {labels}
          <a-curve id={'lineGraph'}>
            {points}
          </a-curve>
          <a-draw-curve curveref='#lineGraph' material={`shader: line; color: ${this.props.mark.line.style.stroke.color}; opacity: ${this.props.mark.line.style.opacity}`} />
          {xAxis}
          {yAxis}
          {zAxis}
          {box}
        </a-entity>
      )
    }
  }
}
export default ConnectedScatterPlot