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
            floor = <a-plane src={this.props.scene.floor.style.img} rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.height}`} />
          else
            floor = <a-plane src={this.props.scene.floor.style.img} rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.height}`} repeat={this.props.scene.floor.style.repeat} />
        } else {
          floor = <a-plane color={this.props.scene.floor.style.color} rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.height}`} />
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
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<BarGraph
            data={d.data}
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
            z={d.z}
          />)
          break;
        }
        case 'ConnectedScatterPlot': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<ConnectedScatterPlot
            data={d.data}
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
            z={d.z}
          />)
          break;
        }
        case 'ContourMap': {
          let heightThreshold;
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          if (!d.heightThreshold)
            heightThreshold = 0
          else
            heightThreshold = d.heightThreshold
          return (<ContourMap
            data={d.data}
            style={d.style}
            mark={d.mark}
            heightThreshold={heightThreshold}
          />)
          break;
        }
        case 'ContourPlot': {
          if ((!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<ContourPlot
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
            z={d.z}
          />)
          break;
        }
        case 'FlowMap': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<FlowMap
            data={d.data}
            style={d.style}
            mark={d.mark}
          />)
          break;
        }
        case 'ForceDirectedGraph': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<ForceDirectedGraph
            data={d.data}
            style={d.style}
            mark={d.mark}
          />)
          break;
        }
        case 'MapBarChart': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<MapBarChart
            data={d.data}
            style={d.style}
            mark={d.mark}
          />)
          break;
        }
        case 'MapStackedBarChart': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<MapStackedBarChart
            data={d.data}
            style={d.style}
            mark={d.mark}
          />)
          break;
        }
        case 'ParametricCurvePlot': {
          if ((!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z) || (!d.parameter))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<ParametricCurvePlot
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
            z={d.z}
            parameter={d.parameter}
          />)
          break;
        }
        case 'ParametricSurfacePlot': {
          if ((!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z) || (!d.parameter))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<ParametricSurfacePlot
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
            z={d.z}
            parameter={d.parameter}
          />)
          break;
        }
        case 'PointCloud': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<PointCloud
            data={d.data}
            style={d.style}
            mark={d.mark}
          />)
          break;
        }
        case 'PrismMap': {
          if ((!d.data) || (!d.style) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<PrismMap
            data={d.data}
            style={d.style}
            mark={d.mark}
          />)
          break;
        }
        case 'ScatterPlot': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<ScatterPlot
            data={d.data}
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
            z={d.z}
          />)
          break;
        }
        case 'StackedBarGraph': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<StackedBarGraph
            data={d.data}
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
            z={d.z}
          />)
          break;
        }
        case 'SurfacePlot': {
          if ((!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<SurfacePlot
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
            z={d.z}
          />)
          break;
        }
        case 'TreeMap': {
          if ((!d.style) || (!d.data) || (!d.mark))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<TreeMap
            data={d.data}
            style={d.style}
            mark={d.mark}
          />)
          break;
        }
        case 'WaterFallPlot': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<WaterFallPlot
            data={d.data}
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
            z={d.z}
          />)
          break;
        }
        case 'meshPlot': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<MeshPlot
            data={d.data}
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
            z={d.z}
          />)
          break;
        }
        case 'RectangleChart': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<RectangleChart
            data={d.data}
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
            z={d.z}
          />)
          break;
        }
        case 'TimeSeries': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y))
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
          return (<TimeSeries
            data={d.data}
            style={d.style}
            mark={d.mark}
            x={d.x}
            y={d.y}
          />)
          break;
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