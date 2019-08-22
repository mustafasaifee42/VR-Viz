import React, { Component } from 'react';
import * as d3 from 'd3';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import GetMapShape from '../Utils/GetMapShape';
import ReadPLY from '../Utils/ReadPLY.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';

class PrismMap extends Component {
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

      let data = {}
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.props.mark.style.fill.scaleType)
          data[this.state.data[i][this.props.mark.shapeIdentifier]] = { 'value': this.state.data[i][this.props.mark.style.extrusion.field], 'colorField': this.state.data[i][this.props.mark.style.fill.field] }
        else
          data[this.state.data[i][this.props.mark.shapeIdentifier]] = { 'value': this.state.data[i][this.props.mark.style.extrusion.field], 'colorField': 'NA' }
      }

      // Getting domain
      let colorDomain, extrusionDomain;

      if (this.props.mark.style.extrusion.scaleType) {
        if (!this.props.mark.style.extrusion.domain) {
          extrusionDomain = GetDomain(this.state.data, this.props.mark.style.extrusion.field, this.props.mark.style.extrusion.scaleType, this.props.mark.style.extrusion.startFromZero)
        } else
          extrusionDomain = this.props.mark.style.extrusion.domain
      }

      if (this.props.mark.style.fill.scaleType) {
        if (!this.props.mark.style.fill.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.style.fill.field, this.props.mark.style.fill.scaleType, this.props.mark.style.fill.startFromZero)
        } else
          colorDomain = this.props.mark.style.fill.domain
      }

      //Adding scales

      let colorScale, extrusionScale;

      extrusionScale = d3.scaleLinear()
        .domain(extrusionDomain)
        .range(this.props.mark.style.extrusion.value)

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

      //Adding marks

      let pts, extrusionArr = [], colorArray = [], boundingBox = [];
      let stroke = false, strokeColor = '#000000'
      if (this.props.mark.style.stroke){
        stroke = true;
        strokeColor = this.props.mark.style.stroke.color
      }
      let geoData = GetMapShape(this.props.mark.data, this.props.mark.projection, this.props.mark.mapScale, this.props.mark.mapOrigin, this.props.mark.shapeIdentifier, this.props.mark.shapeKey);
      if (this.props.mark.projection){
        pts = geoData.map((d, i) => {
          let points = d.vertices.split(', ')
          let pointsArray = points.map(d => {
            let pnts = d.split(' ') 
            let obj = {'x':parseFloat(pnts[0]),'y':parseFloat(pnts[1])}
            return obj
          })
          let extrusionHeight = extrusionScale(data[d['code']]['value'])
          if (extrusionHeight === 0)
            extrusionHeight = 0.000000000001;
          extrusionArr.push(extrusionHeight)
          if (this.props.mark.style.fill.scaleType)
            colorArray.push(colorScale(data[d['code']]['colorField']))
          else
            colorArray.push(this.props.mark.style.fill.color)

          let min = {"x": d3.min(pointsArray, d => d["x"]), "y": d3.min(pointsArray, d => d["y"])}
          let max = {"x": d3.max(pointsArray, d => d["x"]), "y": d3.max(pointsArray, d => d["y"])}
          let box = <a-box key ={i} width={max.x - min.x} height={max.y - min.y} depth={extrusionHeight} position={`${(max.x + min.x) / 2} ${(max.y + min.y) / 2} ${extrusionHeight / 2}`} opacity={0}/>
          boundingBox.push(box)
          return pointsArray
        })
      } else {

      }
      let shapes;
      if (this.props.mark.style.fill.scaleType)
        shapes = (<a-entity class='clickable' aframemap={`points:${JSON.stringify(pts)};stroke_bool:${stroke};stroke_color:${strokeColor};extrude:${JSON.stringify(extrusionArr)};color:${JSON.stringify(colorArray)};opacity:${this.props.mark.style.fill.opacity}`} />)
      else
        shapes = (<a-frame-map class='clickable' points={JSON.stringify(pts)} stroke_bool={stroke} stroke_color={strokeColor} extrude={JSON.stringify(extrusionArr)} color={JSON.stringify(colorArray)} opacity={this.props.mark.style.fill.opacity} />)
  
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
      return (
        <a-entity click-rotation={`enabled:${clickRotation}`} pivot-center={`xPosition:${this.props.style.origin[0]};yPosition:${this.props.style.origin[1]};zPosition:${this.props.style.origin[2]};pivotX:${this.props.style.xPivot};pivotY:${this.props.style.yPivot};pivotZ:${this.props.style.zPivot}`}  rotation={this.props.mark.rotation} position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} id={this.props.index}>
          {animation}
          {shapes}
          {boundingBox}
        </a-entity>
      )
    }
  }
}
export default PrismMap