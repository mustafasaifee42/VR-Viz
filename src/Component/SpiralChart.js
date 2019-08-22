import React, { Component } from 'react';
import * as d3 from 'd3';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import ReadPLY from '../Utils/ReadPLY.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';

class SpiralChart extends Component {
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

      // Getting domain
      let colorDomain, fillColorDomain;

      if (this.props.mark.style.stroke)
        if (this.props.mark.style.stroke.scaleType) {
          if (!this.props.mark.style.stroke.domain) {
            colorDomain = GetDomain(this.state.data, this.props.mark.style.stroke.field, this.props.mark.style.stroke.type, this.props.mark.style.stroke.startFromZero)
          } else
            colorDomain = this.props.mark.style.stroke.domain
        }

      if (this.props.mark.style.fill)
        if (this.props.mark.style.fill.scaleType) {
          if (!this.props.mark.style.fill.domain) {
            fillColorDomain = GetDomain(this.state.data, this.props.mark.style.fill.field, this.props.mark.style.fill.type, this.props.mark.style.fill.startFromZero)
          } else
            fillColorDomain = this.props.mark.style.fill.domain
        }

      //Adding scales

      let colorScale, fillColorScale;

      let scales;

      scales = this.props.mark.vertices.map((d, i) => {
        let domain;
        if (!d.domain) {
          domain = GetDomain(this.state.data, d.title, d.scaleType, d.startFromZero)
        } else {
          domain = d.domain
        }
        return (d3.scaleLinear()
          .domain(domain)
          .range([0, this.props.style.width])
        )
      })


      if (this.props.mark.style.stroke)
        if (this.props.mark.style.stroke.scaleType) {
          let colorRange = d3.schemeCategory10;
          if (this.props.mark.style.stroke.color)
            colorRange = this.props.mark.style.stroke.color;
          if (this.props.mark.style.stroke.scaleType === 'ordinal')
            colorScale = d3.scaleOrdinal()
              .domain(colorDomain)
              .range(colorRange)
          else
            colorScale = d3.scaleLinear()
              .domain(colorDomain)
              .range(colorRange)
        }

      if (this.props.mark.style.fill)
        if (this.props.mark.style.fill.scaleType) {
          let fillColorRange = d3.schemeCategory10;
          if (this.props.mark.style.fill.color)
            fillColorRange = this.props.mark.style.fill.color;
          if (this.props.mark.style.fill.scaleType === 'ordinal')
            fillColorScale = d3.scaleOrdinal()
              .domain(fillColorDomain)
              .range(fillColorRange)
          else
            fillColorScale = d3.scaleLinear()
              .domain(fillColorDomain)
              .range(fillColorRange)
        }

      //Drawing SpiralCoordinates

      let shapeCoordinates;

      let yPos = this.props.style.height / this.state.data.length;
      shapeCoordinates = this.state.data.map((d, i) => {
        let coordinates = ''
        let angle = Math.PI * 2 / scales.length;
        scales.forEach((d1, j) => {
          coordinates = coordinates + `${d1(d[this.props.mark.vertices[j].title]) * Math.sin(j * angle)} ${0 - d1(d[this.props.mark.vertices[j].title]) * Math.cos(j * angle)},`
        })
        coordinates = coordinates + `${scales[0](d[this.props.mark.vertices[0].title]) * Math.sin(0)} ${0 - scales[0](d[this.props.mark.vertices[0].title]) * Math.cos(0)}`

        return coordinates;
      })

      //Adding curves

      let shapes;
      shapes = this.state.data.map((d, i) => {
        let points = shapeCoordinates[i].split(',')
        let pntArray = points.map(d => {
          let pnts = d.split(' ') 
          let obj = {'x':pnts[0],'y':pnts[1], 'z':0}
          return obj
        })
        let mapShape, mapOutline
        if (this.props.mark.style.stroke)
          if (this.props.mark.style.stroke.scaleType)
            mapOutline = <a-frame-curve-line points={JSON.stringify(pntArray)} key={i} type={'line'} color={colorScale(d[this.props.mark.style.stroke.field])} opacity={1} stroke_width={this.props.mark.style.stroke.width} />
          else
            mapOutline = <a-frame-curve-line points={JSON.stringify(pntArray)} key={i} type={'line'} color={this.props.mark.style.stroke.color} opacity={1} stroke_width={this.props.mark.style.stroke.width} />
        
        if (this.props.mark.style.fill){
          if (this.props.mark.style.fill.scaleType){
            mapShape = ( <a-frame-shape points={JSON.stringify(pntArray)} key={i} color={fillColorScale(d[this.props.mark.style.fill.field])} opacity={this.props.mark.style.fill.opacity} /> )
          }
          else{
            mapShape = ( <a-frame-shape points={JSON.stringify(pntArray)} key={i} color={this.props.mark.style.fill.color} opacity={this.props.mark.style.fill.opacity} /> )
          }
        }
        let mark =  (
          <a-entity rotation='90 0 0' position={`0 ${i * yPos} 0`}  key={i}  >
            {mapShape}
            {mapOutline}  
          </a-entity>
        )
        return mark
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
      return (
        <a-entity click-rotation={`enabled:${clickRotation}`} pivot-center={`xPosition:${this.props.style.origin[0]};yPosition:${this.props.style.origin[1]};zPosition:${this.props.style.origin[2]};pivotX:${this.props.style.xPivot};pivotY:${this.props.style.yPivot};pivotZ:${this.props.style.zPivot}`}  position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation} id={this.props.index}>
          {animation}
          {shapes}
          <a-box position = {`0 ${this.props.style.height / 2} 0`} opacity='0' height={this.props.style.height} depth={this.props.style.width * 2} width={this.props.style.width * 2} />
        </a-entity>
      )
    }
  }
}
export default SpiralChart