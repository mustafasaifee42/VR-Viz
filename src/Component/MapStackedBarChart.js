import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';
import * as THREE from 'three';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import GetMapShape from '../Utils/GetMapShape';
import GetMapCoordinates from '../Utils/GetMapCoordinates';
import ReadPLY from '../Utils/ReadPLY.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';

class MapStackedBarChart extends Component {
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


      // Data manipulation

      let data = d3.stack().keys(this.props.mark.bars.style.fill.field)(this.state.data), max = 0;
      let dataset = []
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          dataset.push(data[i][j])
        }
      }
      for (let i = 0; i < dataset.length; i++) {
        if (max < dataset[i][1]) {
          max = dataset[i][1]
        }
      }

      // Getting domain
      let colorDomain, heightDomain;

      if (!this.props.mark.bars.style.height.domain)
        heightDomain = [0, max]
      else
        heightDomain = this.props.mark.bars.style.height.domain


      if (this.props.mark.bars.style.fill.scaleType) {
        if (!this.props.mark.bars.style.fill.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.bars.style.fill.field, this.props.mark.bars.style.fill.scaleType, this.props.mark.bars.style.fill.startFromZero)
        } else
          colorDomain = this.props.mark.bars.style.fill.domain
      }

      //Adding scales

      let colorScale, yScale;

      console.log(heightDomain)

      yScale = d3.scaleLinear()
        .domain(heightDomain)
        .range(this.props.mark.bars.style.height.value)

      if (this.props.mark.bars.style.fill.scaleType) {
        let colorRange = d3.schemeCategory10;
        if (this.props.mark.bars.style.fill.color)
          colorRange = this.props.mark.bars.style.fill.color
        if (this.props.mark.bars.style.fill.scaleType === 'ordinal')
          colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(colorRange)
        else
          colorScale = d3.scaleLinear()
            .domain(colorDomain)
            .range(colorRange)
      }


      //Drawing Map

      let geoData = GetMapShape(this.props.mark.map.data, this.props.mark.projection, this.props.mark.mapScale, this.props.mark.mapOrigin, this.props.mark.map.shapeIdentifier, this.props.mark.map.shapeKey);

      let shapes = geoData.map((d, i) => {
        let primitive = `primitive: map; vertices: ${d.vertices}; extrude: ${this.props.mark.map.style.extrusion.value}`;
        return (<a-entity geometry={primitive} material={`color: ${this.props.mark.map.style.fill.color}; metalness: 0.2; opacity:${this.props.mark.map.style.fill.opacity}`} />)
      })

      let border;
      if (this.props.mark.map.style.stroke)
        border = geoData.map((d, i) => <a-entity meshline={`lineWidth: ${this.props.mark.map.style.stroke.width}; path:${`${d.vertices.replace(/,/g, " 0,")} 0`}; color:${this.props.mark.map.style.stroke.color}`} />);

      //Adding Bars

      let marks;

      switch (this.props.mark.bars.type) {
        case 'box':
          {
            marks = data.map((d, i) => {
              let markTemp = d.map((d1, j) => {
                let position = GetMapCoordinates(d1.data.longitude, d1.data.latitude, this.props.mark.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);
                let hght = yScale(d1[1] - d1[0]);
                if (hght == 0) {
                  hght = 0.000000000001;
                }
                return <a-box key={i} color={`${this.props.mark.bars.style.fill.color[i]}`} opacity={this.props.mark.bars.style.fill.opacity} height={`${this.props.mark.bars.style.depth}`} depth={`${hght}`} width={`${this.props.mark.bars.style.width}`} position={`${position[0]} ${0 - position[1]} ${yScale(d1[0]) + hght / 2}`} />
              })
              return markTemp
            });
            break;
          }
        case 'cylinder':
          {
            marks = data.map((d, i) => {
              let markTemp = d.map((d1, j) => {
                let position = GetMapCoordinates(d1.data.longitude, d1.data.latitude, this.props.mark.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);
                let hght = yScale(d1[1] - d1[0]);
                if (hght == 0) {
                  hght = 0.000000000001;
                }
                return <a-cylinder key={i} opacity={this.props.mark.bars.style.fill.opacity} color={`${this.props.mark.bars.style.fill.color[i]}`} height={`${hght}`} radius={`${this.props.mark.bars.style.radius}`} segments-radial={`${this.props.mark.bars.style.segments}`} position={`${position[0]} ${0 - position[1]} ${yScale(d1[0]) + hght / 2}`} rotation={'90 0 0'} />
              })
              return markTemp
            });
            break;
          }
        default:
          {
            marks = data.map((d, i) => {
              let markTemp = d.map((d1, j) => {
                let position = GetMapCoordinates(d1.data.longitude, d1.data.latitude, this.props.mark.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);
                let hght = yScale(d1[1] - d1[0]);
                if (hght == 0) {
                  hght = 0.000000000001;
                }
                return <a-box key={i} color={`${this.props.mark.bars.style.fill.color[i]}`} opacity={this.props.mark.bars.style.fill.opacity} height={`${this.props.mark.bars.style.depth}`} depth={`${hght}`} width={`${this.props.mark.bars.style.width}`} position={`${position[0]} ${0 - position[1]} ${yScale(d1[0]) + hght / 2}`} />
              })
              return markTemp
            });
            break;
          }
      }

      return (
        <a-entity rotation={this.props.mark.rotation} position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
          {shapes}
          {border}
          {marks}
        </a-entity>
      )
    }
  }
}
export default MapStackedBarChart