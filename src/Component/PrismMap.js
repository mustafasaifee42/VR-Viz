import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';
import * as THREE from 'three';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import GetMapShape from '../Utils/GetMapShape';
import ReadPLY from '../Utils/ReadPLY.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';

AFRAME.registerGeometry('map', {
  schema: {
    vertices: {
      default: ['-10 10 0', '-10 -10 0', '10 -10 0', '10 10 0'],
    },
    extrude: {
      default: 1,
    }
  },

  init: function (data) {
    let vertex
    vertex = data.vertices.map(function (vertex) {
      var points = vertex.split(' ').map(function (x) { return parseFloat(x); });
      return ([points[0], points[1]]);
    });
    var shape = new THREE.Shape();
    shape.moveTo(vertex[0][0], vertex[0][1]);

    for (let i = 1; i < vertex.length; i++) {
      shape.lineTo(vertex[i][0], vertex[i][1])
    }

    var extrudeSettings = {
      steps: 1,
      amount: parseFloat(data.extrude),
      bevelEnabled: false,
    };

    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    this.geometry = geometry;
  }
});

class PrismMap extends Component {
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

      // Data Manipulation

      let data = {}
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.props.mark.style.fill.scaleType)
          data[this.state.data[i][this.props.mark.shapeIdentifier]] = { 'value': this.state.data[i][this.props.mark.style.extrusion.field], 'colorField': this.state.data[i][this.props.mark.style.fill.field] }
        else
          data[this.state.data[i][this.props.mark.shapeIdentifier]] = { 'value': this.state.data[i][this.props.mark.style.extrusion.field], 'colorField': 'NA' }
      }

      // Getting domain
      let colorDomain, extrusionDomain;

      if (this.props.mark.style.extrusion.scaleType) {
        if (!this.props.mark.style.extrusion.domain) {
          extrusionDomain = GetDomain(this.state.data, this.props.mark.style.extrusion.field, this.props.mark.style.extrusion.scaleType, this.props.mark.style.extrusion.startFromZero)
        } else
          extrusionDomain = this.props.mark.style.extrusion.domain
      }

      if (this.props.mark.style.fill.scaleType) {
        if (!this.props.mark.style.fill.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.style.fill.field, this.props.mark.style.fill.scaleType, this.props.mark.style.fill.startFromZero)
        } else
          colorDomain = this.props.mark.style.fill.domain
      }

      //Adding scales

      let colorScale, extrusionScale;

      extrusionScale = d3.scaleLinear()
        .domain(extrusionDomain)
        .range(this.props.mark.style.extrusion.value)

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

      //Adding marks

      let geoData = GetMapShape(this.props.mark.data, this.props.mark.projection, this.props.mark.mapScale, this.props.mark.mapOrigin, this.props.mark.shapeIdentifier, this.props.mark.shapeKey);

      let shapes = geoData.map((d, i) => {
        let extrusionHeight = extrusionScale(data[d['code']]['value'])
        if (extrusionHeight == 0)
          extrusionHeight = 0.000000000001;
        let primitive = `primitive: map; vertices: ${d.vertices}; extrude: ${extrusionHeight}`
        if (this.props.mark.style.fill.scaleType)
          return (<a-entity geometry={primitive} material={`color: ${colorScale(data[d['code']]['colorField'])}; metalness: 0.2; opacity:${this.props.mark.style.fill.opacity}`} />)
        else
          return (<a-entity geometry={primitive} material={`color: ${this.props.mark.style.fill.color}; metalness: 0.2; opacity:${this.props.mark.style.fill.opacity}`} />)
      })

      let border;
      if (this.props.mark.style.stroke)
        border = geoData.map((d, i) => <a-entity meshline={`lineWidth: ${this.props.mark.style.stroke.width}; path:${`${d.vertices.replace(/,/g, ` ${extrusionScale(data[d['code']]['value'])},`)} ${extrusionScale(data[d['code']]['value'])}`}; color:${this.props.mark.style.stroke.color}`} />);

      let graphTitle
      if (this.props.title) {
        graphTitle = <a-text color={this.props.title.color} wrapCount={this.props.title.wrapCount} lineHeight={this.props.title.lineHeight} width={this.props.title.width} value={this.props.title.value} anchor='align' side='double' align={this.props.title.align} position={this.props.title.position} rotation={this.props.title.rotation} />
      }
      return (
        <a-entity rotation={this.props.mark.rotation} position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} id={this.props.index}>
          {shapes}
          {border}
          {graphTitle}
        </a-entity>
      )
    }
  }
}
export default PrismMap