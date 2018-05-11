import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';
import GetDomain from '../Utils/GetDomain.js';
import Axis from './Axis.js';
import AxisBox from './AxisBox.js';


class ContourPlot extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {

    // Data manipulation

    let dataCoordinate = []
    let yStep = (this.props.y.domain[1] - this.props.y.domain[0]) / this.props.y.steps;
    for (let k = this.props.y.domain[0]; k <= this.props.y.domain[1]; k = k + yStep) {
      dataCoordinate.push([this.props.x.function(k), k, this.props.z.function(k)])
    }

    // Getting domain for axis
    let xDomain, yDomain = this.props.y.domain, zDomain;

    //Adding Scale
    let xScale, yScale, zScale, colorScale;

    if (this.props.x.domain) {
      xDomain = this.props.x.domain
      xScale = d3.scaleLinear()
        .range([0, this.props.style.dimensions.width])
        .domain(this.props.x.domain);
    }
    else {
      xDomain = [0, d3.max(dataCoordinate, d => d[0])]
      xScale = d3.scaleLinear()
        .range([0, this.props.style.dimensions.width])
        .domain([d3.min(dataCoordinate, d => d[0]), d3.max(dataCoordinate, d => d[0])]);
    }

    yScale = d3.scaleLinear()
      .domain(yDomain)
      .range(this.props.y.range)

    if (this.props.z.domain) {
      zDomain = this.props.z.domain
      zScale = d3.scaleLinear()
        .range([0, this.props.style.dimensions.depth])
        .domain(this.props.z.domain);
    }
    else {
      zDomain = [0, d3.max(dataCoordinate, d => d[2])]
      zScale = d3.scaleLinear()
        .range([0, this.props.style.dimensions.depth])
        .domain([d3.min(dataCoordinate, d => d[2]), d3.max(dataCoordinate, d => d[2])]);
    }

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
    let points = dataCoordinate.map((d, i) => <a-curve-point key={i} position={`${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}`} />);

    let curve = <a-curve id={'lineGraph'}>
      {points}
    </a-curve>

    return (
        <a-entity position = {`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
        {xAxis}
        {yAxis}
        {zAxis}
        {box}
        <a-curve id={'lineGraph'}>
          {points}
        </a-curve>
        <a-draw-curve curveref='#lineGraph' material={`shader: line; color: ${this.props.mark.path.style.color}; opacity: ${this.props.mark.path.style.opacity};`} />
      </a-entity>
    )
  }
}

export default ContourPlot