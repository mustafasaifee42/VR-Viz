import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import ReadPLY from '../Utils/ReadPLY.js';
import Axis from './Axis.js';
import AxisBox from './AxisBox.js';
import Shape from './Shape.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';


class LollipopChart extends Component {
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
      let xDomain, yDomain, zDomain, colorDomain, stemColorDomain, radiusDomain;

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


      if (this.props.mark.style.radius) {
        if (this.props.mark.style.radius.scaleType) {
          if (!this.props.mark.style.radius.domain) {
            radiusDomain = GetDomain(this.state.data, this.props.mark.style.radius.field, this.props.mark.style.radius.scaleType, this.props.mark.style.radius.startFromZero)
          } else
            radiusDomain = this.props.mark.style.radius.domain
        }
      }

      if (this.props.mark.style.fill) {
        if(this.props.mark.style.fill.scaleType)
          if (!this.props.mark.style.fill.domain) {
            colorDomain = GetDomain(this.state.data, this.props.mark.style.fill.field, this.props.mark.style.fill.scaleType, this.props.mark.style.fill.startFromZero)
          } else
            colorDomain = this.props.mark.style.fill.domain
      }

      if (this.props.mark.droplines.style.fill) {
        if(this.props.mark.droplines.style.fill.scaleType)
          if (!this.props.mark.droplines.style.fill.domain) {
            stemColorDomain = GetDomain(this.state.data, this.props.mark.droplines.style.fill.field, this.props.mark.droplines.style.fill.scaleType, this.props.mark.droplines.style.fill.startFromZero)
          } else
            stemColorDomain = this.props.mark.droplines.style.fill.domain
      }

      //Adding Scale

      let xScale, yScale, zScale, colorScale, stemColorScale, radiusScale, width, depth;

      if (this.props.mark.position.x.scaleType === 'ordinal') {
        xScale = d3.scaleBand()
          .range([0, this.props.style.dimensions.width])
          .domain(xDomain)
          .paddingInner(this.props.mark.style.padding.x);
        width = xScale.bandwidth();
      }
      yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([0, this.props.style.dimensions.height])

      if (this.props.mark.position.z.scaleType === 'ordinal') {
        zScale = d3.scaleBand()
          .domain(zDomain)
          .range([0, this.props.style.dimensions.depth])
          .paddingInner(this.props.mark.style.padding.z);
        depth = zScale.bandwidth();
      }

      let radius = depth / 2;
      if (depth > width)
        radius = width / 2;

      if (this.props.mark.style.radius.scaleType) {
        if (this.props.mark.style.radius.scaleType === 'ordinal')
          radiusScale = d3.scaleOrdinal()
            .domain(radiusDomain)
            .range(this.props.mark.style.radius.value)
        else
          radiusScale = d3.scaleLinear()
            .domain(radiusDomain)
            .range(this.props.mark.style.radius.value)
      }

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

      if (this.props.mark.droplines.style.fill.scaleType) {
        let colorRange = d3.schemeCategory10;
        if (this.props.mark.droplines.style.fill.color)
          colorRange = this.props.mark.droplines.style.fill.color;
        if (this.props.mark.droplines.style.fill.scaleType === 'ordinal')
          stemColorScale = d3.scaleOrdinal()
            .domain(stemColorDomain)
            .range(colorRange)
        else
          stemColorScale = d3.scaleLinear()
            .domain(stemColorDomain)
            .range(colorRange)
      }

      //Axis
      let xAxis, yAxis, zAxis;

