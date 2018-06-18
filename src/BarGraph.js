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

class BarGraph extends Component {
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
      let xDomain, yDomain, zDomain, colorDomain;

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

      if (this.props.mark.position.z) {
        if (!this.props.mark.position.z.domain) {
          zDomain = GetDomain(this.state.data, this.props.mark.position.z.field, this.props.mark.position.z.scaleType, this.props.mark.position.z.startFromZero)
        } else
          zDomain = this.props.mark.position.z.domain
      }

      if (this.props.mark.style.fill) {
        if (!this.props.mark.style.fill.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.style.fill.field, this.props.mark.style.fill.scaleType, this.props.mark.style.fill.startFromZero)
        } else
          colorDomain = this.props.mark.style.fill.domain
      }

      //Adding Scale

      let xScale, yScale, zScale, colorScale;

      if (this.props.mark.position.x.scaleType === 'ordinal')
        xScale = d3.scaleBand()
          .range([this.props.mark.style.width / 2, this.props.style.dimensions.width])
          .domain(xDomain);
      else
        xScale = d3.scaleLinear()
          .range([0, this.props.style.dimensions.width])
          .domain(xDomain);

      yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([0, this.props.style.dimensions.height])

      if (this.props.mark.position.z.scaleType === 'ordinal')
        zScale = d3.scaleBand()
          .domain(zDomain)
          .range([this.props.mark.style.depth / 2, this.props.style.dimensions.depth]);
      else
        zScale = d3.scaleLinear()
          .domain(zDomain)
          .range([0, this.props.style.dimensions.depth]);



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

      console.log(yScale(4))

      //Adding marks
      let marks;
      switch (this.props.mark.type) {
        case 'box':
          {
            marks = this.state.data.map((d, i) => {
              let hght = yScale(d[this.props.mark.position.y.field]);
              if (yScale(d[this.props.mark.position.y.field]) === 0) {
                hght = 0.000000000001;
              }
              if (this.props.mark.style.fill.scaleType) {
                return <a-box key={i} color={`${colorScale(d[this.props.mark.style.fill.field])}`} opacity={this.props.mark.style.fill.opacity} depth={`${this.props.mark.style.depth}`} height={`${hght}`} width={`${this.props.mark.style.width}`} position={`${xScale(d[this.props.mark.position.x.field])} ${hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
              } else
                return <a-box key={i} color={`${this.props.mark.style.fill.color}`} opacity={this.props.mark.style.fill.opacity} depth={`${this.props.mark.style.depth}`} height={`${hght}`} width={`${this.props.mark.style.width}`} position={`${xScale(d[this.props.mark.position.x.field])} ${hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
            });
            break;
          }
        case 'cylinder':
          {
            marks = this.state.data.map((d, i) => {
              let hght = yScale(d[this.props.mark.position.y.field]);
              if (yScale(d[this.props.mark.position.y.field]) === 0) {
                hght = 0.000000000001;
              }
              if (this.props.mark.style.fill.scaleType)
                return <a-cylinder key={i} opacity={this.props.mark.style.fill.opacity} color={`${colorScale(d[this.props.mark.style.fill.field])}`} height={`${hght}`} radius={`${this.props.mark.style.radius}`} segments-radial={`${this.props.mark.style.segments}`} position={`${xScale(d[this.props.mark.position.x.field])} ${hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
              else
                return <a-cylinder key={i} opacity={this.props.mark.style.fill.opacity} color={`${this.props.mark.style.fill.color}`} height={`${hght}`} radius={`${this.props.mark.style.radius}`} segments-radial={`${this.props.mark.style.segments}`} position={`${xScale(d[this.props.mark.position.x.field])} ${hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
            });
            break;
          }
        case 'cone':
          {
            marks = this.state.data.map((d, i) => {
              let hght = yScale(d[this.props.mark.position.y.field]);
              if (yScale(d[this.props.mark.position.y.field]) === 0) {
                hght = 0.000000000001;
              }
              if (this.props.mark.style.fill.scaleType)
                return <a-cone key={i} opacity={this.props.mark.style.fill.opacity} color={`${colorScale(d[this.props.mark.style.fill.field])}`} height={`${hght}`} radius-bottom={`${this.props.mark.style.radiusBottom}`} radius-top={`${this.props.mark.style.radiusTop}`} segments-radial={`${this.props.mark.style.segments}`} position={`${xScale(d[this.props.mark.position.x.field])} ${hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
              else
                return <a-cone key={i} opacity={this.props.mark.style.fill.opacity} color={`${this.props.mark.style.fill.color}`} height={`${hght}`} radius-bottom={`${this.props.mark.style.radiusBottom}`} radius-top={`${this.props.mark.style.radiusTop}`} segments-radial={`${this.props.mark.style.segments}`} position={`${xScale(d[this.props.mark.position.x.field])} ${hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
            });
            break;
          }
        default:
          {
            marks = this.state.data.map((d, i) => {
              let hght = yScale(d[this.props.mark.position.y.field]);
              if (yScale(d[this.props.mark.position.y.field]) === 0) {
                hght = 0.000000000001;
              }
              if (this.props.mark.style.fill.scaleType)
                return <a-box key={i} opacity={this.props.mark.style.fill.opacity} color={`${colorScale(d[this.props.mark.style.fill.field])}`} depth={`${this.props.mark.style.depth}`} height={`${hght}`} width={`${this.props.mark.style.width}`} position={`${xScale(d[this.props.mark.position.x.field])} ${hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
              else
                return <a-box key={i} opacity={this.props.mark.style.fill.opacity} color={`${this.props.mark.style.fill.color}`} depth={`${this.props.mark.style.depth}`} height={`${hght}`} width={`${this.props.mark.style.width}`} position={`${xScale(d[this.props.mark.position.x.field])} ${hght / 2} ${zScale(d[this.props.mark.position.z.field])}`} />
            });
            break;
          }
      }

      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation}>
          {marks}
          {xAxis}
          {yAxis}
          {zAxis}
          {box}
        </a-entity>
      )
    }
  }
}
export default BarGraph