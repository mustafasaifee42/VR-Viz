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

class MapBarChart extends Component {
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

      // Getting domain
      console.log(this.state.data)
      let colorDomain, elevationDomain;

      if (this.props.mark.isoLines.style.stroke.scaleType) {
        if (!this.props.mark.isoLines.style.stroke.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.isoLines.style.stroke.field, this.props.mark.isoLines.style.stroke.scaleType, this.props.mark.isoLines.style.stroke.startFromZero)
        } else
          colorDomain = this.props.mark.isoLines.style.stroke.domain
      }

      if (this.props.mark.isoLines.elevation) {
        if (!this.props.mark.isoLines.elevation.domain) {
          elevationDomain = GetDomain(this.state.data, this.props.mark.isoLines.elevation.field, this.props.mark.isoLines.elevation.scaleType, this.props.mark.isoLines.elevation.startFromZero)
        } else
          elevationDomain = this.props.mark.isoLines.elevation.domain
      }

      //Adding scales

      let colorScale, elevationScale;

      if (this.props.mark.isoLines.style.stroke.scaleType) {
        let colorRange = d3.schemeCategory10;
        if (this.props.mark.isoLines.style.stroke.color)
          colorRange = this.props.mark.isoLines.style.stroke.color
        if (this.props.mark.isoLines.style.stroke.scaleType === 'ordinal')
          colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(colorRange)
        else
          colorScale = d3.scaleLinear()
            .domain(colorDomain)
            .range(colorRange)
      }

      elevationScale = d3.scaleLinear()
        .domain(elevationDomain)
        .range(this.props.mark.isoLines.elevation.value)

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
      marks = this.state.data.map((d, i) => {
        let path = ''
        for (let j = 0; j < d.geojson.geometry.coordinates.length; j++) {
          let position = GetMapCoordinates(d.geojson.geometry.coordinates[j][0], d.geojson.geometry.coordinates[j][1], this.props.mark.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);
          if (j !== d.geojson.geometry.coordinates.length - 1)
            path = path + ` ${position[0]} ${0 - position[1]} ${elevationScale(d[this.props.mark.isoLines.elevation.field])},`
          else
            path = path + ` ${position[0]} ${0 - position[1]} ${elevationScale(d[this.props.mark.isoLines.elevation.field])}`
        }
        if (this.props.mark.isoLines.style.stroke.scaleType)
          return <a-entity meshline={`lineWidth: ${this.props.mark.isoLines.style.stroke.width}; path:${path}; color: ${colorScale(d[this.props.mark.isoLines.style.stroke.field])}`}></a-entity>
        else
          return <a-entity meshline={`lineWidth: ${this.props.mark.isoLines.style.stroke.width}; path:${path}; color: ${this.props.mark.isoLines.style.stroke.color}`}></a-entity>
      })

      let graphTitle
      if (this.props.title) {
        graphTitle = <a-text color={this.props.title.color} wrapCount={this.props.title.wrapCount} lineHeight={this.props.title.lineHeight} width={this.props.title.width} value={this.props.title.value} anchor='align' side='double' align={this.props.title.align} position={this.props.title.position} rotation={this.props.title.rotation} />
      }
      return (
        <a-entity rotation={this.props.mark.rotation} position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} id={this.props.index}>
          {shapes}
          {border}
          {graphTitle}
          {marks}
        </a-entity>
      )
    }
  }
}
export default MapBarChart