      if (this.props.xAxis) {
        if ((this.props.mark.type == 'cylinder') || (this.props.mark.type == 'cone'))
          xAxis = <Axis
            domain={xDomain}
            tick={this.props.xAxis.ticks}
            scale={xScale}
            axis={'x'}
            orient={this.props.xAxis.orient}
            title={this.props.xAxis.title}
            dimensions={this.props.style.dimensions}
            scaleType={this.props.mark.position.x.scaleType}
            padding={radius * 2}
            grid={this.props.xAxis.grid}
          />
        else
          xAxis = <Axis
            domain={xDomain}
            tick={this.props.xAxis.ticks}
            scale={xScale}
            axis={'x'}
            orient={this.props.xAxis.orient}
            title={this.props.xAxis.title}
            dimensions={this.props.style.dimensions}
            scaleType={this.props.mark.position.x.scaleType}
            padding={width}
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
        if ((this.props.mark.type == 'cylinder') || (this.props.mark.type == 'cone'))
          zAxis = <Axis
            domain={zDomain}
            tick={this.props.zAxis.ticks}
            scale={zScale}
            axis={'z'}
            orient={this.props.zAxis.orient}
            title={this.props.zAxis.title}
            dimensions={this.props.style.dimensions}
            scaleType={this.props.mark.position.z.scaleType}
            padding={radius * 2}
            grid={this.props.zAxis.grid}
          />
        else
          zAxis = <Axis
            domain={zDomain}
            tick={this.props.zAxis.ticks}
            scale={zScale}
            axis={'z'}
            orient={this.props.zAxis.orient}
            title={this.props.zAxis.title}
            dimensions={this.props.style.dimensions}
            scaleType={this.props.mark.position.z.scaleType}
            padding={depth}
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

      let graphTitle;

      if (this.props.title) {
        graphTitle = <a-text color={this.props.title.color} wrapCount={this.props.title.wrapCount} lineHeight={this.props.title.lineHeight} width={this.props.title.width} value={this.props.title.value} anchor='align' side='double' align={this.props.title.align} position={this.props.title.position} rotation={this.props.title.rotation} />
      }

      //Adding marks
      let marks = this.state.data.map((d, i) => {
        let color = this.props.mark.style.fill.color
        if (this.props.mark.style.fill.scaleType) {
          color = colorScale(d[this.props.mark.style.fill.field])
        }
        let position = `${xScale(d[this.props.mark.position.x.field]) + width / 2} ${yScale(d[this.props.mark.position.y.field])} ${zScale(d[this.props.mark.position.z.field]) + depth / 2}`

        let hover, hoverText
        if (this.props.mark.mouseOver) {
          if (this.props.mark.mouseOver.label)
            hoverText = this.props.mark.mouseOver.label.value(d)
        }
        let radiusValue;
        if (this.props.mark.style.radius.scaleType) {
          radiusValue = radiusScale(d[this.props.mark.style.radius.field])
        }
        else
          radiusValue = this.props.mark.style.radius.value
        return <Shape
          key={i}
          type={this.props.mark.type}
          color={`${color}`}
          opacity={this.props.mark.style.fill.opacity}
          depth={`${radiusValue}`}
          height={`${radiusValue}`}
          width={`${radiusValue}`}
          radius={`${radiusValue}`}
          segments={`${this.props.mark.style.segments}`}
          position={position}
          hover={this.props.mark.mouseOver}
          hoverText={hoverText}
          graphID={this.props.index}
        />
      });
      let stem = this.state.data.map((d, i) => {
        let color = this.props.mark.droplines.style.fill.color
        if (this.props.mark.droplines.style.fill.scaleType) {
          color = stemColorScale(d[this.props.mark.droplines.style.fill.field])
        }
        let position = `${xScale(d[this.props.mark.position.x.field]) + width / 2} ${yScale(d[this.props.mark.position.y.field]) / 2} ${zScale(d[this.props.mark.position.z.field]) + depth / 2}`
        
        return <Shape
          key={i}
          type={'cylinder'}
          color={`${color}`}
          opacity={this.props.mark.droplines.style.fill.opacity}
          depth={`${this.props.mark.droplines.style.radius}`}
          height={`${yScale(d[this.props.mark.position.y.field])}`}
          width={`${this.props.mark.droplines.style.radius}`}
          radius={this.props.mark.droplines.style.radius}
          segments={`${this.props.mark.style.segments}`}
          position={position}
          hover={false}
          hoverText={''}
          graphID={this.props.index}
        />
      });
      console.log(this.props.mark.mouseOver)
      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation} id={this.props.index}>
          {stem}
          {marks}
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
export default LollipopChart