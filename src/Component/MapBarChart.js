import React, { Component } from 'react';
import * as d3 from 'd3';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import GetMapShape from '../Utils/GetMapShape';
import GetMapCoordinates from '../Utils/GetMapCoordinates';
import ReadPLY from '../Utils/ReadPLY.js';
import Shape from './Shape.js';

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

      // Getting domain
      let colorDomain, heightDomain;

      if (!this.props.mark.bars.style.height.domain) {
        heightDomain = GetDomain(this.state.data, this.props.mark.bars.style.height.field, this.props.mark.bars.style.height.scaleType, this.props.mark.bars.style.height.startFromZero)
      } else
        heightDomain = this.props.mark.bars.style.height.domain


      if (this.props.mark.bars.style.fill.scaleType) {
        if (!this.props.mark.bars.style.fill.domain) {
          colorDomain = GetDomain(this.state.data, this.props.mark.bars.style.fill.field, this.props.mark.bars.style.fill.scaleType, this.props.mark.bars.style.fill.startFromZero)
        } else
          colorDomain = this.props.mark.bars.style.fill.domain
      }

      //Adding scales

      let colorScale, heightScale;

      heightScale = d3.scaleLinear()
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


      let extrusionHeight = this.props.mark.map.style.extrusion.value, extrusionArr = [], colorArray = [], boundingBox = [];
        
      let geoData = GetMapShape(this.props.mark.map.data, this.props.mark.projection, this.props.mark.mapScale, this.props.mark.mapOrigin, this.props.mark.map.shapeIdentifier, this.props.mark.map.shapeKey);

      let pointsArray = geoData.map((d, i) => {
        let points = d.vertices.split(', ')
        let pntArray = points.map(d => {
          let pnts = d.split(' ') 
          let obj = {'x':parseFloat(pnts[0]),'y':parseFloat(pnts[1])}
          return obj
        })
        extrusionArr.push(extrusionHeight)
        colorArray.push(this.props.mark.map.style.fill.color)

        let min = {"x": d3.min(pntArray, d => d["x"]), "y": d3.min(pntArray, d => d["y"])}
        let max = {"x": d3.max(pntArray, d => d["x"]), "y": d3.max(pntArray, d => d["y"])}
        let box = <a-box key ={i} width={max.x - min.x} height={max.y - min.y} depth={extrusionHeight} position={`${(max.x + min.x) / 2} ${(max.y + min.y) / 2} ${extrusionHeight / 2}`} opacity={0}/>
        boundingBox.push(box)
        return pntArray
      })
      
      let stroke = false, strokeColor = '#000000'
      if (this.props.mark.map.style.stroke){
        stroke = true;
        strokeColor = this.props.mark.map.style.stroke.color
      }

      let mapShape = <a-frame-map points={JSON.stringify(pointsArray)} stroke_bool={stroke} stroke_color={strokeColor} extrude={JSON.stringify(extrusionArr)} color={JSON.stringify(colorArray)} opacity={this.props.mark.map.style.fill.opacity} />
    

      let mapOutline = <a-frame-map-outline points={JSON.stringify(pointsArray)} stroke_bool={stroke} stroke_color={strokeColor} extrude={extrusionHeight}  />
      
      //Adding Bars
      let marks = this.state.data.map((d, i) => {
        let hght = heightScale(d[this.props.mark.bars.style.height.field])
        if (hght === 0) {
          hght = 0.000000000001;
        }
        let color = this.props.mark.bars.style.fill.color
        if (this.props.mark.bars.style.fill.scaleType) {
          color = colorScale(d[this.props.mark.bars.style.fill.field])
        }
        let coordinates = GetMapCoordinates(d.longitude, d.latitude, this.props.mark.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);
        let position = `${coordinates[0]} ${0 - coordinates[1]} ${hght / 2}`

        let hoverText
        if (this.props.mark.bars.mouseOver) {
          if (this.props.mark.bars.mouseOver.label)
            hoverText = this.props.mark.bars.mouseOver.label.value(d)
        }
        let className = 'clickable', idName
        if (typeof this.props.mark.bars.class === "function"){
          className =  `clickable ${this.props.mark.class(d,i)}`
        }
        if (typeof this.props.mark.id === "function"){
          idName =  this.props.mark.bars.id(d,i)
        }
        return <Shape
          key={`${this.props.index}_Shape${i}`}
          type={this.props.mark.bars.type}
          color={`${color}`}
          opacity={this.props.mark.bars.style.fill.opacity}
          depth={`${this.props.mark.bars.style.depth}`}
          height={`${hght}`}
          width={`${this.props.mark.bars.style.width}`}
          radius={`${this.props.mark.bars.style.radius}`}
          segments={`${this.props.mark.bars.style.segments}`}
          position={position}
          hover={this.props.mark.bars.mouseOver}
          hoverText={hoverText}
          graphID={this.props.index}
          rotation={'90 0 0'}
          class={className}
          id={idName}
          data={JSON.stringify(d)}
        />
      });
      let  clickRotation = 'false',animation;
      if(this.props.rotationOnDrag)
        clickRotation = 'true'
      if(this.props.animateRotation){
        clickRotation='false'
        animation  = <a-animation
            attribute="rotation"
            easing="linear"
            dur={`${this.props.animateRotation.duration}`}
            from={this.props.animateRotation.initialAngles}
            to={this.props.animateRotation.finalAngles}
            repeat="indefinite"
          />
      }
      return (
        <a-entity click-rotation={`enabled:${clickRotation}`} pivot-center={`xPosition:${this.props.style.origin[0]};yPosition:${this.props.style.origin[1]};zPosition:${this.props.style.origin[2]};pivotX:${this.props.style.xPivot};pivotY:${this.props.style.yPivot};pivotZ:${this.props.style.zPivot}`}  rotation={this.props.mark.rotation} position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} id={this.props.index}>
          {animation}
          {mapShape}
          {mapOutline}
          {marks}
          {boundingBox}
        </a-entity>
      )
    }
  }
}
export default MapBarChart