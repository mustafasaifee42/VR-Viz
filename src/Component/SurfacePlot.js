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


    let dataSphere = [];
    let xStep = (this.props.mark.position.x.domain[1] - this.props.mark.position.x.domain[0]) / this.props.mark.position.x.steps;
    let zStep = (this.props.mark.position.z.domain[1] - this.props.mark.position.z.domain[0]) / this.props.mark.position.z.steps;

    for (let i = 0; i < this.props.mark.position.x.steps; i++) {
      for (let j = 0; j < this.props.mark.position.z.steps; j++) {
        let tempData = [];
        tempData.push(this.props.mark.position.x.domain[0] + xStep * i)
        tempData.push(this.props.mark.position.y.function(this.props.mark.position.x.domain[0] + xStep * i, this.props.mark.position.z.domain[0] + zStep * j))
        tempData.push(this.props.mark.position.z.domain[0] + zStep * j);
        if(this.props.mark.style.fill)
          if (this.props.mark.style.fill.function)
            tempData.push(this.props.mark.style.fill.function(this.props.mark.position.x.domain[0] + xStep * i, this.props.mark.position.z.domain[0] + zStep * j))
        dataSphere.push(tempData);
      }
    }


    // Getting domain for axis
    let xDomain = this.props.mark.position.x.domain, zDomain = this.props.mark.position.z.domain, yDomain;

    //Adding Scale
    let xScale, yScale, zScale, colorScale;


    if (this.props.mark.position.y.domain)
      yDomain = this.props.mark.position.y.domain
    else
      yDomain = [d3.min(dataSphere, d => d[1]), d3.max(dataSphere, d => d[1])];

    xScale = d3.scaleLinear()
      .range([0, this.props.style.dimensions.width])
      .domain(xDomain);

    yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([0, this.props.style.dimensions.height])


    zScale = d3.scaleLinear()
      .domain(zDomain)
      .range([0, this.props.style.dimensions.depth]);
    
    
    if(this.props.mark.style.fill){
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
            .domain([d3.min(dataSphere, d => d[3]), d3.max(dataSphere, d => d[3])])
            .range(colorRange)
      }
    }

    
    let dataFormatted1 = [], strokevert = [], faces = [], colorList = [];
    for (let i = 0; i < this.props.mark.position.x.steps - 1; i++) {
      for (let j = 0; j < this.props.mark.position.z.steps - 1; j++) {
        let point = {"x": xScale(this.props.mark.position.x.domain[0] + xStep * i), "y": yScale(this.props.mark.position.y.function(this.props.mark.position.x.domain[0] + xStep * i, this.props.mark.position.z.domain[0] + zStep * j)), "z": zScale(this.props.mark.position.z.domain[0] + zStep * j)}
        dataFormatted1.push(point)
        strokevert.push(point)
        let pt1 = dataFormatted1.length - 1;
        point = {"x": xScale(this.props.mark.position.x.domain[0] + xStep * (i + 1)), "y": yScale(this.props.mark.position.y.function(this.props.mark.position.x.domain[0] + xStep * (i + 1), this.props.mark.position.z.domain[0] + zStep * j)), "z": zScale(this.props.mark.position.z.domain[0] + zStep * j)}
        dataFormatted1.push(point)
        strokevert.push(point)
        strokevert.push(point)
        let pt2 = dataFormatted1.length - 1;
        point = {"x": xScale(this.props.mark.position.x.domain[0] + xStep * (i + 1)), "y": yScale(this.props.mark.position.y.function(this.props.mark.position.x.domain[0] + xStep * (i + 1), this.props.mark.position.z.domain[0] + zStep * (j + 1))), "z": zScale(this.props.mark.position.z.domain[0] + zStep * (j + 1))}
        dataFormatted1.push(point)
        strokevert.push(point)
        strokevert.push(point)
        let pt3 = dataFormatted1.length - 1;
        point = {"x": xScale(this.props.mark.position.x.domain[0] + xStep * i), "y": yScale(this.props.mark.position.y.function(this.props.mark.position.x.domain[0] + xStep * i, this.props.mark.position.z.domain[0] + zStep * (j + 1))), "z": zScale(this.props.mark.position.z.domain[0] + zStep * (j + 1))}
        dataFormatted1.push(point)
        strokevert.push(point)
        strokevert.push(point)
        point = {"x": xScale(this.props.mark.position.x.domain[0] + xStep * i), "y": yScale(this.props.mark.position.y.function(this.props.mark.position.x.domain[0] + xStep * i, this.props.mark.position.z.domain[0] + zStep * j)), "z": zScale(this.props.mark.position.z.domain[0] + zStep * j)}
        strokevert.push(point)
        let pt4 = dataFormatted1.length - 1;
        faces.push([pt1,pt2,pt3]);
        faces.push([pt1,pt3,pt4]);
        let col1, col2, col3, col4;
        if(this.props.mark.style.fill){
          if (this.props.mark.style.fill.function) {
            col1 = colorScale(this.props.mark.style.fill.function(this.props.mark.position.x.domain[0] + xStep * i, this.props.mark.position.z.domain[0] + zStep * j));
            col2 = colorScale(this.props.mark.style.fill.function(this.props.mark.position.x.domain[0] + xStep * (i + 1), this.props.mark.position.z.domain[0] + zStep * j));
            col3 = colorScale(this.props.mark.style.fill.function(this.props.mark.position.x.domain[0] + xStep * (i + 1), this.props.mark.position.z.domain[0] + zStep * (j + 1)));
            col4 = colorScale(this.props.mark.style.fill.function(this.props.mark.position.x.domain[0] + xStep * i, this.props.mark.position.z.domain[0] + zStep * (j + 1)));
          }
          else {
            col1 = this.props.mark.style.fill.color;
            col2 = this.props.mark.style.fill.color;
            col3 = this.props.mark.style.fill.color;
            col4 = this.props.mark.style.fill.color;
          }
        }
        colorList.push([col1,col2,col3]);
        colorList.push([col1,col3,col4]);
      }
    }
    
    let points = JSON.stringify(dataFormatted1)
    let facesList = JSON.stringify(faces)
    let vertexColor = JSON.stringify(colorList)
    let strokeVertList = JSON.stringify(strokevert)


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

    
    let stroke_bool = false, stroke_width = 1, stroke_color = '#000000', stroke_opacity = 1
    if (this.props.mark.style.stroke){
      stroke_bool = true;
      if (this.props.mark.style.stroke.color)
        stroke_color = this.props.mark.style.stroke.color
      if (this.props.mark.style.stroke.opacity)
        stroke_opacity = this.props.mark.style.stroke.opacity
      if (this.props.mark.style.stroke.width)
        stroke_width = this.props.mark.style.stroke.width
    }
    return (
      <a-entity click-rotation={`enabled:${clickRotation}`} pivot-center={`xPosition:${this.props.style.origin[0]};yPosition:${this.props.style.origin[1]};zPosition:${this.props.style.origin[2]};pivotX:${this.props.style.xPivot};pivotY:${this.props.style.yPivot};pivotZ:${this.props.style.zPivot}`}  position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} >
        {animation}
        {xAxis}
        {yAxis}
        {zAxis}
        {box}
        <a-frame-mesh-from-points points={points} faces={facesList} stroke_vertices={strokeVertList} stroke_bool={stroke_bool} stroke_color={stroke_color} stroke_width={stroke_width} stroke_opacity={stroke_opacity} color={vertexColor} opacity={this.props.mark.style.fill.opacity} />
        
      </a-entity>
    )
  }
}
export default SurfacePlot