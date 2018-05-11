import React, { Component } from 'react';
import * as d3 from 'd3';
import Axis from './Axis.js';
import AxisBox from './AxisBox.js';


class SurfacePlot extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {

    // Data manipulation


    let dataCoordinate = [], dataSphere = [];
    let xStep = (this.props.x.domain[1] - this.props.x.domain[0]) / this.props.x.steps;
    let zStep = (this.props.z.domain[1] - this.props.z.domain[0]) / this.props.z.steps;
    for (let i = 0; i < this.props.x.steps - 1; i++) {
      for (let j = 0; j < this.props.z.steps - 1; j++) {
        let tempData = [];
        tempData.push(this.props.x.domain[0] + xStep * i)
        tempData.push(this.props.y.function(this.props.x.domain[0] + xStep * i, this.props.z.domain[0] + zStep * j))
        tempData.push(this.props.z.domain[0] + zStep * j)
        tempData.push(this.props.x.domain[0] + xStep * (i + 1))
        tempData.push(this.props.y.function(this.props.x.domain[0] + xStep * (i + 1), this.props.z.domain[0] + zStep * j))
        tempData.push(this.props.z.domain[0] + zStep * j)
        tempData.push(this.props.x.domain[0] + xStep * (i + 1))
        tempData.push(this.props.y.function(this.props.x.domain[0] + xStep * (i + 1), this.props.z.domain[0] + zStep * (j + 1)))
        tempData.push(this.props.z.domain[0] + zStep * (j + 1))
        tempData.push(this.props.x.domain[0] + xStep * i)
        tempData.push(this.props.y.function(this.props.x.domain[0] + xStep * i, this.props.z.domain[0] + zStep * (j + 1)))
        tempData.push(this.props.z.domain[0] + zStep * (j + 1))
        if (this.props.mark.surface.style.color.function)
          tempData.push(this.props.mark.surface.style.color.function(this.props.x.domain[0] + xStep * i, this.props.z.domain[0] + zStep * j))
        dataCoordinate.push(tempData);
      }
    }
    for (let i = 0; i < this.props.x.steps; i++) {
      for (let j = 0; j < this.props.z.steps; j++) {
        let tempData = [];
        tempData.push(this.props.x.domain[0] + xStep * i)
        tempData.push(this.props.y.function(this.props.x.domain[0] + xStep * i, this.props.z.domain[0] + zStep * j))
        tempData.push(this.props.z.domain[0] + zStep * j);
        dataSphere.push(tempData);
      }
    }


    // Getting domain for axis
    let xDomain = this.props.x.domain, zDomain = this.props.z.domain;

    //Adding Scale
    let xScale, yScale, zScale, colorScale;


    xScale = d3.scaleLinear()
      .range([0, this.props.style.dimensions.width])
      .domain(xDomain);


    if (this.props.y.domain)
      yScale = d3.scaleLinear()
        .domain(this.props.y.domain)
        .range(this.props.y.range)
    else
      yScale = d3.scaleLinear()
        .domain([d3.min(dataSphere, d => d[1]), d3.max(dataSphere, d => d[1])])
        .range(this.props.y.range)


    zScale = d3.scaleLinear()
      .domain(zDomain)
      .range([0, this.props.style.dimensions.depth]);


    if (this.props.mark.surface.style.color.scale)
      if (this.props.mark.surface.style.color.domain)
        colorScale = d3.scaleLinear()
          .domain(this.props.mark.surface.style.color.domain)
          .range(this.props.mark.surface.style.color.fill)
      else
        colorScale = d3.scaleLinear()
          .domain([d3.min(dataCoordinate, d => d[12]), d3.max(dataCoordinate, d => d[12])])
          .range(this.props.mark.surface.style.color.fill)

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
    if (this.props.mark.surface.style.color.function)
      marks = dataCoordinate.map((d, i) => <a-entity key={i} geometry={`primitive: planeFromVertices; vertices: ${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}`} material={`color: ${colorScale(d[12])}; side: double; opacity: ${this.props.mark.surface.style.opacity}`} />);
    else
      marks = dataCoordinate.map((d, i) => <a-entity key={i} geometry={`primitive: planeFromVertices; vertices: ${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}`} material={`color: ${this.props.mark.surface.style.color.fill}; side: double; opacity: ${this.props.mark.surface.style.opacity}`} />);

    return (
      <a-entity position = {`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
        {marks}
        {xAxis}
        {yAxis}
        {zAxis}
        {box}
      </a-entity>
    )
  }
}
export default SurfacePlot