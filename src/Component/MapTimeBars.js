import React, { Component } from 'react';
import * as d3 from 'd3';
import * as moment from 'moment';

import ReadPLY from '../Utils/ReadPLY.js';
import Shape from './Shape.js';
import GetMapShape from '../Utils/GetMapShape';
import GetMapCoordinates from '../Utils/GetMapCoordinates';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';

class MapTimeBars extends Component {
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
      // Getting domain for axis

      let dataset = []
      for (let i = 0; i < this.state.data.length; i++) {
        for (let j = 0; j < this.props.mark.timeLayers.position.y.domain.length; j++) {
          dataset.push(this.state.data[i][this.props.mark.timeLayers.position.y.domain[j]])
        }
      }

      let min = d3.min(dataset), max = d3.max(dataset);

      // Getting domain
      let colorDomain, radiusDomain;

      if (!this.props.mark.timeLayers.style.radius.domain)
        if (this.props.mark.timeLayers.style.radius.startFromZero)
          radiusDomain = [0, max]
        else
          radiusDomain = [min, max]
      else
        radiusDomain = this.props.mark.timeLayers.style.radius.domain


      if (this.props.mark.timeLayers.style.fill.scaleType) {
        if (!this.props.mark.timeLayers.style.fill.domain) {
          if (this.props.mark.timeLayers.style.fill.startFromZero)
            colorDomain = [0, max]
          else
            colorDomain = [min, max]
        } else
          colorDomain = this.props.mark.timeLayers.style.fill.domain
      }
      //Adding Scale

      let colorScale, radiusScale;

      radiusScale = d3.scaleLinear()
        .domain(radiusDomain)
        .range(this.props.mark.timeLayers.style.radius.value)

      if (this.props.mark.timeLayers.style.fill.scaleType) {
        let colorRange = d3.schemeCategory10;
        if (this.props.mark.timeLayers.style.fill.color)
          colorRange = this.props.mark.timeLayers.style.fill.color
        colorScale = d3.scaleLinear()
          .domain(colorDomain)
          .range(colorRange)
      }

      //Drawing Map

      let extrusionHeight = this.props.mark.map.style.extrusion.value, extrusionArr = [], mapColorArray = [], boundingBox = [];
        
      let geoData = GetMapShape(this.props.mark.map.data, this.props.mark.projection, this.props.mark.mapScale, this.props.mark.mapOrigin, this.props.mark.map.shapeIdentifier, this.props.mark.map.shapeKey);

      let pointsArray = geoData.map((d, i) => {
        let points = d.vertices.split(', ')
        let pntArray = points.map(d => {
          let pnts = d.split(' ') 
          let obj = {'x':parseFloat(pnts[0]),'y':parseFloat(pnts[1])}
          return obj
        })
        extrusionArr.push(extrusionHeight)
        mapColorArray.push(this.props.mark.map.style.fill.color)

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

      let mapShape = <a-frame-map points={JSON.stringify(pointsArray)} stroke_bool={stroke} stroke_color={strokeColor} extrude={JSON.stringify(extrusionArr)} color={JSON.stringify(mapColorArray)} opacity={this.props.mark.map.style.fill.opacity} />
     

      let mapOutline = <a-frame-map-outline points={JSON.stringify(pointsArray)} stroke_bool={stroke} stroke_color={strokeColor} extrude={extrusionHeight}  />
      //Adding marks


      let marks = this.state.data.map((d, i) => {
        let markTemp = this.props.mark.timeLayers.position.y.domain.map((d1, j) => {
          let color = this.props.mark.timeLayers.style.fill.color
          if (this.props.mark.timeLayers.style.fill.scaleType)
            color = colorScale(d[d1])
          let coordinates = GetMapCoordinates(d[this.props.mark.timeLayers.position.x.field], d[this.props.mark.timeLayers.position.z.field], this.props.mark.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);
          let position = `${coordinates[0]} ${0 - coordinates[1]} ${(j + 1 / 2) * this.props.mark.timeLayers.style.height + j * this.props.mark.timeLayers.style.padding}`
          let radius = radiusScale(d[d1])

          let hoverText
          if (this.props.mark.timeLayers.mouseOver) {
            if (this.props.mark.timeLayers.mouseOver.label)
              hoverText = this.props.mark.timeLayers.mouseOver.label.value(d).replace('Label', `${d1}`).replace('LabelValue', `${d[d1]}`)
          }
          return <Shape
            key={`${j}`}
            type={this.props.mark.timeLayers.type}
            color={`${color}`}
            opacity={this.props.mark.timeLayers.style.fill.opacity}
            depth={`${radius}`}
            height={`${this.props.mark.timeLayers.style.height}`}
            width={`${radius}`}
            radius={`${radius}`}
            segments={`${this.props.mark.timeLayers.style.segments}`}
            position={position}
            hover={this.props.mark.timeLayers.mouseOver}
            hoverText={hoverText}
            graphID={this.props.index}
            rotation={'90 0 0'}
          />
        });
        return markTemp
      })


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
        <a-entity click-rotation={`enabled:${clickRotation}`} pivot-center={`xPosition:${this.props.style.origin[0]};yPosition:${this.props.style.origin[1]};zPosition:${this.props.style.origin[2]};pivotX:${this.props.style.xPivot};pivotY:${this.props.style.yPivot};pivotZ:${this.props.style.zPivot}`}  position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.mark.rotation} id={this.props.index}>
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
export default MapTimeBars