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

class TimeSeries extends Component {
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
    if (!this.state.data) {
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

      if (!this.props.mark.timeSeries.style.width.domain) {
        zDomain = GetDomain(this.state.data, this.props.mark.timeSeries.style.width.field, this.props.mark.timeSeries.style.width.scaleType)
      } else
        zDomain = this.props.mark.timeSeries.style.width.domain
      
      //Adding Scale

      let xScale, yScale, zScale, colorScale;
      
      
      xScale = d3.scaleBand()
        .range([0, this.props.style.dimensions.width])
        .domain(xDomain);

      if (this.props.y.range)
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range(this.props.y.range)
      else
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range([0, this.props.style.dimensions.height])
      
      zScale = d3.scaleLinear()
        .domain(zDomain)
        .range(this.props.mark.timeSeries.style.width.range)

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
      let dataCoordinate = [], dataSphere = [];
      for (let i = 0; i < this.state.data.length - 1; i++) {
        let tempData = [];
        tempData.push(xScale(this.state.data[i][this.props.x.field]));
        tempData.push(yScale(this.state.data[i][this.props.y.field]));
        tempData.push(this.props.style.dimensions.depth / 2 + zScale(this.state.data[i][this.props.mark.timeSeries.style.width.field]) / 2);
        tempData.push(xScale(this.state.data[i+1][this.props.x.field]));
        tempData.push(yScale(this.state.data[i+1][this.props.y.field]));
        tempData.push(this.props.style.dimensions.depth / 2  + zScale(this.state.data[i+1][this.props.mark.timeSeries.style.width.field]) / 2);
        tempData.push(xScale(this.state.data[i+1][this.props.x.field]));
        tempData.push(yScale(this.state.data[i+1][this.props.y.field]));
        tempData.push(this.props.style.dimensions.depth / 2  - zScale(this.state.data[i+1][this.props.mark.timeSeries.style.width.field]) / 2);
        tempData.push(xScale(this.state.data[i][this.props.x.field]));
        tempData.push(yScale(this.state.data[i][this.props.y.field]));
        tempData.push(this.props.style.dimensions.depth / 2  - zScale(this.state.data[i][this.props.mark.timeSeries.style.width.field]) / 2);
        console.log(this.props.style.depth)
        dataCoordinate.push(tempData);
      }

      marks = dataCoordinate.map((d, i) => <a-entity key={i} geometry={`primitive: planeFromVertices; vertices: ${d[0]} ${d[1]} ${d[2]}, ${d[3]} ${d[4]} ${d[5]}, ${d[6]} ${d[7]} ${d[8]}, ${d[9]} ${d[10]} ${d[11]}`} material={`color: ${this.props.mark.timeSeries.style.fill.color}; side: double; opacity: ${this.props.mark.timeSeries.style.fill.opacity}`} />);

      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
          {marks}
          {xAxis}
          {yAxis}
          {box}
        </a-entity>
      )
    }
  }
}
export default TimeSeries