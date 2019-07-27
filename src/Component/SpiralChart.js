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

      let spiralCoordinates, shapeCoordinates;

      let yPos = this.props.style.height / this.state.data.length;
      spiralCoordinates = this.state.data.map((d, i) => {
        let coordinates = ''
        let angle = Math.PI * 2 / scales.length;
        scales.forEach((d1, j) => {
          coordinates = coordinates + ` ${d1(d[this.props.mark.vertices[j].title]) * Math.sin(j * angle)} ${i * yPos} ${0 - d1(d[this.props.mark.vertices[j].title]) * Math.cos(j * angle)} ,`
        })
        coordinates = coordinates + ` ${scales[0](d[this.props.mark.vertices[0].title]) * Math.sin(0)} ${i * yPos} ${0 - scales[0](d[this.props.mark.vertices[0].title]) * Math.cos(0)}`
        return coordinates;
      })
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

      let spiral, shapes;
      if (this.props.mark.style.stroke)
        spiral = this.state.data.map((d, i) => {
          if (this.props.mark.style.stroke.scaleType)
            return <a-entity key={i} plane-from-vertices={`path:${spiralCoordinates[i]};face:false;stroke:true;strokeWidth:${this.props.mark.style.stroke.width};strokeColor:${colorScale(d[this.props.mark.style.stroke.field])}`} />
          else
            return <a-entity key={i} plane-from-vertices={`path:${spiralCoordinates[i]};face:false;stroke:true;strokeWidth:${this.props.mark.style.stroke.width};strokeColor:${this.props.mark.style.stroke.color}`} />
        })

      if (this.props.mark.style.fill)
        shapes = this.state.data.map((d, i) => {
          let primitive = `primitive: map; vertices: ${shapeCoordinates[i]}; extrude: ${0.00001}`;
          if (this.props.mark.style.fill.scaleType)
            return (<a-entity key={i} geometry={primitive} material={`color: ${fillColorScale(d[this.props.mark.style.fill.field])}; metalness: 0.2; opacity:${this.props.mark.style.fill.opacity}`} position={`0 ${i * yPos} 0`} rotation={`90 0 0`} />)
          else
            return (<a-entity key={i}  geometry={primitive} material={`color: ${this.props.mark.style.fill.color}; metalness: 0.2; opacity:${this.props.mark.style.fill.opacity}`} position={`0 ${i * yPos} 0`} rotation={`90 0 0`} />)
        })

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
      return (
        <a-entity click-rotation={`enabled:${clickRotation}`} pivot-center={`pivotX:${this.props.style.xPivot};pivotY:${this.props.style.yPivot};pivotZ:${this.props.style.zPivot}`}  position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation} id={this.props.index}>
          {animation}
          {spiral}
          {shapes}
        </a-entity>
      )
    }
  }
}
export default SpiralChart