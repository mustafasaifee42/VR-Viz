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

class TimeSeries extends Component {
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
      let xDomain, yDomain, zDomain;

      if (this.props.mark.position.x) {
        if (!this.props.mark.position.x.domain) {
          xDomain = GetDomain(this.state.data, this.props.mark.position.x.field, this.props.mark.position.x.scaleType, this.props.mark.position.x.startFromZero)
        } else
          xDomain = this.props.mark.position.x.domain
      }
      if (this.props.mark.position.y) {
        if (!this.props.mark.position.y.domain) {
          yDomain = GetDomain(this.state.data, this.props.mark.position.y.field, this.props.mark.position.y.scaleType, this.props.mark.position.y.startFromZero)
        } else
          yDomain = this.props.mark.position.y.domain
      }

      if (!this.props.mark.position.z.domain) {
        zDomain = GetDomain(this.state.data, this.props.mark.position.z.field, this.props.mark.position.z.scaleType, this.props.mark.position.z.startFromZero)
      } else
        zDomain = this.props.mark.position.z.domain

      //Adding Scale

      let xScale, yScale, zScale;


      if (this.props.mark.position.x.scaleType === 'ordinal')
        xScale = d3.scaleBand()
          .range([0, this.props.style.dimensions.width])
          .domain(xDomain);
      else
        xScale = d3.scaleLinear()
          .range([0, this.props.style.dimensions.width])
          .domain(xDomain);

      if (this.props.mark.position.y.range)
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range(this.props.mark.position.y.range)
      else
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range([0, this.props.style.dimensions.height])

      zScale = d3.scaleLinear()
        .domain(zDomain)
        .range([0, this.props.style.dimensions.depth])

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

      
    
    let dataFormatted1 = [], strokevert = [], faces = [], colorList = [];
    for (let i = 0; i < this.state.data.length - 1; i++) {
      let point = {"x": xScale(this.state.data[i][this.props.mark.position.x.field]), "y": yScale(this.state.data[i][this.props.mark.position.y.field]), "z": zScale(this.state.data[i][this.props.mark.position.z.field])}
      dataFormatted1.push(point)
      let pt1 = dataFormatted1.length - 1;
      point = {"x": xScale(this.state.data[i + 1][this.props.mark.position.x.field]), "y": yScale(this.state.data[i + 1][this.props.mark.position.y.field]), "z": zScale(this.state.data[i + 1][this.props.mark.position.z.field])}
      dataFormatted1.push(point)
      let pt2 = dataFormatted1.length - 1;
      point = {"x": xScale(this.state.data[i + 1][this.props.mark.position.x.field]), "y": yScale(this.state.data[i + 1][this.props.mark.position.y.field]), "z": 0}
      dataFormatted1.push(point)
      let pt3 = dataFormatted1.length - 1;
      point = {"x": xScale(this.state.data[i][this.props.mark.position.x.field]), "y": yScale(this.state.data[i][this.props.mark.position.y.field]), "z": 0}
      dataFormatted1.push(point)
      let pt4 = dataFormatted1.length - 1;
      faces.push([pt1,pt2,pt3]);
      faces.push([pt1,pt3,pt4]);
      let col1, col2, col3, col4;
      col1 = this.props.mark.style.fill.color;
      col2 = this.props.mark.style.fill.color;
      col3 = this.props.mark.style.fill.color;
      col4 = this.props.mark.style.fill.color;
      colorList.push([col1,col2,col3]);
      colorList.push([col1,col3,col4]);
    }
    
      //Adding marks
      let borderCoordinate = [];
      for (let i = 0; i < this.state.data.length; i++) {
        let tempData = [];
        tempData.push(xScale(this.state.data[i][this.props.mark.position.x.field]));
        tempData.push(yScale(this.state.data[i][this.props.mark.position.y.field]));
        tempData.push(zScale(this.state.data[i][this.props.mark.position.z.field]));
        borderCoordinate.push(tempData);
      }
      for (let i = this.state.data.length - 1; i >= 0; i--) {
        let tempData = [];
        tempData.push(xScale(this.state.data[i][this.props.mark.position.x.field]));
        tempData.push(yScale(this.state.data[i][this.props.mark.position.y.field]));
        tempData.push(0);
        borderCoordinate.push(tempData);
      }
      
      borderCoordinate.forEach((d, i) => {
        strokevert.push({"x": d[0], "y": d[1], "z": d[2]})
        if(i > 0)
          strokevert.push({"x": d[0], "y": d[1], "z": d[2]})
      })
      strokevert.push({"x": borderCoordinate[0][0], "y": borderCoordinate[0][1], "z": borderCoordinate[0][2]})

      let points = JSON.stringify(dataFormatted1)
      let facesList = JSON.stringify(faces)
      let vertexColor = JSON.stringify(colorList)
      let strokeVertList = JSON.stringify(strokevert)
  
      let  clickRotation = 'true',animation;
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
          <a-box width={this.props.style.dimensions.width} height={this.props.style.dimensions.height} depth={this.props.style.dimensions.depth} position={`${this.props.style.dimensions.width / 2} ${this.props.style.dimensions.height / 2} ${this.props.style.dimensions.depth / 2}`} opacity ={0}/>
        </a-entity>
      )
    }
  }
}
export default TimeSeries