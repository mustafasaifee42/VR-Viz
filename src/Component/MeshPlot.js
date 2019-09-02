import React, { Component } from 'react';
import * as d3 from 'd3';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import ReadPLY from '../Utils/ReadPLY.js';
import Axis from './Axis.js';
import AxisBox from './AxisBox.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';

class MeshPlot extends Component {
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
          let data = this.props.data.dataFile
          this.setState({
            data: data,
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
      let xDomain, yDomain, zDomain, xDomainTemp;
      if (this.props.mark.position.x) {
        if (this.props.mark.position.x.scaleType === 'linear') {
          if (!this.props.mark.position.x.domain) {
            xDomainTemp = this.state.data.map((d, i) => parseFloat(d[this.props.mark.position.x.field]));
            xDomain = [Math.min(...xDomainTemp), Math.max(...xDomainTemp)];
          } else {
            xDomain = this.props.mark.position.x.domain;
            xDomainTemp = this.props.mark.position.x.domain;
          }

        }
        else{
          xDomain = GetDomain(this.state.data, this.props.mark.position.x.field, this.props.mark.position.x.scaleType, this.props.mark.position.x.startFromZero)
          xDomainTemp = GetDomain(this.state.data, this.props.mark.position.x.field, this.props.mark.position.x.scaleType, this.props.mark.position.x.startFromZero)
        }
      }
      if (this.props.mark.position.z) {
        if (!this.props.mark.position.z.domain) {
          zDomain = [];
          Object.keys(this.state.data[0]).forEach((d,i) => {
            if(d !== this.props.mark.position.x.field){
              zDomain.push(d)
            }
          })
        } 
        else
          zDomain = this.props.mark.position.z.domain
      }

      if (this.props.mark.position.y) {
        if (!this.props.mark.position.y.domain) {
          let min = 9999999999999999, max = -99999999999999999;
          for (let k = 0; k < zDomain.length; k++) {
            for (let i = 0; i < this.state.data.length; i++) {
              if (min > this.state.data[i][zDomain[k]]) {
                min = this.state.data[i][zDomain[k]]
              }
              if (max < this.state.data[i][zDomain[k]])
                max = this.state.data[i][zDomain[k]]
            }
          }
          if (this.props.mark.position.y.startFromZero)
            yDomain = [0, max]
          else
            yDomain = [min, max]
        } else
          yDomain = this.props.mark.position.y.domain
      }
      //Adding Scale
      let zRange = [];
      for (let i = 0; i < zDomain.length; i++) {
        zRange.push(i * this.props.style.dimensions.depth / (zDomain.length - 1))
      }
      let xRange = [];
      for (let i = 0; i < xDomain.length; i++) {
        xRange.push(i * this.props.style.dimensions.width / (xDomain.length - 1))
      }

      let xScale, yScale, zScale, colorScale;

      if (this.props.mark.position.x.scaleType === 'ordinal')
        xScale = d3.scaleOrdinal()
          .range(xRange)
          .domain(xDomain);
      else
        xScale = d3.scaleLinear()
          .range([0, this.props.style.dimensions.width])
          .domain(xDomain);
      yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([0, this.props.style.dimensions.height])

      if (this.props.mark.position.z.scaleType === 'ordinal')
        zScale = d3.scaleOrdinal()
          .domain(zDomain)
          .range(zRange);
      else
        zScale = d3.scaleLinear()
          .domain(zDomain)
          .range([0, this.props.style.dimensions.depth]);


      let dataCoordinate = [];
      //Color Scale

      for (let i = 0; i < this.state.data.length; i++) {
        for (let j = 0; j < zDomain.length; j++) {
          dataCoordinate.push( [ this.state.data[i][this.props.mark.position.x.field] , this.state.data[i][zDomain[j]] , zDomain[j] ] );
        }
      }

      if (this.props.mark.style.fill.scaleType){
        let colorRange = d3.schemeCategory10;
        if (this.props.mark.style.fill.color)
          colorRange = this.props.mark.style.fill.color
        if (this.props.mark.style.fill.domain)
          colorScale = d3.scaleLinear()
            .domain(this.props.mark.style.fill.domain)
            .range(colorRange)
        else
          colorScale = d3.scaleLinear()
            .domain([d3.min(dataCoordinate, d => d[this.props.mark.style.fill.axis]), d3.max(dataCoordinate, d => d[this.props.mark.style.fill.axis])])
            .range(colorRange)
      }
    
      //Data Manipulation
      let dataFormatted1 = [], strokevert = [], faces = [], colorList = [];
      for (let i = 0; i < this.state.data.length - 1; i++) {
        for (let j = 0; j < zDomain.length - 1; j++) {
          let point = {"x": xScale(this.state.data[i][this.props.mark.position.x.field]), "y": yScale(this.state.data[i][zDomain[j]]), "z": zScale(zDomain[j])}
          dataFormatted1.push(point)
          strokevert.push(point)
          let pt1 = dataFormatted1.length - 1;
          point = {"x": xScale(this.state.data[i + 1][this.props.mark.position.x.field]), "y": yScale(this.state.data[i + 1][zDomain[j]]), "z": zScale(zDomain[j])}
          dataFormatted1.push(point)
          strokevert.push(point)
          strokevert.push(point)
          let pt2 = dataFormatted1.length - 1;
          point = {"x": xScale(this.state.data[i + 1][this.props.mark.position.x.field]), "y": yScale(this.state.data[i + 1][zDomain[j + 1]]), "z": zScale(zDomain[j + 1])}
          dataFormatted1.push(point)
          strokevert.push(point)
          strokevert.push(point)
          let pt3 = dataFormatted1.length - 1;
          point = {"x": xScale(this.state.data[i][this.props.mark.position.x.field]), "y": yScale(this.state.data[i][zDomain[j + 1]]), "z": zScale(zDomain[j + 1])}
          dataFormatted1.push(point)
          strokevert.push(point)
          strokevert.push(point)
          point = {"x": xScale(this.state.data[i][this.props.mark.position.x.field]), "y": yScale(this.state.data[i][zDomain[j]]), "z": zScale(zDomain[j])}
          strokevert.push(point)
          let pt4 = dataFormatted1.length - 1;
          faces.push([pt1,pt2,pt3]);
          faces.push([pt1,pt3,pt4]);
          let col1, col2, col3, col4;
          if(this.props.mark.style.fill.scaleType){
            switch(this.props.mark.style.fill.axis) {
              case 0:
                col1 = colorScale(this.state.data[i][this.props.mark.position.x.field]);
                col2 = colorScale(this.state.data[i + 1][this.props.mark.position.x.field]);
                col3 = colorScale(this.state.data[i + 1][this.props.mark.position.x.field]);
                col4 = colorScale(this.state.data[i][this.props.mark.position.x.field]);
                break;
              case 1:
                col1 = colorScale(this.state.data[i][zDomain[j ]]);
                col2 = colorScale(this.state.data[i + 1][zDomain[j]]);
                col3 = colorScale(this.state.data[i + 1][zDomain[j + 1]]);
                col4 = colorScale(this.state.data[i][zDomain[j + 1]]);
                break;
              case 2:
                col1 = colorScale(zDomain[j]);
                col2 = colorScale(zDomain[j]);
                col3 = colorScale(zDomain[j + 1]);
                col4 = colorScale(zDomain[j + 1]);
                break;
              default:
                col1 = colorScale(this.state.data[i][this.props.mark.position.x.field]);
                col2 = colorScale(this.state.data[i + 1][this.props.mark.position.x.field]);
                col3 = colorScale(this.state.data[i + 1][this.props.mark.position.x.field]);
                col4 = colorScale(this.state.data[i][this.props.mark.position.x.field]);
                break;
            }
          } else {
            col1 = this.props.mark.style.fill.color;
            col2 = this.props.mark.style.fill.color;
            col3 = this.props.mark.style.fill.color;
            col4 = this.props.mark.style.fill.color;
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
          domain={yScale.ticks(this.props.yAxis.ticks['noOfTicks'])}
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
        <a-entity click-rotation={`enabled:${clickRotation}`} pivot-center={`xPosition:${this.props.style.origin[0]};yPosition:${this.props.style.origin[1]};zPosition:${this.props.style.origin[2]};pivotX:${this.props.style.xPivot};pivotY:${this.props.style.yPivot};pivotZ:${this.props.style.zPivot}`}  position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation} id={this.props.index}>
          {animation}
          {xAxis}
          {yAxis}
          {zAxis}
          {box}
          <a-frame-mesh-from-points points={points} faces={facesList} stroke_vertices={strokeVertList} stroke_bool={stroke_bool} stroke_color={stroke_color} stroke_width={stroke_width} stroke_opacity={stroke_opacity} color={vertexColor} opacity={this.props.mark.style.fill.opacity} />
          <a-box class='clickable' width={this.props.style.dimensions.width} height={this.props.style.dimensions.height} depth={this.props.style.dimensions.depth} position={`${this.props.style.dimensions.width / 2} ${this.props.style.dimensions.height / 2} ${this.props.style.dimensions.depth / 2}`} opacity ={0}/>
        </a-entity>
      )
    }
  }
}
export default MeshPlot