import React, { Component } from 'react';
import * as d3 from 'd3';
import * as moment from 'moment';

import ReadPLY from '../Utils/ReadPLY.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';

class ContourMap extends Component {
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
      // Data Manipulation

      let dataFormatted = [];
      for (let i = 0; i < this.state.data.length; i++) {
        for (let k = 0; k < this.state.data[i].length; k++) {
          dataFormatted.push([]);
          dataFormatted[dataFormatted.length - 1].push(this.state.data[i][k])
        }
      }
      // Getting domain
      let colorDomain;
      if (this.props.mark.style.fill)
        if (this.props.mark.style.fill.scaleType) {
          if (!this.props.mark.style.fill.domain) {
            colorDomain = [d3.min(dataFormatted, d => d[0]), d3.max(dataFormatted, d => d[0])]
          } else
            colorDomain = this.props.mark.style.fill.domain
        }

      //Adding scales

      let colorScale;
      if (this.props.mark.style.fill)
        if (this.props.mark.style.fill.scaleType) {
          let colorRange = d3.schemeCategory10;
          if (this.props.mark.style.fill.color)
            colorRange = this.props.mark.style.fill.color;
          if (this.props.mark.style.fill.scaleType === 'ordinal')
            colorScale = d3.scaleOrdinal()
              .domain(colorDomain)
              .range(colorRange)
          else
            colorScale = d3.scaleLinear()
              .domain(colorDomain)
              .range(colorRange)
        }
      else {
        colorScale = d3.scaleLinear()
          .domain([0,1])
          .range([this.props.mark.style.fill.color,this.props.mark.style.fill.color])
      }

      let dataFormatted1 = [], faces = [], colorList = [], strokevert = []
      for (let i = 0; i < this.state.data.length - 1; i++) {
        for (let k = 0; k < this.state.data[i].length - 1; k++) {
          let point = {"x": i * this.props.style.objectScale.ground, "y": (this.state.data[i][k]  - this.props.heightThreshold) * this.props.style.objectScale.height, "z": k * this.props.style.objectScale.ground}
          dataFormatted1.push(point)
          strokevert.push(point)
          let pt1 = dataFormatted1.length - 1, col1 = colorScale(this.state.data[i][k])
          point = {"x": (i + 1) * this.props.style.objectScale.ground, "y": (this.state.data[i + 1][k] - this.props.heightThreshold) * this.props.style.objectScale.height, "z": k * this.props.style.objectScale.ground}
          dataFormatted1.push(point)
          strokevert.push(point)
          strokevert.push(point)
          let pt2 = dataFormatted1.length - 1, col2 = colorScale(this.state.data[i + 1][k])
          point = {"x": (i + 1) * this.props.style.objectScale.ground, "y": (this.state.data[i + 1][k + 1] - this.props.heightThreshold) * this.props.style.objectScale.height, "z": (k + 1) * this.props.style.objectScale.ground}
          dataFormatted1.push(point)
          strokevert.push(point)
          strokevert.push(point)
          let pt3 = dataFormatted1.length - 1, col3 = colorScale(this.state.data[i + 1][k + 1])
          point = {"x": i * this.props.style.objectScale.ground, "y": (this.state.data[i][k + 1] - this.props.heightThreshold) * this.props.style.objectScale.height, "z": (k + 1) * this.props.style.objectScale.ground}
          dataFormatted1.push(point)
          strokevert.push(point)
          strokevert.push(point)
          point = {"x": i * this.props.style.objectScale.ground, "y": (this.state.data[i][k]  - this.props.heightThreshold) * this.props.style.objectScale.height, "z": k * this.props.style.objectScale.ground}
          strokevert.push(point)
          let pt4 = dataFormatted1.length - 1, col4 = colorScale(this.state.data[i][k + 1])
          faces.push([pt1,pt2,pt3]);
          faces.push([pt1,pt3,pt4]);
          colorList.push([col1,col2,col3]);
          colorList.push([col1,col3,col4]);
          
        }
      }
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
          <a-frame-mesh-from-points points={points} faces={facesList} stroke_vertices={strokeVertList} stroke_bool={stroke_bool} stroke_color={stroke_color} stroke_width={stroke_width} stroke_opacity={stroke_opacity} color={vertexColor} opacity={this.props.mark.style.fill.opacity} />
        </a-entity>
      )
    }
  }
}
export default ContourMap