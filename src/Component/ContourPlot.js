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
    let yStep = (this.props.mark.position.y.domain[1] - this.props.mark.position.y.domain[0]) / this.props.mark.position.y.steps;
    for (let k = this.props.mark.position.y.domain[0]; k <= this.props.mark.position.y.domain[1]; k = k + yStep) {
      dataCoordinate.push([this.props.mark.position.x.function(k), k, this.props.mark.position.z.function(k)])
    }

    // Getting domain for axis
    let xDomain, yDomain = this.props.mark.position.y.domain, zDomain;

    //Adding Scale
    let xScale, yScale, zScale, colorScale;

    if (this.props.mark.position.x.domain) {
      xDomain = this.props.mark.position.x.domain
      xScale = d3.scaleLinear()
        .range([0, this.props.style.dimensions.width])
        .domain(this.props.mark.position.x.domain);
    }
    else {
      xDomain = [0, d3.max(dataCoordinate, d => d[0])]
      xScale = d3.scaleLinear()
        .range([0, this.props.style.dimensions.width])
        .domain([d3.min(dataCoordinate, d => d[0]), d3.max(dataCoordinate, d => d[0])]);
    }

    yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([0, this.props.style.dimensions.height])

    if (this.props.mark.position.z.domain) {
      zDomain = this.props.mark.position.z.domain
      zScale = d3.scaleLinear()
        .range([0, this.props.style.dimensions.depth])
        .domain(this.props.mark.position.z.domain);
    }
    else {
      zDomain = [0, d3.max(dataCoordinate, d => d[2])]
      zScale = d3.scaleLinear()
        .range([0, this.props.style.dimensions.depth])
        .domain([d3.min(dataCoordinate, d => d[2]), d3.max(dataCoordinate, d => d[2])]);
    }

    //Axis
    let xAxis, yAxis, zAxis;

    if (this.props.xAxis) {
      xAxis = <Axis
        domain={xDomain}
        tick={this.props.xAxis.ticks}
        scale={xScale}
        axis={'x'}
        orient={this.props.xAxis.orient}
        title={this.props.xAxis.title}
        dimensions={this.props.style.dimensions}
        scaleType={this.props.mark.position.x.scaleType}
        grid={this.props.xAxis.grid}
      />
    }

    if (this.props.yAxis) {
      yAxis = <Axis
        domain={yDomain}
        tick={this.props.yAxis.ticks}
        scale={yScale}
        axis={'y'}
        orient={this.props.yAxis.orient}
        title={this.props.yAxis.title}
        dimensions={this.props.style.dimensions}
        scaleType={this.props.mark.position.y.scaleType}
        grid={this.props.yAxis.grid}
      />
    }

    if (this.props.zAxis) {
      zAxis = <Axis
        domain={zDomain}
        tick={this.props.zAxis.ticks}
        scale={zScale}
        axis={'z'}
        orient={this.props.zAxis.orient}
        title={this.props.zAxis.title}
        dimensions={this.props.style.dimensions}
        scaleType={this.props.mark.position.z.scaleType}
        grid={this.props.zAxis.grid}
      />

    }


    let box;
    if (this.props.axisBox) {
      box = <AxisBox
        width={this.props.style.dimensions.width}
        height={this.props.style.dimensions.height}
        depth={this.props.style.dimensions.depth}
        color={this.props.axisBox.color}
      />
    }



    let graphTitle
    if (this.props.title) {
      graphTitle = <a-text color={this.props.title.color} wrapCount={this.props.title.wrapCount} lineHeight={this.props.title.lineHeight} width={this.props.title.width} value={this.props.title.value} anchor='align' side='double' align={this.props.title.align} position={this.props.title.position} rotation={this.props.title.rotation} />
    }

    //Adding marks
    let points = dataCoordinate.map((d, i) => <a-curve-point key={i} position={`${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}`} />);

    let curve = <a-curve id={'lineGraph'}>
      {points}
    </a-curve>

    return (
      <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation} id={this.props.index}>
        {xAxis}
        {yAxis}
        {zAxis}
        {graphTitle}
        {box}
        <a-curve id={'lineGraph'}>
          {points}
        </a-curve>
        <a-draw-curve curveref='#lineGraph' material={`shader: line; color: ${this.props.mark.style.color}; opacity: ${this.props.mark.style.opacity};`} />
      </a-entity>
    )
  }
}

export default ContourPlot