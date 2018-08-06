import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import ReadPLY from '../Utils/ReadPLY.js';
import Axis from './Axis.js';
import AxisBox from './AxisBox.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';
import 'aframe-meshline-component';

class WaterFallPlot extends Component {
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
      let xDomain, yDomain, zDomain, colorDomain, xDomainTemp;
      xDomain = this.props.mark.position.x.field;
      xDomainTemp = this.props.mark.position.x.field;
      if (this.props.mark.position.x) {
        if (this.props.mark.position.x.scaleType === 'linear')
          if (!this.props.mark.position.x.domain) {
            xDomainTemp = this.props.mark.position.x.field.map((d, i) => parseFloat(d));
            console.log(xDomainTemp)
            xDomain = [Math.min(...xDomainTemp), Math.max(...xDomainTemp)];
          } else {
            xDomain = this.props.mark.position.x.domain;
            xDomainTemp = this.props.mark.position.x.domain;
          }
      }

      if (this.props.mark.position.z) {
        if (!this.props.mark.position.z.domain) {
          zDomain = GetDomain(this.state.data, this.props.mark.position.z.field, this.props.mark.position.z.scaleType, this.props.mark.position.z.startFromZero)
        } else
          zDomain = this.props.mark.position.z.domain
      }

      if (this.props.mark.position.y) {
        if (!this.props.mark.position.y.domain) {
          let min = 9999999999999999, max = -99999999999999999;
          for (let k = 0; k < xDomain.length; k++) {
            for (let i = 0; i < this.state.data.length; i++) {
              if (min > this.state.data[i][xDomain[k]]) {
                min = this.state.data[i][xDomain[k]]
              }
              if (max < this.state.data[i][xDomain[k]])
                max = this.state.data[i][xDomain[k]]
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
      console.log(xDomain);
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

      let strokeColorScale, strokeColorDomain = this.props.mark.position.z.field, strokeColorRange;

      if (this.props.mark.style.stroke)
        if (this.props.mark.style.stroke.scaleType) {
          if (!this.props.mark.style.stroke.domain) {
            strokeColorDomain = GetDomain(this.state.data, this.props.mark.style.stroke.field, this.props.mark.style.stroke.scaleType, this.props.mark.style.stroke.startFromZero)
          } else
            strokeColorDomain = this.props.mark.style.stroke.domain
          let strokeColorRange = d3.schemeCategory10;
          if (this.props.mark.style.stroke.color)
            strokeColorRange = this.props.mark.style.stroke.color;
          if (this.props.mark.style.stroke.scaleType === 'ordinal')
            strokeColorScale = d3.scaleOrdinal()
              .domain(strokeColorDomain)
              .range(strokeColorRange)
          else {
            strokeColorScale = d3.scaleLinear()
              .domain(strokeColorDomain)
              .range(strokeColorRange)
          }
        }


      let fillColorScale, fillColorDomain = this.props.mark.position.z.field, fillColorRange;

      if (this.props.mark.style.fill)
        if (this.props.mark.style.fill.scaleType) {
          if (!this.props.mark.style.fill.domain) {
            fillColorDomain = GetDomain(this.state.data, this.props.mark.style.fill.field, this.props.mark.style.fill.scaleType, this.props.mark.style.fill.startFromZero)
          } else
            fillColorDomain = this.props.mark.style.fill.domain
          let fillColorRange = d3.schemeCategory10;
          if (this.props.mark.style.fill.color)
            fillColorRange = this.props.mark.style.fill.color;
          if (this.props.mark.style.fill.scaleType === 'ordinal')
            fillColorScale = d3.scaleOrdinal()
              .domain(fillColorDomain)
              .range(fillColorRange)
          else {
            fillColorScale = d3.scaleLinear()
              .domain(fillColorDomain)
              .range(fillColorRange)
          }
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

      //Adding marks
      let marks, line;
      if (this.props.mark.style.stroke)
        line = this.state.data.map((d, i) => {
          let path = ''
          for (let j = 0; j < xDomainTemp.length; j++) {
            if (j !== xDomainTemp.length - 1)
              path = path + ` ${xScale(xDomainTemp[j])} ${yScale(d[xDomainTemp[j].toString()])} ${zScale(d[this.props.mark.position.z.field])},`
            else
              path = path + ` ${xScale(xDomainTemp[j])} ${yScale(d[xDomainTemp[j].toString()])} ${zScale(d[this.props.mark.position.z.field])}`
          }
          console.log(path)
          switch (this.props.mark.style.stroke.scaleType) {
            case 'ordinal':
              return <a-entity meshline={`lineWidth: ${this.props.mark.style.stroke.width}; path:${path}; color: ${strokeColorScale(d[this.props.mark.style.stroke.field])}`}></a-entity>
            case 'linear':
              return <a-entity meshline={`lineWidth: ${this.props.mark.style.stroke.width}; path:${path}; color: ${strokeColorScale(d[this.props.mark.style.stroke.field])}`}></a-entity>
            default:
              return <a-entity meshline={`lineWidth: ${this.props.mark.style.stroke.width}; path:${path}; color: ${this.props.mark.style.stroke.color}`}></a-entity>
          }
        })

      if (this.props.mark.style.fill)
        marks = this.state.data.map((d, i) => {
          let path = `0 0,`
          for (let j = 0; j < xDomainTemp.length; j++) {
            if (j !== xDomainTemp.length - 1)
              path = path + ` ${xScale(xDomainTemp[j])} ${yScale(d[xDomainTemp[j].toString()])},`
            else
              path = path + ` ${xScale(xDomainTemp[j])} ${yScale(d[xDomainTemp[j].toString()])}`
          }
          path = path + `, ${xScale(xDomainTemp[xDomainTemp.length - 1])} 0`
          let primitive = `primitive: map; vertices: ${path}; extrude: 0.00000001`;
          switch (this.props.mark.style.fill.scaleType) {
            case 'ordinal':
              return <a-entity key={i} position={`0 0 ${zScale(d[this.props.mark.position.z.field])}`} geometry={primitive} material={`color: ${fillColorScale(d[this.props.mark.style.fill.field])}; side: double; opacity: ${this.props.mark.style.fill.opacity} `} />
            case 'linear':
              return <a-entity key={i} position={`0 0 ${zScale(d[this.props.mark.position.z.field])} `} geometry={primitive} material={`color: ${fillColorScale(d[this.props.mark.style.fill.field])}; side: double; opacity: ${this.props.mark.style.fill.opacity} `} />
            default:
              return <a-entity key={i} position={`0 0 ${zScale(d[this.props.mark.position.z.field])} `} geometry={primitive} material={`color: ${this.props.mark.style.fill.color}; side: double; opacity: ${this.props.mark.style.fill.opacity} `} />
          }
        })

      let graphTitle
      if (this.props.title) {
        graphTitle = <a-text color={this.props.title.color} wrapCount={this.props.title.wrapCount} lineHeight={this.props.title.lineHeight} width={this.props.title.width} value={this.props.title.value} anchor='align' side='double' align={this.props.title.align} position={this.props.title.position} rotation={this.props.title.rotation} />
      }
      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]} `} rotation={this.props.style.rotation} id={this.props.index}>
          {xAxis}
          {yAxis}
          {zAxis}
          {box}
          {graphTitle}
          {marks}
          {line}
        </a-entity>
      )
    }
  }
}
export default WaterFallPlot