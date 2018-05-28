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
    if (!this.state.data) {
      return <a-entity />
    }
    else {

      // Data manipulation

      const treemap = d3.treemap()
        .size([this.props.style.width, this.props.style.length])
        .paddingInner(this.props.mark.squares.style.paddingInner)
        .paddingOuter(this.props.mark.squares.style.paddingOuter);

      const root = d3.hierarchy(this.state.data, (d) => d.children)
        .sum((d) => d.size);

      const tree = treemap(root);

      let parent = []
      for (let i = 0; i < tree.leaves().length; i++) {
        if ((parent.indexOf(tree.leaves()[i].parent.data.name) == -1) && (tree.leaves()[i].parent.data.name !== null))
          parent.push(tree.leaves()[i].parent.data.name)
      }



      let heightDomain;
      if (!this.props.mark.squares.style.height.domain)
        heightDomain = [d3.min(tree.leaves(), d => d.data[this.props.mark.squares.style.height.field]), d3.max(tree.leaves(), d => d.data[this.props.mark.squares.style.height.field])]
      else
        heightDomain = this.props.mark.squares.style.height.domain


      let heightScale = d3.scaleLinear()
        .domain(heightDomain)
        .range(this.props.mark.squares.style.height.range);

      let color = d3.scaleOrdinal().range(this.props.mark.squares.style.fill.color).domain(parent);

      let marks = tree.leaves().map((d, i) => {
        let width = (d.x1 - d.x0).toFixed(3);
        let posX = (d.x0 + (d.x1 - d.x0) / 2).toFixed(3);
        let depth = (d.y1 - d.y0).toFixed(3);
        let posZ = (d.y0 + (d.y1 - d.y0) / 2).toFixed(3);
        let height = (heightScale(d.data[this.props.mark.squares.style.height.field])).toFixed(3);
        console.log(width, width / 2, width - width / 2)
        return <a-box id={`width${width}posX${posX}dx${d.x0}`} key={i} color={`${color(d.parent.data.name)}`} opacity={this.props.mark.squares.style.fill.opacity} depth={`${depth}`} height={`${height}`} width={`${width}`} position={`${posX} ${height / 2} ${posZ}`} />
      });
      return (
        <a-entity position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`}>
          {marks}
        </a-entity>
      )
    }
  }
}
export default StackedBarGraph