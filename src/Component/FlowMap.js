import React, { Component } from 'react';
import * as d3 from 'd3';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import GetMapShape from '../Utils/GetMapShape';
import GetMapCoordinates from '../Utils/GetMapCoordinates';
import ReadPLY from '../Utils/ReadPLY.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';

class FlowMap extends Component {
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

      let colorDomain;
      if (this.props.mark.flowlines.style.stroke.scaleType) {
        if (!this.props.mark.flowlines.style.stroke.color) {
          colorDomain = GetDomain(this.state.data, this.props.mark.flowlines.style.stroke.field, this.props.mark.flowlines.style.stroke.scaleType, this.props.mark.flowlines.style.stroke.startFromZero)
        } else
          colorDomain = this.props.mark.flowlines.style.stroke.color
      }

      //Adding scales

      let colorScale;

      if (this.props.mark.flowlines.style.stroke.scaleType) {
        let colorRange = d3.schemeCategory10;
        if (this.props.mark.flowlines.style.stroke.color)
          colorRange = this.props.mark.flowlines.style.stroke.color;
        if (this.props.mark.flowlines.style.stroke.scaleType === 'ordinal')
          colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(colorRange)
        else
          colorScale = d3.scaleLinear()
            .domain(colorDomain)
            .range(colorRange)
      }


      //Drawing Map
      let extrusionArr = [], colorArray = [], boundingBox = [];
      let geoData = GetMapShape(this.props.mark.map.data, this.props.mark.map.projection, this.props.mark.mapScale, this.props.mark.mapOrigin, this.props.mark.map.shapeIdentifier, this.props.mark.map.shapeKey);
      let extrusionHeight = this.props.mark.map.style.extrusion.value
      let pointsArray = geoData.map((el, i) => {
        let points = el.vertices.split(', ')
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
      let sourceNode, targetNode;

      if (this.props.mark.nodes) {
        if (this.props.mark.nodes.source) {
          sourceNode = this.state.data.map((d, i) => {

            let source_position = GetMapCoordinates(d.source_longitude, d.source_latitude, this.props.mark.map.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);

            source_position[1] = -1 * source_position[1];
            switch (this.props.mark.nodes.source.type) {
              case 'sphere':
                {
                  return <a-sphere key={`${this.props.index}_Source${i}`} opacity={this.props.mark.nodes.source.style.fill.opacity} color={this.props.mark.nodes.source.style.fill.color} radius={this.props.mark.nodes.source.style.radius.value} position={`${source_position[0]} ${source_position[1]} 0`} />
                }
              case 'box':
                {
                  return <a-box key={`${this.props.index}_Source${i}`} opacity={this.props.mark.nodes.source.style.fill.opacity} color={this.props.mark.nodes.source.style.fill.color} width={this.props.mark.nodes.source.style.radius.value} height={this.props.mark.nodes.source.style.radius.value} depth={this.props.mark.nodes.source.style.radius.value} position={`${source_position[0]} ${source_position[1]} 0`} />
                }
              default:
                {
                  return <a-sphere key={`${this.props.index}_Source${i}`} opacity={this.props.mark.nodes.source.style.fill.opacity} color={this.props.mark.nodes.source.style.fill.color} radius={this.props.mark.nodes.source.style.radius.value} position={`${source_position[0]} ${source_position[1]} 0`} />
                }
            }
          })
        }

        if (this.props.mark.nodes.target) {
          targetNode = this.state.data.map((d, i) => {

            let target_position = GetMapCoordinates(d.target_longitude, d.target_latitude, this.props.mark.map.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);

            target_position[1] = -1 * target_position[1];

            switch (this.props.mark.nodes.target.type) {
              case 'sphere':
                {
                  return <a-sphere key={`${this.props.index}_Target${i}`} opacity={this.props.mark.nodes.target.style.fill.opacity} color={this.props.mark.nodes.target.style.fill.color} radius={this.props.mark.nodes.target.style.radius.value} position={`${target_position[0]} ${target_position[1]} 0`} />
                }
              case 'box':
                {
                  return <a-box key={`${this.props.index}_Target${i}`} opacity={this.props.mark.nodes.target.style.fill.opacity} color={this.props.mark.nodes.target.style.fill.color} width={this.props.mark.nodes.target.style.radius.value} height={this.props.mark.nodes.target.style.radius.value} depth={this.props.mark.nodes.target.style.radius.value} position={`${target_position[0]} ${target_position[1]} 0`} />
                }
              default:
                {
                  return <a-sphere key={`${this.props.index}_Target${i}`} opacity={this.props.mark.nodes.target.style.fill.opacity} color={this.props.mark.nodes.target.style.fill.color} radius={this.props.mark.nodes.target.style.radius.value} position={`${target_position[0]} ${target_position[1]} 0`} />
                }
            }
          })
        }
      }


      let curviness = 0.67;
      if (this.props.mark.flowlines.style.stroke.curviness) {
        curviness = this.props.mark.flowlines.style.stroke.curviness
      }

      let resolution = 20;
      if (this.props.mark.flowlines.style.stroke.resolution) {
        resolution = this.props.mark.flowlines.style.stroke.resolution
      }

      let opacity = this.props.mark.flowlines.style.opacity, vertexColorArray = [];
      
      let curvesPoints = this.state.data.map((d, i) => {

        let source_position = GetMapCoordinates(d.source_longitude, d.source_latitude, this.props.mark.map.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);

        source_position[1] = -1 * source_position[1];
        source_position.push(0)

        let target_position = GetMapCoordinates(d.target_longitude, d.target_latitude, this.props.mark.map.projection, this.props.mark.mapScale, this.props.mark.mapOrigin);

        target_position[1] = -1 * target_position[1];
        target_position.push(0)
        let middle_point
        if (this.props.mark.flowlines.style.height) {
          middle_point = [(target_position[0] + source_position[0]) / 2, (target_position[1] + source_position[1]) / 2, d[this.props.mark.flowlines.style.height.field] * this.props.mark.flowlines.style.height.scaleFactor]
        }
        else {
          let distance = Math.sqrt((target_position[0] - source_position[0]) * (target_position[0] - source_position[0]) + (target_position[1] - source_position[1]) * (target_position[1] - source_position[1]))
          middle_point = [(target_position[0] + source_position[0]) / 2, (target_position[1] + source_position[1]) / 2, distance / 4]
        }

        let pointsData = [source_position, middle_point, target_position]
        let pointList = []
    
        pointsData.forEach((d , i) => {
          pointList.push({"x":`${d[0]}`,"y":`${d[1]}`,"z":`${d[2]}`})
        })

        let color = this.props.mark.flowlines.style.stroke.color;
        if (this.props.mark.flowlines.style.stroke.scaleType) {
          color = colorScale(d[this.props.mark.flowlines.style.stroke.field])
        }
        vertexColorArray.push(color)
        return pointList

      });
      let curves = <a-frame-flowLine points={JSON.stringify(curvesPoints)} color={JSON.stringify(vertexColorArray)} opacity={opacity} curviness={curviness} resolution={resolution}/>

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
          {sourceNode}
          {targetNode}
          {curves}
          {boundingBox}
        </a-entity>
      )
    }
  }
}
export default FlowMap