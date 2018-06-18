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

class TimeBars extends Component {
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
      let xDomain, yDomain, zDomain, colorDomain, radiusDomain;

      if (this.props.mark.position.x) {
        if (!this.props.mark.position.x.domain) {
          xDomain = GetDomain(this.state.data, this.props.mark.position.x.field, this.props.mark.position.x.scaleType, this.props.mark.position.x.startFromZero)
        } else
          xDomain = this.props.mark.position.x.domain
      }

      yDomain = Object.keys(this.state.data[0][this.props.mark.position.y.field])
      console.log(yDomain)
      yDomain = yDomain.map((d, i) => {
        if (this.props.mark.position.y.format) {
          return moment(d, this.props.mark.position.y.format)['_d']
        }
      })
      console.log(yDomain)
      let hght = this.props.style.dimensions.height / yDomain.length;
      if (this.props.mark.style.height) {
        hght = this.props.mark.style.height
      }
      if (this.props.mark.position.z) {
        if (!this.props.mark.position.z.domain) {
          zDomain = GetDomain(this.state.data, this.props.mark.position.z.field, this.props.mark.position.z.scaleType, this.props.mark.position.z.srartFromZero)
        } else
          zDomain = this.props.mark.position.z.domain
      }

      let radiusData = [];
      for (let j = 0; j < this.state.data.length; j++) {
        for (let i = 0; i < Object.keys(this.state.data[0][this.props.mark.style.radius.field]).length; i++) {
          radiusData.push({ 'radius': this.state.data[j][this.props.mark.style.radius.field][Object.keys(this.state.data[0][this.props.mark.style.radius.field])[i]] })
        }
      }
      if (!this.props.mark.style.radius.domain) {
        radiusDomain = GetDomain(radiusData, 'radius', this.props.mark.style.radius.type, this.props.mark.style.radius.startFromZero)
      } else
        radiusDomain = this.props.mark.style.radius.domain


      let colorData = [];
      if (this.props.mark.style.fill.scaleType) {
        for (let j = 0; j < this.state.data.length; j++) {
          for (let i = 0; i < Object.keys(this.state.data[0][this.props.mark.style.fill.field]).length; i++) {
            colorData.push({ 'color': this.state.data[j][this.props.mark.style.fill.field][Object.keys(this.state.data[0][this.props.mark.style.fill.field])[i]] })
          }
        }
        if (!this.props.mark.style.fill.domain) {
          colorDomain = GetDomain(colorData, 'color', this.props.mark.style.fill.scaleType, this.props.mark.style.fill.startFromZero)
        } else
          colorDomain = this.props.mark.style.fill.domain
      }
      //Adding Scale

      let xScale, yScale, zScale, colorScale, radiusScale;

      xScale = d3.scaleBand()
        .range([0, this.props.style.dimensions.width])
        .domain(xDomain)
        .paddingInner(this.props.mark.style.padding.x);

      zScale = d3.scaleBand()
        .domain(zDomain)
        .range([xScale.bandwidth() / 2, this.props.style.dimensions.depth]);

      radiusScale = d3.scaleLinear()
        .domain(radiusDomain)
        .range([0, xScale.bandwidth() / 2])

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
          padding={xScale.bandwidth()}
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
      let marks;
      marks = this.state.data.map((d, i) => {
        let units = yDomain.map((d1, j) => {
          if (this.props.mark.position.y.format) {
            let s = moment(d1).format(this.props.mark.position.y.format)
            if (this.props.mark.style.fill.scaleType) {
              return <a-cylinder key={i} color={`${colorScale(d[this.props.mark.style.fill.field][s])}`} opacity={this.props.mark.style.fill.opacity} height={`${hght}`} radius={`${radiusScale(d[this.props.mark.style.radius.field][s])}`} position={`${xScale(d[this.props.mark.position.x.field]) + xScale.bandwidth() / 2} ${j * hght + hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
            } else
              return <a-cylinder key={i} color={`${this.props.mark.style.fill.color}`} opacity={this.props.mark.style.fill.opacity} height={`${hght}`} radius={`${radiusScale(d[this.props.mark.style.radius.field][s])}`} position={`${xScale(d[this.props.mark.position.x.field]) + xScale.bandwidth() / 2} ${j * hght + hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
          }
          else {
            if (this.props.mark.style.fill.scaleType) {
              return <a-cylinder key={i} color={`${colorScale(d[this.props.mark.style.fill.field][d1])}`} opacity={this.props.mark.style.fill.opacity} height={`${hght}`} radius={`${radiusScale(d[this.props.mark.style.radius.field][d1])}`} position={`${xScale(d[this.props.mark.position.x.field]) + xScale.bandwidth() / 2} ${j * hght + hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
            } else
              return <a-cylinder key={i} color={`${this.props.mark.style.fill.color}`} opacity={this.props.mark.style.fill.opacity} height={`${hght}`} radius={`${radiusScale(d[this.props.mark.style.radius.field][d1])}`} position={`${xScale(d[this.props.mark.position.x.field]) + xScale.bandwidth() / 2} ${j * hght + hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
          }
        })
        return units
      })
      console.log(this.props.xAxis)
      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation}>
          {marks}
          {xAxis}
          {zAxis}
          {box}
        </a-entity>
      )
    }
  }
}
export default TimeBars