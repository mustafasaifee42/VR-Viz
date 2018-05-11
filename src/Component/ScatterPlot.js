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

class ScatterPlot extends Component {
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
      let xDomain, yDomain, zDomain, colorDomain, radiusDomain;

      if (!this.props.x.domain)
        xDomain = GetDomain(this.state.data, this.props.x.field, this.props.x.type)
      else
        xDomain = this.props.x.domain


      if (!this.props.y.domain)
        yDomain = GetDomain(this.state.data, this.props.y.field, this.props.y.type)
      else
        yDomain = this.props.y.domain


      if (!this.props.z.domain)
        zDomain = GetDomain(this.state.data, this.props.z.field, this.props.z.type)
      else
        zDomain = this.props.z.domain


      if (this.props.mark.points.style.color.scale) {
        if (!this.props.mark.points.style.color.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.points.style.color.field, this.props.mark.points.style.color.type)
        } else
          colorDomain = this.props.mark.points.style.color.domain
      }

      if (this.props.mark.points.style.radius.scale){
        if (!this.props.mark.points.style.radius.domain) {
          radiusDomain = [0, d3.max(this.state.data, d => d[this.props.mark.points.style.radius.field])]
        } else
          radiusDomain = this.props.mark.points.style.radius.domain
      }


      //Adding scales

      let xScale, yScale, zScale, colorScale, radiusScale;

      if (this.props.x.range)
        xScale = d3.scaleLinear()
          .domain(xDomain)
          .range(this.props.x.range)
      else
        xScale = d3.scaleLinear()
          .domain(xDomain)
          .range([0, this.props.style.dimensions.width])

      if (this.props.y.range)
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range(this.props.y.range)
      else
        yScale = d3.scaleLinear()
          .domain(yDomain)
          .range([0, this.props.style.dimensions.height])

      if (this.props.z.range)
        zScale = d3.scaleLinear()
          .domain(zDomain)
          .range(this.props.z.range)
      else
        zScale = d3.scaleLinear()
          .domain(zDomain)
          .range([0, this.props.style.dimensions.depth])

      if (this.props.mark.points.style.color.scale)
        if (this.props.mark.points.style.color.scaleType === 'ordinal')
          colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(this.props.mark.points.style.color.fill)
        else
          colorScale = d3.scaleLinear()
            .domain(colorDomain)
            .range(this.props.mark.points.style.color.fill)


      if (this.props.mark.points.style.radius.scale)
        radiusScale = d3.scaleLinear()
          .domain(radiusDomain)
          .range(this.props.mark.points.style.radius.value)

      //Axis
      let xAxis, yAxis, zAxis;

      if (this.props.x.axis.axis) {
        xAxis = <Axis
          tickValues={xScale.ticks(this.props.x.axis.ticks['no-of-ticks'])}
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
          tickValues={zScale.ticks(this.props.z.axis.ticks['no-of-ticks'])}
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

      console.log(colorDomain)

      //Adding mark
      
      let mark;
      switch (this.props.mark.type) {
        case 'box':
          {
            mark = this.state.data.map((d, i) => {
              if (this.props.mark.points.style.color.scale) {
                if (this.props.mark.points.style.radius.scale)
                  return <a-box key={i} color={`${colorScale(d[this.props.mark.points.style.color.field])}`} opacity={this.props.mark.points.style.opacity} depth={`${radiusScale(d[this.props.mark.points.style.radius.field])}`} height={`${radiusScale(d[this.props.mark.points.style.radius.field])}`} width={`${radiusScale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-box key={i} color={`${colorScale(d[this.props.mark.points.style.color.field])}`} opacity={this.props.mark.points.style.opacity} depth={this.props.mark.points.style.radius.value} height={this.props.mark.points.style.radius.value} width={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              } else {
                if (this.props.mark.points.style.radius.scale)
                  return <a-box key={i} color={`${this.props.mark.points.style.color.fill}`} opacity={this.props.mark.points.style.opacity} depth={`${radiusScale(d[this.props.mark.points.style.radius.field])}`} height={`${radiusScale(d[this.props.mark.points.style.radius.field])}`} width={`${radiusScale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-box key={i} color={`${this.props.mark.points.style.color.fill}`} opacity={this.props.mark.points.style.opacity} depth={this.props.mark.points.style.radius.value} height={this.props.mark.points.style.radius.value} width={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              }
            });
            break;
          }
        case 'sphere':
          {
            mark = this.state.data.map((d, i) => {
              if (this.props.mark.points.style.color.scale) {
                if (this.props.mark.points.style.radius.scale)
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${colorScale(d[this.props.mark.points.style.color.field])}`} radius={`${radiusScale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${colorScale(d[this.props.mark.points.style.color.field])}`} radius={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              } else {
                if (this.props.mark.points.style.radius.scale)
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${this.props.mark.points.style.color.fill}`} radius={`${radiusScale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${this.props.mark.points.style.color.fill}`} radius={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              }
            });
            break;
          }
        default:
          {
            mark = this.state.data.map((d, i) => {
              if (this.props.mark.points.style.color.scale) {
                if (this.props.mark.points.style.radius.scale)
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${colorScale(d[this.props.mark.points.style.color.field])}`} radius={`${radiusScale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${colorScale(d[this.props.mark.points.style.color.field])}`} radius={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              } else {
                if (this.props.mark.points.style.radius.scale)
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${this.props.mark.points.style.color.fill}`} radius={`${radiusScale(d[this.props.mark.points.style.radius.field])}`} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
                else
                  return <a-sphere key={i} opacity={this.props.mark.points.style.opacity} color={`${this.props.mark.points.style.color.fill}`} radius={this.props.mark.points.style.radius.value} position={`${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}`} />
              }
            });
            break;
          }
      }

      // Adding Droplines

      let droplines_xz, droplines_yz, droplines_xy;
      if(this.props.mark.droplines) {
        if(this.props.mark.droplines.xz)
          droplines_xz = this.state.data.map((d, i) => {
            let col = this.props.mark.droplines.style.color.fill
            if(this.props.mark.droplines.style.color.scale)
              col = colorScale(d[this.props.mark.droplines.style.color.field])
            return <a-entity line={`start:${xScale(d[this.props.x.field])}, 0, ${zScale(d[this.props.z.field])}; end:${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}; opacity:${this.props.mark.droplines.style.opacity}; color:${col}`} />
          })

        if(this.props.mark.droplines.xy)
          droplines_xy = this.state.data.map((d, i) => {
            let col = this.props.mark.droplines.style.color.fill
            if(this.props.mark.droplines.style.color.scale)
              col = colorScale(d[this.props.mark.droplines.style.color.field])
            return <a-entity line={`start:${xScale(d[this.props.x.field])}, ${yScale(d[this.props.y.field])}, 0; end:${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}; opacity:${this.props.mark.droplines.style.opacity}; color:${col}`} />
        })

        if(this.props.mark.droplines.yz)
          droplines_yz = this.state.data.map((d, i) => {
            let col = this.props.mark.droplines.style.color.fill
            if(this.props.mark.droplines.style.color.scale)
              col = colorScale(d[this.props.mark.droplines.style.color.field])
            return <a-entity line={`start:0, ${yScale(d[this.props.y.field])}, ${zScale(d[this.props.z.field])}; end:${xScale(d[this.props.x.field])} ${yScale(d[this.props.y.field])} ${zScale(d[this.props.z.field])}; opacity:${this.props.mark.droplines.style.opacity}; color:${col}`} />
          })
      }
      
      // Adding Projections

      let projections_xz, projections_yz, projections_xy;
      
      if(this.props.mark.projections) {
        if(this.props.mark.projections.xz)
          projections_xz = this.state.data.map((d, i) => {
            let col = this.props.mark.projections.style.color.fill, rad = this.props.mark.projections.style.radius.value
            if(this.props.mark.projections.style.radius.scale)
              rad = radiusScale(d[this.props.mark.projections.style.radius.field])
            if(this.props.mark.projections.style.color.scale)
              col = colorScale(d[this.props.mark.projections.style.color.field])
            return <a-circle position={`${xScale(d[this.props.x.field])}, 0, ${zScale(d[this.props.z.field])}`} opacity={this.props.mark.projections.style.opacity} color={`${col}`} radius={rad} rotation='-90 0 0'/>
          })

        if(this.props.mark.projections.xy)
          projections_xy = this.state.data.map((d, i) => {
            let col = this.props.mark.projections.style.color.fill, rad = this.props.mark.projections.style.radius.value
            if(this.props.mark.projections.style.radius.scale)
              rad = radiusScale(d[this.props.mark.projections.style.radius.field])
            if(this.props.mark.projections.style.color.scale)
              col = colorScale(d[this.props.mark.projections.style.color.field])
            return <a-circle position={`${xScale(d[this.props.x.field])}, ${yScale(d[this.props.y.field])}, 0`} opacity={this.props.mark.projections.style.opacity} color={`${col}`} radius={rad} rotation='0 0 0'/>
        })

        if(this.props.mark.projections.yz)
          projections_yz = this.state.data.map((d, i) => {
            let col = this.props.mark.projections.style.color.fill, rad = this.props.mark.projections.style.radius.value
            if(this.props.mark.projections.style.radius.scale)
              rad = radiusScale(d[this.props.mark.projections.style.radius.field])
            if(this.props.mark.projections.style.color.scale)
              col = colorScale(d[this.props.mark.projections.style.color.field])
            return <a-circle position={`0, ${yScale(d[this.props.y.field])}, ${zScale(d[this.props.z.field])}`} opacity={this.props.mark.projections.style.opacity} color={`${col}`} radius={rad} rotation='0 90 0'/>
          })
      }

      return (
        <a-entity position = {`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
          {mark}
          {droplines_xy}
          {droplines_xz}
          {droplines_yz}
          {projections_xy}
          {projections_xz}
          {projections_yz}
          {xAxis}
          {yAxis}
          {zAxis}
          {box}
        </a-entity>
      )
    }
  }
}
export default ScatterPlot