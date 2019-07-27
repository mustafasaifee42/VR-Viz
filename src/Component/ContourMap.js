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

      let dataFormatted = []
      for (let i = 0; i < this.state.data.length - 1; i++) {
        for (let k = 0; k < this.state.data[i].length - 1; k++) {
          dataFormatted.push([]);
          dataFormatted[dataFormatted.length - 1].push(i)
          dataFormatted[dataFormatted.length - 1].push(this.state.data[i][k])
          dataFormatted[dataFormatted.length - 1].push(k)
          dataFormatted[dataFormatted.length - 1].push(i + 1)
          dataFormatted[dataFormatted.length - 1].push(this.state.data[i + 1][k])
          dataFormatted[dataFormatted.length - 1].push(k)
          dataFormatted[dataFormatted.length - 1].push(i + 1)
          dataFormatted[dataFormatted.length - 1].push(this.state.data[i + 1][k + 1])
          dataFormatted[dataFormatted.length - 1].push(k + 1)
          dataFormatted[dataFormatted.length - 1].push(i)
          dataFormatted[dataFormatted.length - 1].push(this.state.data[i][k + 1])
          dataFormatted[dataFormatted.length - 1].push(k + 1)
        }
      }

      // Getting domain
      let colorDomain;
      if (this.props.mark.style.fill)
        if (this.props.mark.style.fill.scaleType) {
          if (!this.props.mark.style.fill.domain) {
            colorDomain = [d3.min(dataFormatted, d => d[1]), d3.max(dataFormatted, d => d[1])]
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

      //Drawing Contour

      let shapes = dataFormatted.map((d, i) => {
        if(this.props.mark.style.fill) {
          let color = this.props.mark.style.fill.color;
          if (this.props.mark.style.fill.scaleType)
            color = colorScale(d[1])
          if (this.props.mark.style.stroke)
            return <a-entity key={`${i}`} plane-from-vertices={`path:${d[0] * this.props.style.objectScale.ground} ${(d[1] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[2] * this.props.style.objectScale.ground}, ${d[3] * this.props.style.objectScale.ground} ${(d[4] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[5] * this.props.style.objectScale.ground}, ${d[6] * this.props.style.objectScale.ground} ${(d[7] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[8] * this.props.style.objectScale.ground}, ${d[9] * this.props.style.objectScale.ground} ${(d[10] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[11] * this.props.style.objectScale.ground}, ${d[0] * this.props.style.objectScale.ground} ${(d[1] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[2] * this.props.style.objectScale.ground};face:true;faceColor: ${color};faceOpacity: ${this.props.mark.style.fill.opacity};stroke:true;strokeWidth:${this.props.mark.style.stroke.width};strokeColor:${this.props.mark.style.stroke.color}`} />
          else
          return <a-entity key={`${i}`} plane-from-vertices={`path:${d[0] * this.props.style.objectScale.ground} ${(d[1] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[2] * this.props.style.objectScale.ground}, ${d[3] * this.props.style.objectScale.ground} ${(d[4] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[5] * this.props.style.objectScale.ground}, ${d[6] * this.props.style.objectScale.ground} ${(d[7] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[8] * this.props.style.objectScale.ground}, ${d[9] * this.props.style.objectScale.ground} ${(d[10] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[11] * this.props.style.objectScale.ground}, ${d[0] * this.props.style.objectScale.ground} ${(d[1] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[2] * this.props.style.objectScale.ground};face:true;faceColor: ${color};faceOpacity: ${this.props.mark.style.fill.opacity};stroke:false`} />     
        }
        else {
          if (this.props.mark.style.stroke)
            return <a-entity key={`${i}`} plane-from-vertices={`path:${d[0] * this.props.style.objectScale.ground} ${(d[1] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[2] * this.props.style.objectScale.ground}, ${d[3] * this.props.style.objectScale.ground} ${(d[4] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[5] * this.props.style.objectScale.ground}, ${d[6] * this.props.style.objectScale.ground} ${(d[7] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[8] * this.props.style.objectScale.ground}, ${d[9] * this.props.style.objectScale.ground} ${(d[10] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[11] * this.props.style.objectScale.ground}, ${d[0] * this.props.style.objectScale.ground} ${(d[1] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[2] * this.props.style.objectScale.ground};face:false;stroke:true;strokeWidth:${this.props.mark.style.stroke.width};strokeColor:${this.props.mark.style.stroke.color}`} />
          else
            return <a-entity key={`${i}`} plane-from-vertices={`path:${d[0] * this.props.style.objectScale.ground} ${(d[1] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[2] * this.props.style.objectScale.ground}, ${d[3] * this.props.style.objectScale.ground} ${(d[4] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[5] * this.props.style.objectScale.ground}, ${d[6] * this.props.style.objectScale.ground} ${(d[7] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[8] * this.props.style.objectScale.ground}, ${d[9] * this.props.style.objectScale.ground} ${(d[10] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[11] * this.props.style.objectScale.ground}, ${d[0] * this.props.style.objectScale.ground} ${(d[1] - this.props.heightThreshold) * this.props.style.objectScale.height} ${d[2] * this.props.style.objectScale.ground};face:false;stroke:false`} />     
        } 
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
          {shapes}
        </a-entity>
      )
    }
  }
}
export default ContourMap