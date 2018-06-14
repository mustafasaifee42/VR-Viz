import React, { Component } from 'react';
import 'aframe';

import BarGraph from './BarGraph.js';
import ScatterPlot from './ScatterPlot.js';
import StackedBarGraph from './StackedBarGraph.js';
import SurfacePlot from './SurfacePlot.js';
import ContourPlot from './ContourPlot.js';
import PointCloud from './PointCloud.js';
import ConnectedScatterPlot from './ConnectedScatterPlot.js';
import ForceDirectedGraph from './ForceDirectedGraph.js';
import PrismMap from './PrismMap.js';
import MapBarChart from './MapBarChart.js';
import MapStackedBarChart from './MapStackedBarChart.js';
import FlowMap from './FlowMap.js';
import ContourMap from './ContourMap.js';
import ParametricCurvePlot from './ParametricCurvePlot.js';
import ParametricSurfacePlot from './ParametricSurfacePlot.js';
import TreeMap from './TreeMap.js';
import WaterFallPlot from './WaterFallPlot.js';
import MeshPlot from './MeshPlot.js';
import RectangleChart from './RectangleChart.js';
import TimeSeries from './TimeSeries.js';
import TimeBars from './TimeBars.js';
import SpiralChart from './SpiralChart.js';


class Visualization extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    let light, camera, sky, floor, obj;
    if (this.props.scene) {
      //Light system
      light = this.props.scene.lights.map((item, i) => {
        let intensity = item.intensity === null ? 1 : item.intensity;
        let decay = item.decay === null ? 1 : item.decay;
        if (item.type === 'ambient')
          return <a-entity light={`type:${item.type}; color: ${item.color}; intensity: ${intensity}; decay: ${decay}`} key={i} />
        else
          return <a-entity light={`type:${item.type}; color: ${item.color}; castShadow: true; intensity: ${intensity}; decay: ${decay}`} position={item.position} key={i} />
      })

      //Camera Rig and Camera
      let fov = this.props.scene.camera.fov === null ? 80 : this.props.scene.camera.fov;
      camera = <a-entity id="#rig" position={this.props.scene.camera.position} rotation={this.props.scene.camera.rotation}>
        <a-camera fov={this.props.scene.camera.fov}>
          <a-cursor />
        </a-camera>
      </a-entity>

      //Sky
      sky = this.props.scene.sky.style.texture === false ? <a-sky color={this.props.scene.sky.style.color} /> : <a-sky src={this.props.scene.sky.style.img} />;

      //Floor
      if (this.props.scene.floor) {
        if (this.props.scene.floor.style.texture) {
          if (this.props.scene.floor.style.repeat === null)
            floor = <a-plane src={this.props.scene.floor.style.img} rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.depth}`} />
          else
            floor = <a-plane src={this.props.scene.floor.style.img} rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.depth}`} repeat={this.props.scene.floor.style.repeat} />
        } else {
          floor = <a-plane color={this.props.scene.floor.style.color} rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.depth}`} />
        }
      }

      //3D-Object
      if (this.props.scene['3D-objects']) {
        obj = this.props.scene['3D-objects'].map((item, i) => {
          return (
            <a-assets>
              <a-asset-item id={item.objectID} src={item.objectFile} />
              <a-asset-item id={item.materialID} src={item.materialFile} />
            </a-assets>
          )
        })
      }
    }
    // Adding Visualization

    let visualization = this.props.graph.map((d, i) => {
      switch (d.type) {
        case 'BarGraph': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<BarGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<BarGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'ConnectedScatterPlot': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ConnectedScatterPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<ConnectedScatterPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'ContourMap': {
          let heightThreshold;
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (!d.mark.heightThreshold)
            heightThreshold = 0
          else
            heightThreshold = d.mark.heightThreshold
          if (d.axis)
            return (<ContourMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              heightThreshold={heightThreshold}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<ContourMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              heightThreshold={heightThreshold}
            />)
        }
        case 'ContourPlot': {
          if ((!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ContourPlot
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<ContourPlot
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'FlowMap': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<FlowMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<FlowMap
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'ForceDirectedGraph': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ForceDirectedGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<ForceDirectedGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'MapBarChart': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<MapBarChart
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<MapBarChart
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'MapStackedBarChart': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<MapStackedBarChart
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<MapStackedBarChart
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'ParametricCurvePlot': {
          if ((!d.style) || (!d.mark) || (!d.parameter))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ParametricCurvePlot
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              parameter={d.parameter}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<ParametricCurvePlot
              style={d.style}
              mark={d.mark}
              parameter={d.parameter}
            />)
        }
        case 'ParametricSurfacePlot': {
          if ((!d.style) || (!d.mark) || (!d.parameter))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ParametricSurfacePlot
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              parameter={d.parameter}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<ParametricSurfacePlot
              style={d.style}
              mark={d.mark}
              parameter={d.parameter}
            />)
        }
        case 'PointCloud': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<PointCloud
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<PointCloud
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'PrismMap': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<PrismMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<PrismMap
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'ScatterPlot': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<ScatterPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<ScatterPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'StackedBarGraph': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<StackedBarGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<StackedBarGraph
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'SurfacePlot': {
          if ((!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<SurfacePlot
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<SurfacePlot
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'TreeMap': {
          if ((!d.style) || (!d.data) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<TreeMap
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<TreeMap
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'WaterFallPlot': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<WaterFallPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<WaterFallPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'MeshPlot': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<MeshPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<MeshPlot
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'RectangleChart': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<RectangleChart
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<RectangleChart
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'TimeSeries': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<TimeSeries
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<TimeSeries
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'TimeBars': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<TimeBars
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
            />)
          else
            return (<TimeBars
              data={d.data}
              style={d.style}
              mark={d.mark}
            />)
        }
        case 'SpiralChart': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.axis))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (d.axis)
            return (<SpiralChart
              data={d.data}
              style={d.style}
              mark={d.mark}
              axis={d.axis}
            />)
          else
            return (<SpiralChart
              data={d.data}
              style={d.style}
            />)
        }
        default: {
          console.log('The visualization type does not match the set in the library.')
          break;
        }
      }

    })
    console.log(light)
    if (this.props.scene)
      return (
        <a-scene>
          {floor}
          {sky}
          {camera}
          {light}
          {obj}
          {visualization}
        </a-scene>
      )
    else
      return (
        { visualization }
      )
  }
}
export default Visualization