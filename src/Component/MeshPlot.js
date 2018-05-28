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
import 'aframe-meshline-component';

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

      if (this.props.z) {
        if (!this.props.z.domain) {
          console.log(Object.keys(this.state.data[0]))
          zDomain = [];
          for (let k = 0; k < Object.keys(this.state.data[0]).length; k++)
            if (Object.keys(this.state.data[0])[k] !== this.props.x.field)
              zDomain.push(Object.keys(this.state.data[0])[k]);
        } else
          zDomain = this.props.z.domain
      }



      if (this.props.y) {
        if (!this.props.y.domain) {
          let min = 9999999999999999, max = -99999999999999999;
          for (let k = 0; k < zDomain.length; k++) {
            for (let i = 0; i < this.state.data.length; i++) {
              if (min > this.state.data[i][zDomain[k]]) {
                min = this.state.data[i][zDomain[k]]
              }
              if (max < this.state.data[i][zDomain[k]])
                max = this.state.data[i][zDomain[k]]
            }
          }
          yDomain = [min, max]
        } else
          yDomain = this.props.y.domain
      }

      console.log(xDomain, yDomain, zDomain)

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

      if (this.props.x.type === 'ordinal')
        xScale = d3.scaleOrdinal()
          .range(xRange)
          .domain(xDomain);
      else
        xScale = d3.scaleLinear()
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

      if (this.props.z.type === 'ordinal')
        zScale = d3.scaleOrdinal()
          .domain(zDomain)
          .range(zRange);
      else
        zScale = d3.scaleLinear()
          .domain(zDomain)
          .range(zRange);

      //Data Manipulation

      let dataCoordinate = [];

      for (let i = 0; i < this.state.data.length - 1; i++) {
        for (let j = 0; j < zDomain.length - 1; j++) {
          let tempData = [];
          tempData.push(this.state.data[i][this.props.x.field]);
          tempData.push(this.state.data[i][zDomain[j]]);
          tempData.push(zDomain[j]);
          tempData.push(this.state.data[i + 1][this.props.x.field]);
          tempData.push(this.state.data[i + 1][zDomain[j]]);
          tempData.push(zDomain[j]);
          tempData.push(this.state.data[i + 1][this.props.x.field]);
          tempData.push(this.state.data[i + 1][zDomain[j + 1]]);
          tempData.push(zDomain[j + 1]);
          tempData.push(this.state.data[i][this.props.x.field]);
          tempData.push(this.state.data[i][zDomain[j + 1]]);
          tempData.push(zDomain[j + 1]);
          /*
          if (this.props.mark.surface.style.fill.function)
            tempData.push(this.props.mark.surface.style.fill.function(i, j))
            */
          dataCoordinate.push(tempData);
        }
      }

      //Color Scale
      if (this.props.mark.mesh.style.fill.scale)
        if (this.props.mark.mesh.style.fill.domain)
          colorScale = d3.scaleLinear()
            .domain(this.props.mark.mesh.style.fill.domain)
            .range(this.props.mark.mesh.style.fill.color)
        else
          colorScale = d3.scaleLinear()
            .domain([d3.min(dataCoordinate, d => d[this.props.mark.mesh.style.fill.axis]), d3.max(dataCoordinate, d => d[this.props.mark.mesh.style.fill.axis])])
            .range(this.props.mark.mesh.style.fill.color)

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
      let marks, lineHorizontal, lineVertical;

      if (this.props.mark.mesh.style.stroke) {

        lineHorizontal = zDomain.map((d, i) => {
          let path = ''
          for (let j = 0; j < this.state.data.length; j++) {
            if (j !== this.state.data.length - 1)
              path = path + ` ${xScale(this.state.data[j][this.props.x.field])} ${yScale(this.state.data[j][d])} ${zScale(d)},`
            else
              path = path + ` ${xScale(this.state.data[j][this.props.x.field])} ${yScale(this.state.data[j][d])} ${zScale(d)}`
          }
          return <a-entity meshline={`lineWidth: ${this.props.mark.mesh.style.stroke.width}; path:${path}; color: ${this.props.mark.mesh.style.stroke.color}`}></a-entity>
        })

        lineVertical = this.state.data.map((d, i) => {
          let path = ''
          for (let j = 0; j < zDomain.length; j++) {
            if (j !== zDomain.length - 1)
              path = path + ` ${xScale(d[this.props.x.field])} ${yScale(d[zDomain[j]])} ${zScale(zDomain[j])},`
            else
              path = path + ` ${xScale(d[this.props.x.field])} ${yScale(d[zDomain[j]])} ${zScale(zDomain[j])}`
          }
          return <a-entity meshline={`lineWidth: ${this.props.mark.mesh.style.stroke.width}; path:${path}; color: ${this.props.mark.mesh.style.stroke.color}`}></a-entity>
        })
      }

      if (this.props.mark.mesh.style.fill.scale)
        marks = dataCoordinate.map((d, i) => <a-entity key={i} geometry={`primitive: planeFromVertices; vertices: ${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}`} material={`color: ${colorScale(d[this.props.mark.mesh.style.fill.axis])}; side: double; opacity: ${this.props.mark.mesh.style.fill.opacity}`} />);
      else
        marks = dataCoordinate.map((d, i) => <a-entity key={i} geometry={`primitive: planeFromVertices; vertices: ${xScale(d[0])} ${yScale(d[1])} ${zScale(d[2])}, ${xScale(d[3])} ${yScale(d[4])} ${zScale(d[5])}, ${xScale(d[6])} ${yScale(d[7])} ${zScale(d[8])}, ${xScale(d[9])} ${yScale(d[10])} ${zScale(d[11])}`} material={`color: ${this.props.mark.mesh.style.fill.color}; side: double; opacity: ${this.props.mark.mesh.style.fill.opacity}`} />);
      console.log(dataCoordinate)
      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
          {xAxis}
          {yAxis}
          {zAxis}
          {box}
          {marks}
          {lineHorizontal}
          {lineVertical}
        </a-entity>
      )
    }
  }
}
export default BarGraph