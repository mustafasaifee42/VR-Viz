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

class StackedBarGraph extends Component {
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

      // Data manipulation

      let data = d3.stack().keys(this.props.mark.bars.style.color.field)(this.state.data), max = 0;
      let dataset = []
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          dataset.push(data[i][j])
        }
      }
      console.log(data)
      for (let i = 0; i < dataset.length; i++) {
        if (max < dataset[i][1]) {
          max = dataset[i][1]
        }
      }

      // Getting domain for axis
      let xDomain, yDomain, zDomain, colorDomain = this.props.mark.bars.style.color.field;

      if (!this.props.x.domain)
        xDomain = GetDomain(this.state.data, this.props.x.field, this.props.x.type)
      else
        xDomain = this.props.x.domain
    

      if (!this.props.y.domain)
        yDomain = [0, max]
      else
        yDomain = this.props.y.domain
    

      if (!this.props.z.domain) 
        zDomain = GetDomain(this.state.data, this.props.z.field, this.props.z.type)
      else
        zDomain = this.props.z.domain
      

      //Adding Scale
      let xScale, yScale, zScale, colorScale;

      if (this.props.x)
        xScale = d3.scaleBand()
          .range([this.props.mark.bars.style.width / 2, this.props.style.dimensions.width])
          .domain(xDomain);

      if (this.props.y)
        if (this.props.y.range)
          yScale = d3.scaleLinear()
            .domain(yDomain)
            .range(this.props.y.range)
        else
          yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([0, this.props.style.dimensions.height])

      if (this.props.z)
        zScale = d3.scaleBand()
          .domain(zDomain)
          .range([this.props.mark.bars.style.depth / 2, this.props.style.dimensions.depth]);

      colorScale = d3.scaleOrdinal()
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
      
      //Adding marks
      let marks;

      switch (this.props.mark.type) {
        case 'box':
          {
            marks = data.map((d, i) => {
              let markTemp = d.map((d1, j) => {
                return <a-box key={i} color={`${this.props.mark.bars.style.color.fill[i]}`} opacity={this.props.mark.bars.style.opacity} depth={`${this.props.mark.bars.style.depth}`} height={`${yScale(d1[1] - d1[0])}`} width={`${this.props.mark.bars.style.width}`} position={`${xScale(d1.data[this.props.x.field])} ${yScale(d1[0]) + yScale(d1[1] - d1[0]) / 2} ${zScale(d1.data[this.props.z.field])}`} />
              })
              return markTemp
            });
            break;
          }
        case 'cylinder':
          {
            marks = data.map((d, i) => {
              let markTemp = d.map((d1, j) => {
                return <a-cylinder key={i} opacity={this.props.mark.bars.style.opacity} color={`${this.props.mark.bars.style.color.fill[i]}`} height={`${yScale(d1[1] - d1[0])}`} radius={`${this.props.mark.bars.style.radius}`} segments-radial={`${this.props.mark.bars.style.segments}`} position={`${xScale(d1.data[this.props.x.field])} ${yScale(d1[0]) + yScale(d1[1] - d1[0]) / 2} ${zScale(d1.data[this.props.z.field])}`} />
              })
              return markTemp
            });
            break;
          }
        default:
          {
            marks = data.map((d, i) => {
              let markTemp = d.map((d1, j) => {
                return <a-box key={i} color={`${this.props.mark.bars.style.color.fill[i]}`} opacity={this.props.mark.bars.style.opacity} depth={`${this.props.mark.bars.style.depth}`} height={`${yScale(d1[1] - d1[0])}`} width={`${this.props.mark.bars.style.width}`} position={`${xScale(d1.data[this.props.x.field])} ${yScale(d1[0]) + yScale(d1[1] - d1[0]) / 2} ${zScale(d1.data[this.props.z.field])}`} />
              })
              return markTemp
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
export default StackedBarGraph