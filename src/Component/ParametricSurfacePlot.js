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
    let parameterStep1 = (this.props.parameter.parameter1.domain[1] - this.props.parameter.parameter1.domain[0]) / this.props.parameter.parameter1.steps;
    let parameterStep2 = (this.props.parameter.parameter2.domain[1] - this.props.parameter.parameter2.domain[0]) / this.props.parameter.parameter2.steps;
    for (let i = this.props.parameter.parameter1.domain[0]; i <= this.props.parameter.parameter1.domain[1]; i = i + parameterStep1) {
      for (let j = this.props.parameter.parameter2.domain[0]; j <= this.props.parameter.parameter2.domain[1]; j = j + parameterStep2) {
        let tempData = [];
        tempData.push(this.props.x.function(i, j));
        tempData.push(this.props.y.function(i, j));
        tempData.push(this.props.z.function(i, j));
        tempData.push(this.props.x.function(i + parameterStep1, j));
        tempData.push(this.props.y.function(i + parameterStep1, j));
        tempData.push(this.props.z.function(i + parameterStep1, j));
        tempData.push(this.props.x.function(i + parameterStep1, j + parameterStep2));
        tempData.push(this.props.y.function(i + parameterStep1, j + parameterStep2));
        tempData.push(this.props.z.function(i + parameterStep1, j + parameterStep2));
        tempData.push(this.props.x.function(i, j + parameterStep2));
        tempData.push(this.props.y.function(i, j + parameterStep2));
        tempData.push(this.props.z.function(i, j + parameterStep2));
        if (this.props.mark.surface.style.fill.function)
          tempData.push(this.props.mark.surface.style.fill.function(i, j))
        dataCoordinate.push(tempData);
      }
    }

    for (let i = this.props.parameter.parameter1.domain[0]; i <= this.props.parameter.parameter1.domain[1]; i = i + parameterStep1) {
      for (let j = this.props.parameter.parameter2.domain[0]; j <= this.props.parameter.parameter2.domain[1]; j = j + parameterStep2) {
        let tempData = [];
        tempData.push(this.props.x.function(i, j))
        tempData.push(this.props.y.function(i, j))
        tempData.push(this.props.z.function(i, j))
        dataSphere.push(tempData);
      }
    }


    // Getting domain for axis
    let xDomain = this.props.x.domain, zDomain = this.props.z.domain;

    //Adding Scale
    let xScale, yScale, zScale, colorScale;


    if (this.props.x.domain)
      xScale = d3.scaleLinear()
        .domain(this.props.x.domain)
        .range([0, this.props.style.dimensions.height]);
    else
      xScale = d3.scaleLinear()
        .domain([d3.min(dataSphere, d => d[0]), d3.max(dataSphere, d => d[0])])
        .range([0, this.props.style.dimensions.width]);

    if (this.props.y.domain)
      yScale = d3.scaleLinear()
        .domain(this.props.y.domain)
        .range([0, this.props.style.dimensions.height]);
    else
      yScale = d3.scaleLinear()
        .domain([d3.min(dataSphere, d => d[1]), d3.max(dataSphere, d => d[1])])
        .range([0, this.props.style.dimensions.height]);

    if (this.props.z.domain)
      zScale = d3.scaleLinear()
        .domain(this.props.z.domain)
        .range([0, this.props.style.dimensions.depth]);
    else
      zScale = d3.scaleLinear()
        .domain([d3.min(dataSphere, d => d[2]), d3.max(dataSphere, d => d[2])])
        .range([0, this.props.style.dimensions.depth]);


    if (this.props.mark.surface.style.fill.scale)
      if (this.props.mark.surface.style.fill.domain)
        colorScale = d3.scaleLinear()
          .domain(this.props.mark.surface.style.fill.domain)
          .range(this.props.mark.surface.style.fill.color)
      else
        colorScale = d3.scaleLinear()
          .domain([d3.min(dataCoordinate, d => d[12]), d3.max(dataCoordinate, d => d[12])])
          .range(this.props.mark.surface.style.fill.color)

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
    if (this.props.mark.surface.style.fill.function)
      marks = dataCoordinate.map((d, i) => <a-entity key={i} geometry={`primitive: planeFromVertices; vertices: ${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}`} material={`color: ${colorScale(d[12])}; side: double; opacity: ${this.props.mark.surface.style.fill.opacity}`} />);
    else
      marks = dataCoordinate.map((d, i) => <a-entity key={i} geometry={`primitive: planeFromVertices; vertices: ${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}`} material={`color: ${this.props.mark.surface.style.fill.color}; side: double; opacity: ${this.props.mark.surface.style.fill.opacity}`} />);

    let border;
    if (this.props.mark.surface.style.stroke)
      border = dataCoordinate.map((d, i) => <a-entity meshline={`lineWidth: ${this.props.mark.surface.style.stroke.width}; path:${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}; color:${this.props.mark.surface.style.stroke.color}`} />);

    return (
      <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
        {marks}
        {border}
        {xAxis}
        {yAxis}
        {zAxis}
        {box}
      </a-entity>
    )
  }
}
export default SurfacePlot