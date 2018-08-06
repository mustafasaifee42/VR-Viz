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
      let xDomain, yDomain, zDomain, colorDomain;

      if (this.props.mark.position.x) {
        if (!this.props.mark.position.x.domain) {
          xDomain = GetDomain(this.state.data, this.props.mark.position.x.field, this.props.mark.position.x.scaleType, this.props.mark.position.x.startFromZero)
        } else
          xDomain = this.props.mark.position.x.domain
      }

      console.log(xDomain)

      if (this.props.mark.position.y) {
        if (!this.props.mark.position.y.domain) {
          yDomain = GetDomain(this.state.data, this.props.mark.position.y.field, this.props.mark.position.y.scaleType, this.props.mark.position.y.startFromZero)
        } else
          yDomain = this.props.mark.position.y.domain
      }

      if (!this.props.mark.position.z.domain) {
        zDomain = GetDomain(this.state.data, this.props.mark.position.z.field, this.props.mark.position.z.scaleType, this.props.mark.position.z.startFromZero)
      } else
        zDomain = this.props.mark.position.z.domain

      //Adding Scale

      let xScale, yScale, zScale, colorScale;


      if (this.props.mark.position.x.scaleType === 'ordinal')
        xScale = d3.scaleBand()
          .range([0, this.props.style.dimensions.width])
          .domain(xDomain);
      else
        xScale = d3.scaleLinear()
          .range([0, this.props.style.dimensions.width])
          .domain(xDomain);

      if (this.props.mark.position.y.range)
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range(this.props.mark.position.y.range)
      else
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range([0, this.props.style.dimensions.height])

      zScale = d3.scaleLinear()
        .domain(zDomain)
        .range([0, this.props.style.dimensions.depth])

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
          domain={yDomain}
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
      let marks;
      let dataCoordinate = [], borderCoordinate = [];
      for (let i = 0; i < this.state.data.length - 1; i++) {
        let tempData = [];
        tempData.push(xScale(this.state.data[i][this.props.mark.position.x.field]));
        tempData.push(yScale(this.state.data[i][this.props.mark.position.y.field]));
        tempData.push(zScale(this.state.data[i][this.props.mark.position.z.field]));
        tempData.push(xScale(this.state.data[i + 1][this.props.mark.position.x.field]));
        tempData.push(yScale(this.state.data[i + 1][this.props.mark.position.y.field]));
        tempData.push(zScale(this.state.data[i + 1][this.props.mark.position.z.field]));
        tempData.push(xScale(this.state.data[i + 1][this.props.mark.position.x.field]));
        tempData.push(yScale(this.state.data[i + 1][this.props.mark.position.y.field]));
        tempData.push(0);
        tempData.push(xScale(this.state.data[i][this.props.mark.position.x.field]));
        tempData.push(yScale(this.state.data[i][this.props.mark.position.y.field]));
        tempData.push(0);
        dataCoordinate.push(tempData);
      }
      for (let i = 0; i < this.state.data.length; i++) {
        let tempData = [];
        tempData.push(xScale(this.state.data[i][this.props.mark.position.x.field]));
        tempData.push(yScale(this.state.data[i][this.props.mark.position.y.field]));
        tempData.push(zScale(this.state.data[i][this.props.mark.position.z.field]));
        borderCoordinate.push(tempData);
      }
      for (let i = this.state.data.length - 1; i >= 0; i--) {
        let tempData = [];
        tempData.push(xScale(this.state.data[i][this.props.mark.position.x.field]));
        tempData.push(yScale(this.state.data[i][this.props.mark.position.y.field]));
        tempData.push(0);
        borderCoordinate.push(tempData);
      }

      marks = dataCoordinate.map((d, i) => <a-entity key={i} geometry={`primitive: planeFromVertices; vertices: ${d[0]} ${d[1]} ${d[2]}, ${d[3]} ${d[4]} ${d[5]}, ${d[6]} ${d[7]} ${d[8]}, ${d[9]} ${d[10]} ${d[11]}`} material={`color: ${this.props.mark.style.fill.color}; side: double; opacity: ${this.props.mark.style.fill.opacity}`} />);

      let path = ''

      borderCoordinate.map((d, i) => {
        path = path + `${d[0]} ${d[1]} ${d[2]},`
      })

      path = path + `${borderCoordinate[0][0]} ${borderCoordinate[0][1]} ${borderCoordinate[0][2]}`

      let border
      if (this.props.mark.style.stroke)
        border = <a-entity meshline={`lineWidth: ${this.props.mark.style.stroke.width}; path:${path}; color:${this.props.mark.style.stroke.color}`} />;


      let graphTitle
      if (this.props.title) {
        graphTitle = <a-text color={this.props.title.color} wrapCount={this.props.title.wrapCount} lineHeight={this.props.title.lineHeight} width={this.props.title.width} value={this.props.title.value} anchor='align' side='double' align={this.props.title.align} position={this.props.title.position} rotation={this.props.title.rotation} />
      }
      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation} id={this.props.index}>
          {marks}
          {border}
          {xAxis}
          {yAxis}
          {zAxis}
          {graphTitle}
          {box}
        </a-entity>
      )
    }
  }
}
export default TimeSeries