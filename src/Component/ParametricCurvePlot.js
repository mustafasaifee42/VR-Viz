import React, { Component } from 'react';
import * as d3 from 'd3';
import Axis from './Axis.js';
import AxisBox from './AxisBox.js';


class ParametricCurvePlot extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {

    // Data manipulation

    let dataCoordinate = []
    let yStep = (this.props.parameter.domain[1] - this.props.parameter.domain[0]) / this.props.parameter.steps;
    for (let k = this.props.parameter.domain[0]; k <= this.props.parameter.domain[1]; k = k + yStep) {
      dataCoordinate.push([this.props.mark.position.x.function(k), this.props.mark.position.y.function(k), this.props.mark.position.z.function(k)])
    }

    // Getting domain for axis
    let xDomain, yDomain = this.props.mark.position.y.domain, zDomain;

    //Adding Scale
    let xScale, yScale, zScale;

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

    if (this.props.mark.position.y.domain) {
      yDomain = this.props.mark.position.y.domain
      yScale = d3.scaleLinear()
        .range([0, this.props.style.dimensions.height])
        .domain(this.props.mark.position.y.domain);
    }
    else {
      yDomain = [d3.min(dataCoordinate, d => d[1]), d3.max(dataCoordinate, d => d[1])]
      yScale = d3.scaleLinear()
        .range([0, this.props.style.dimensions.depth])
        .domain([d3.min(dataCoordinate, d => d[1]), d3.max(dataCoordinate, d => d[1])]);
    }

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

    //Adding marks
    let pointList = []

    dataCoordinate.forEach((d , i) => {
      pointList.push({"x":`${xScale(d[0])}`,"y":`${yScale(d[1])}`,"z":`${zScale(d[2])}`})
    })
    let  clickRotation = 'false',animation;
    if(this.props.rotationOnDrag)
      clickRotation = 'true'
    if(this.props.animateRotation){
      clickRotation='false'
      animation  = <a-animation
          attribute="rotation"
          easing="linear"
          dur={`${this.props.animateRotation.duration}`}
          from={this.props.animateRotation.initialAngles}
          to={this.props.animateRotation.finalAngles}
          repeat="indefinite"
        />
    }
    let resolution = 20
    if(this.props.mark.style.resolution){
      resolution = this.props.mark.style.resolution
    }
    return (
      <a-entity click-rotation={`enabled:${clickRotation}`} pivot-center={`xPosition:${this.props.style.origin[0]};yPosition:${this.props.style.origin[1]};zPosition:${this.props.style.origin[2]};pivotX:${this.props.style.xPivot};pivotY:${this.props.style.yPivot};pivotZ:${this.props.style.zPivot}`}  position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation} id={this.props.index}>
        {animation}
        {xAxis}
        {yAxis}
        {zAxis}
        {box}
        <a-frame-curve-line points={JSON.stringify(pointList)} type={this.props.mark.style.curveType} color={this.props.mark.style.color} opacity={this.props.mark.style.opacity} resolution={resolution} />
        <a-box width={this.props.style.dimensions.width} height={this.props.style.dimensions.height} depth={this.props.style.dimensions.depth} position={`${this.props.style.dimensions.width / 2} ${this.props.style.dimensions.height / 2} ${this.props.style.dimensions.depth / 2}`} opacity ={0}/>
      </a-entity>
    )
  }
}

export default ParametricCurvePlot