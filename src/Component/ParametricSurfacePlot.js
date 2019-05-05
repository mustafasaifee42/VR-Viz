import React, { Component } from 'react';
import * as d3 from 'd3';
import Axis from './Axis.js';
import AxisBox from './AxisBox.js';


class ParametricSurfacePlot extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  startAnimation = () => {
      d3.select(`#${this.props.index}`)
        .transition()
        .duration(this.props.animateRotation.duration)
        .ease(d3.easeLinear)
        .attrTween("rotation", () => d3.interpolate(`${this.props.animateRotation.initialAngles[0]} ${this.props.animateRotation.initialAngles[1]} ${this.props.animateRotation.initialAngles[2]}`, `${this.props.animateRotation.finalAngles[0]} ${this.props.animateRotation.finalAngles[1]} ${this.props.animateRotation.finalAngles[2]}`));
  }
  componentWillMount(){
    if(this.props.animateRotation) {
      this.startAnimation();
      window.setInterval(this.startAnimation, this.props.animateRotation.duration);
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
        tempData.push(this.props.mark.position.x.function(i, j));
        tempData.push(this.props.mark.position.y.function(i, j));
        tempData.push(this.props.mark.position.z.function(i, j));
        tempData.push(this.props.mark.position.x.function(i + parameterStep1, j));
        tempData.push(this.props.mark.position.y.function(i + parameterStep1, j));
        tempData.push(this.props.mark.position.z.function(i + parameterStep1, j));
        tempData.push(this.props.mark.position.x.function(i + parameterStep1, j + parameterStep2));
        tempData.push(this.props.mark.position.y.function(i + parameterStep1, j + parameterStep2));
        tempData.push(this.props.mark.position.z.function(i + parameterStep1, j + parameterStep2));
        tempData.push(this.props.mark.position.x.function(i, j + parameterStep2));
        tempData.push(this.props.mark.position.y.function(i, j + parameterStep2));
        tempData.push(this.props.mark.position.z.function(i, j + parameterStep2));
        if(this.props.mark.style.fill)
          if (this.props.mark.style.fill.function)
            tempData.push(this.props.mark.style.fill.function(i, j))
        dataCoordinate.push(tempData);
      }
    }

    for (let i = this.props.parameter.parameter1.domain[0]; i <= this.props.parameter.parameter1.domain[1]; i = i + parameterStep1) {
      for (let j = this.props.parameter.parameter2.domain[0]; j <= this.props.parameter.parameter2.domain[1]; j = j + parameterStep2) {
        let tempData = [];
        tempData.push(this.props.mark.position.x.function(i, j))
        tempData.push(this.props.mark.position.y.function(i, j))
        tempData.push(this.props.mark.position.z.function(i, j))
        dataSphere.push(tempData);
      }
    }


    // Getting domain for axis
    let xDomain = this.props.mark.position.x.domain, zDomain = this.props.mark.position.z.domain, yDomain;

    //Adding Scale
    let xScale, yScale, zScale, colorScale;

    if (this.props.mark.position.x.domain)
      xScale = d3.scaleLinear()
        .domain(this.props.mark.position.x.domain)
        .range([0, this.props.style.dimensions.height]);
    else {
      xScale = d3.scaleLinear()
        .domain([d3.min(dataSphere, d => d[0]), d3.max(dataSphere, d => d[0])])
        .range([0, this.props.style.dimensions.width]);
    }

    if (this.props.mark.position.y.domain) {
      yDomain = this.props.mark.position.y.domain
      yScale = d3.scaleLinear()
        .domain(this.props.mark.position.y.domain)
        .range([0, this.props.style.dimensions.height]);
    }
    else {
      yDomain = [d3.min(dataSphere, d => d[1]), d3.max(dataSphere, d => d[1])]
      yScale = d3.scaleLinear()
        .domain([d3.min(dataSphere, d => d[1]), d3.max(dataSphere, d => d[1])])
        .range([0, this.props.style.dimensions.height]);
    }

    if (this.props.mark.position.z.domain)
      zScale = d3.scaleLinear()
        .domain(this.props.mark.position.z.domain)
        .range([0, this.props.style.dimensions.depth]);
    else
      zScale = d3.scaleLinear()
        .domain([d3.min(dataSphere, d => d[2]), d3.max(dataSphere, d => d[2])])
        .range([0, this.props.style.dimensions.depth]);

    if(this.props.mark.style.fill)
      if (this.props.mark.style.fill.scaleType) {
        let colorRange = d3.schemeCategory10;
        if (this.props.mark.style.fill.color)
          colorRange = this.props.mark.style.fill.color;
        if (this.props.mark.style.fill.domain)
          colorScale = d3.scaleLinear()
            .domain(this.props.mark.style.fill.domain)
            .range(colorRange)
        else
          colorScale = d3.scaleLinear()
            .domain([d3.min(dataCoordinate, d => d[12]), d3.max(dataCoordinate, d => d[12])])
            .range(colorRange)
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

    //Adding marks
    let marks;
    if (this.props.mark.style.stroke){
      if(this.props.mark.style.fill) {
        if (this.props.mark.style.fill.function)
          marks = dataCoordinate.map((d, i) => <a-entity key={`${i}`} plane-from-vertices={`path:${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}, ${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])};face:true;faceColor: ${colorScale(d[12])};faceOpacity: ${this.props.mark.style.fill.opacity};stroke:true;strokeWidth:${this.props.mark.style.stroke.width};strokeColor:${this.props.mark.style.stroke.color}`} />);
        else
          marks = dataCoordinate.map((d, i) => <a-entity key={`${i}`} plane-from-vertices={`path:${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}, ${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])};face:true;faceColor: ${this.props.mark.style.fill.color};faceOpacity: ${this.props.mark.style.fill.opacity};stroke:true;strokeWidth:${this.props.mark.style.stroke.width};strokeColor:${this.props.mark.style.stroke.color}`} />);
      }
      else
        marks = dataCoordinate.map((d, i) => <a-entity key={`${i}`} plane-from-vertices={`path:${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}, ${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])};face:false;stroke:true;strokeWidth:${this.props.mark.style.stroke.width};strokeColor:${this.props.mark.style.stroke.color}`} />);
    }
    else {
      if (this.props.mark.style.fill.function)
        marks = dataCoordinate.map((d, i) => <a-entity key={`${i}`} plane-from-vertices={`path:${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}, ${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])};face:true;faceColor: ${colorScale(d[12])};faceOpacity: ${this.props.mark.style.fill.opacity};stroke:false`} />);
      else
        marks = dataCoordinate.map((d, i) => <a-entity key={`${i}`} plane-from-vertices={`path:${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}, ${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])};face:true;faceColor: ${this.props.mark.style.fill.color};faceOpacity: ${this.props.mark.style.fill.opacity};stroke:false`} />);
    }
    let graphTitle
    if (this.props.title) {
      graphTitle = <a-text color={this.props.title.color} wrapCount={this.props.title.wrapCount} lineHeight={this.props.title.lineHeight} width={this.props.title.width} value={this.props.title.value} anchor='align' side='double' align={this.props.title.align} position={this.props.title.position} rotation={this.props.title.rotation} billboard={this.props.title.billboarding}/>
    }
    let pivot
    if(this.props.style.pivot)
      pivot = this.props.style.pivot;
    else
      pivot = `0 0 0`
    return (
      <a-entity pivot={pivot} position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation} id={this.props.index}>
        {marks}
        {xAxis}
        {yAxis}
        {zAxis}
        {graphTitle}
        {box}
      </a-entity>
    )
  }
}
export default ParametricSurfacePlot