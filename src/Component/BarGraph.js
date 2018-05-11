import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';

import GetDomain from '../Utils/GetDomain.js';
import Axis from './Axis.js';
import AxisBox from './AxisBox.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';
import ReadPLY from './ReadPLY.js';

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
    if(!this.state.data){
      return <a-entity />
    }
    else {
      // Getting domain for axis
      let xDomain, yDomain, zDomain, colorDomain;

      if (this.props.x) {
        if (!this.props.x.domain) {
          xDomain = GetDomain(this.state.data, this.props.x.field, this.props.x.type)
        } else
          xDomain = this.props.x.domain
      }

      if (this.props.y) {
        if (!this.props.y.domain) {
          yDomain = GetDomain(this.state.data, this.props.y.field, this.props.y.type)
        } else
          yDomain = this.props.y.domain
      }

      if (this.props.z) {
        if (!this.props.z.domain) {
          zDomain = GetDomain(this.state.data, this.props.z.field, this.props.z.type)
        } else
          zDomain = this.props.z.domain
      }

      if (this.props.mark.bars.style.color) {
        if (!this.props.mark.bars.style.color.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.bars.style.color.field, this.props.mark.bars.style.color.type)
        } else
          colorDomain = this.props.mark.bars.style.color.domain
      }

      //Adding Scale

      let xScale, yScale, zScale, colorScale;
      xScale = d3.scaleBand()
        .range([this.props.mark.bars.style.width / 2, this.props.style.dimensions.width])
        .domain(xDomain);

      if (this.props.y.range)
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range(this.props.y.range)
      else
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range([0, this.props.style.dimensions.height])

      zScale = d3.scaleBand()
        .domain(zDomain)
        .range([this.props.mark.bars.style.depth / 2, this.props.style.dimensions.depth]);


      if (this.props.mark.bars.style.color.scale)
        if (this.props.mark.bars.style.color.scaleType === 'ordinal')
          colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(this.props.mark.bars.style.color.fill)
        else
          colorScale = d3.scaleLinear()
            .domain(colorDomain)
            .range(this.props.mark.bars.style.color.fill)

      //Axis
      let xAxis, yAxis, zAxis;

      if (this.props.x.axis.axis) {
        xAxis = <Axis
          tickValues={xDomain}
          tick={this.props.x.axis.ticks}
          scale={xScale}
          axis={'x'}
          orient={this.props.x.axis.orient}
          title={this.props.x.axis.title}
          dimensions={this.props.style.dimensions}
        />
      } else
        xAxis = <a-entity />

      if (this.props.y.axis.axis) {
        yAxis = <Axis
          tickValues={yScale.ticks(this.props.y.axis.ticks['no-of-ticks'])}
          tick={this.props.y.axis.ticks}
          scale={yScale}
          axis={'y'}
          orient={this.props.y.axis.orient}
          title={this.props.y.axis.title}
          dimensions={this.props.style.dimensions}
        />
      } else
        yAxis = <a-entity />

      if (this.props.z.axis.axis) {
        zAxis = <Axis
          tickValues={zDomain}
          tick={this.props.z.axis.ticks}
          scale={zScale}
          axis={'z'}
          orient={this.props.z.axis.orient}
          title={this.props.z.axis.title}
          dimensions={this.props.style.dimensions}
        />

      } else
        zAxis = <a-entity />


      let box;
      if (this.props.style['axis-box']) {
        box = <AxisBox
          width={this.props.style.dimensions.width}
          height={this.props.style.dimensions.height}
          depth={this.props.style.dimensions.depth}
          color={this.props.style['axis-box-color']}
        />
      } else {
        box = <a-entity />
      }

      console.log(yScale(4))

      //Adding marks
      let marks;
      switch (this.props.mark.bars.type) {
        case 'box':
          {
            marks = this.state.data.map((d, i) => {
              let hght = yScale(d[this.props.y.field]);
              if(yScale(d[this.props.y.field]) === 0){
                hght = 0.000000000001;
              }
              if (this.props.mark.bars.style.color.scale) {
                return <a-box key={i} color={`${colorScale(d[this.props.mark.bars.style.color.field])}`} opacity={this.props.mark.bars.style.opacity} depth={`${this.props.mark.bars.style.depth}`} height={`${hght}`} width={`${this.props.mark.bars.style.width}`} position={`${xScale(d[this.props.x.field])} ${hght / 2} ${zScale(d[this.props.z.field])}`} />
              } else
                return <a-box key={i} color={`${this.props.mark.bars.style.color.fill}`} opacity={this.props.mark.bars.style.opacity} depth={`${this.props.mark.bars.style.depth}`} height={`${hght}`} width={`${this.props.mark.bars.style.width}`} position={`${xScale(d[this.props.x.field])} ${hght / 2} ${zScale(d[this.props.z.field])}`} />
            });
            break;
          }
        case 'cylinder':
          {
            marks = this.state.data.map((d, i) => {
              let hght = yScale(d[this.props.y.field]);
              if(yScale(d[this.props.y.field]) === 0){
                hght = 0.000000000001;
              }
              if (this.props.mark.bars.style.color.scale)
                return <a-cylinder key={i} opacity={this.props.mark.bars.style.opacity} color={`${colorScale(d[this.props.mark.bars.style.color.field])}`} height={`${hght}`} radius={`${this.props.mark.bars.style.radius}`} segments-radial={`${this.props.mark.bars.style.segments}`} position={`${xScale(d[this.props.x.field])} ${hght / 2} ${zScale(d[this.props.z.field])}`} />
              else
                return <a-cylinder key={i} opacity={this.props.mark.bars.style.opacity} color={`${this.props.mark.bars.style.color.fill}`} height={`${hght}`} radius={`${this.props.mark.bars.style.radius}`} segments-radial={`${this.props.mark.bars.style.segments}`} position={`${xScale(d[this.props.x.field])} ${hght / 2} ${zScale(d[this.props.z.field])}`} />
            });
            break;
          }
        case 'cone':
          {
            marks = this.state.data.map((d, i) => {
              let hght = yScale(d[this.props.y.field]);
              if(yScale(d[this.props.y.field]) === 0){
                hght = 0.000000000001;
              }
              if (this.props.mark.bars.style.color.scale)
                return <a-cone key={i} opacity={this.props.mark.bars.style.opacity} color={`${colorScale(d[this.props.mark.bars.style.color.field])}`} height={`${hght}`} radius-bottom={`${this.props.mark.bars.style.radiusBottom}`} radius-top={`${this.props.mark.bars.style.radiusTop}`} segments-radial={`${this.props.mark.bars.style.segments}`} position={`${xScale(d[this.props.x.field])} ${hght / 2} ${zScale(d[this.props.z.field])}`} />
              else
                return <a-cone key={i} opacity={this.props.mark.bars.style.opacity} color={`${this.props.mark.bars.style.color.fill}`} height={`${hght}`} radius-bottom={`${this.props.mark.bars.style.radiusBottom}`} radius-top={`${this.props.mark.bars.style.radiusTop}`} segments-radial={`${this.props.mark.bars.style.segments}`} position={`${xScale(d[this.props.x.field])} ${hght / 2} ${zScale(d[this.props.z.field])}`} />
            });
            break;
          }
        default:
          {
            marks = this.state.data.map((d, i) => {
              let hght = yScale(d[this.props.y.field]);
              if(yScale(d[this.props.y.field]) === 0){
                hght = 0.000000000001;
              }
              if (this.props.mark.bars.style.color.scale)
                return <a-box key={i} opacity={this.props.mark.bars.style.opacity} color={`${colorScale(d[this.props.mark.bars.style.color.field])}`} depth={`${this.props.mark.bars.style.depth}`} height={`${hght}`} width={`${this.props.mark.bars.style.width}`} position={`${xScale(d[this.props.x.field])} ${hght / 2} ${zScale(d[this.props.z.field])}`} />
              else
                return <a-box key={i} opacity={this.props.mark.bars.style.opacity} color={`${this.props.mark.bars.style.color.fill}`} depth={`${this.props.mark.bars.style.depth}`} height={`${hght}`} width={`${this.props.mark.bars.style.width}`} position={`${xScale(d[this.props.x.field])} ${hght / 2} ${zScale(d[this.props.z.field])}`} />
            });
            break;
          }
      }

      return (
        <a-entity position = {`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
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