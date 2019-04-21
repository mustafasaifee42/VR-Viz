import React, { Component } from 'react';
import * as d3 from 'd3';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import ReadPLY from '../Utils/ReadPLY.js';
import Shape from './Shape.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';


class PointCloud extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }


  startAnimation = () => {
      d3.select(`#${this.props.index}`)
        .transition()
        .duration(this.props.animateRotation.duration)
        .ease(d3.easeLinear)
        .attrTween("rotation", () => d3.interpolate(`${this.props.animateRotation.initialAngles[0]} ${this.props.animateRotation.initialAngles[1]} ${this.props.animateRotation.initialAngles[2]}`, `${this.props.animateRotation.finalAngles[0]} ${this.props.animateRotation.finalAngles[1]} ${this.props.animateRotation.finalAngles[2]}`));
  }
  componentDidUpdate(){
    if(this.state.data){
      if(this.props.animateRotation) {
        this.startAnimation();
        window.setInterval(this.startAnimation, this.props.animateRotation.duration);
      }
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
          let data = this.props.data.dataFile
          this.setState({
            data: data,
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
      let colorDomain;

      if (this.props.mark.style.fill.scaleType) {
        if (!this.props.mark.style.fill.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.style.fill.field, this.props.mark.style.fill.scaleType, this.props.mark.style.fill.startFromZero)
        } else
          colorDomain = this.props.mark.style.fill.domain
      }

      //Adding Scale

      let colorScale;

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
      let marks = this.state.data.map((d, i) => {
        let color = this.props.mark.style.fill.color
        if ((!d.r) || (!d.g) || (!d.b)) {
          if (this.props.mark.style.fill.scaleType)
            color = colorScale(d[this.props.mark.style.fill.field])
        }
        else
          color = `rgb(${d.r},${d.g},${d.b})`

        let position = `${d.x * this.props.style.objectScale} ${d.y * this.props.style.objectScale} ${d.z * this.props.style.objectScale}`
        let shape;
        if (this.props.mark.type)
          shape = this.props.mark.type
        else
          shape = 'sphere'

        let radius = this.props.mark.style.radius;

        let hoverText
        if (this.props.mark.mouseOver) {
          if (this.props.mark.mouseOver.label)
            hoverText = this.props.mark.mouseOver.label.value(d)
        }
        return <Shape
          key={`${this.props.index}_Shape${i}`}
          type={shape}
          color={`${color}`}
          opacity={this.props.mark.style.fill.opacity}
          depth={`${radius}`}
          height={`${radius}`}
          width={`${radius}`}
          radius={`${radius}`}
          position={position}
          hover={this.props.mark.mouseOver}
          hoverText={hoverText}
          graphID={this.props.index}
        />
      });

      let graphTitle
      if (this.props.title) {
        graphTitle = <a-text color={this.props.title.color} wrapCount={this.props.title.wrapCount} lineHeight={this.props.title.lineHeight} width={this.props.title.width} value={this.props.title.value} anchor='align' side='double' align={this.props.title.align} position={this.props.title.position} rotation={this.props.title.rotation} />
      }
      let pivot
      if(this.props.style.pivot)
        pivot = this.props.style.pivot;
      else
        pivot = `${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`
      return (
        <a-entity pivot={pivot} position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation} id={this.props.index}>
          {marks}
          {graphTitle}
        </a-entity>
      )
    }
  }
}
export default PointCloud