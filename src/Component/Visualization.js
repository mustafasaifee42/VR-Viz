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
import FlowMap from './FlowMap.js';
import ContourMap from './ContourMap.js';



class Visualization extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
      //Light system
      let light = this.props.scene.lights.map((item, i) => {
        let intensity = item.intensity === null ? 1 : item.intensity;
        let decay = item.decay === null ? 1 : item.decay;
        if (item.type === 'ambient')
          return <a-entity light={`type:${item.type}; color: ${item.color}; intensity: ${intensity}; decay: ${decay}`} key={i} />
        else
          return <a-entity light={`type:${item.type}; color: ${item.color}; castShadow: true; intensity: ${intensity}; decay: ${decay}`} position={item.position} key={i} />
      })

      //Camera Rig and Camera
      let fov = this.props.scene.camera.fov === null ? 80 : this.props.scene.camera.fov;
      let camera = <a-entity id="#rig" position={this.props.scene.camera.position} rotation={this.props.scene.camera.rotation}>
        <a-camera fov={this.props.scene.camera.fov}></a-camera>
      </a-entity>

      //Sky
      let skyAssets = <a-assets />;
      if (this.props.scene.sky.texture) {
        skyAssets =
          <a-assets>
            <img id="sky" src={this.props.scene.sky.style.img} />
          </a-assets>
      }
      let sky = this.props.scene.sky.style.texture === false ? <a-sky color={this.props.scene.sky.style.color} /> : <a-sky src="#sky" />;

      //Floor
      let floorAssets = <a-assets />, floor;
      if (this.props.scene.floor) {
        if (this.props.scene.floor.style.texture) {
          floorAssets =
            <a-assets>
              <img id="groundTexture" src={this.props.scene.floor.style.img} />
            </a-assets>
          if (this.props.scene.floor.style.repeat === null)
            floor = <a-plane src="#groundTexture" rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.height}`} />
          else
            floor = <a-plane src="#groundTexture" rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.height}`} repeat={this.props.scene.floor.style.repeat} />
        } else {
          floor = <a-plane color={this.props.scene.floor.style.color} rotation="-90 0 0" width={`${this.props.scene.floor.style.width}`} height={`${this.props.scene.floor.style.height}`} />
        }
      }

      // Adding Visualization

      let visualization = this.props.graph.map((d,i) => {
        switch(d.type){
          case 'BarGraph' : {
            if((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return (<BarGraph 
              data = {d.data}
              style = {d.style}
              mark = {d.mark}
              x = {d.x}
              y = {d.y}
              z = {d.z}
            />)
            break;
          }
          case 'ConnectedScatterPlot' : {
            if((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return (<ConnectedScatterPlot 
              data = {d.data}
              style = {d.style}
              mark = {d.mark}
              x = {d.x}
              y = {d.y}
              z = {d.z}
            />)
            break;
          }
          case 'ContourMap' : {
            let heightThreshold;
            if((!d.data) || (!d.style) || (!d.mark))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            if(!d.heightThreshold)
              heightThreshold = 0
            else
              heightThreshold = d.heightThreshold
            return (<ContourMap 
              data = {d.data}
              style = {d.style}
              mark = {d.mark}
              heightThreshold = {heightThreshold}
            />)
            break;
          }
          case 'ContourPlot' : {
            if((!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return (<ContourPlot 
              style = {d.style}
              mark = {d.mark}
              x = {d.x}
              y = {d.y}
              z = {d.z}
            />)
            break;
          }
          case 'FlowMap' : {
            if((!d.data) || (!d.style) || (!d.mark))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return (<FlowMap 
              data = {d.data}
              style = {d.style}
              mark = {d.mark}
            />)
            break;
          }
          case 'ForceDirectedGraph' : {
            if((!d.data) || (!d.style) || (!d.mark))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return (<ForceDirectedGraph 
              data = {d.data}
              style = {d.style}
              mark = {d.mark}
            />)
            break;
          }
          case 'MapBarChart' : {
            if((!d.data) || (!d.style) || (!d.mark))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return (<MapBarChart 
              data = {d.data}
              style = {d.style}
              mark = {d.mark}
            />)
            break;
          }
          case 'PointCloud' : {
            if((!d.data) || (!d.style) || (!d.mark))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return (<PointCloud 
              data = {d.data}
              style = {d.style}
              mark = {d.mark}
            />)
            break;
          }
          case 'PrismMap' : {
            if((!d.data) || (!d.style) || (!d.mark))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return (<PrismMap 
              data = {d.data}
              style = {d.style}
              mark = {d.mark}
            />)
            break;
          }
          case 'ScatterPlot' : {
            if((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return (<ScatterPlot 
              data = {d.data}
              style = {d.style}
              mark = {d.mark}
              x = {d.x}
              y = {d.y}
              z = {d.z}
            />)
            break;
          }
          case 'StackedBarGraph' : {
            if((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return (<StackedBarGraph 
              data = {d.data}
              style = {d.style}
              mark = {d.mark}
              x = {d.x}
              y = {d.y}
              z = {d.z}
            />)
            break;
          }
          case 'SurfacePlot' : {
            if((!d.style) || (!d.mark) || (!d.x) || (!d.y) || (!d.z))
              console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return (<SurfacePlot 
              style = {d.style}
              mark = {d.mark}
              x = {d.x}
              y = {d.y}
              z = {d.z}
            />)
            break;
          }
          default :{
            console.log('The visualization type does not match the set in the library.')
            break;
          }
        }

      })


      return (
        <a-scene>
          {skyAssets}
          {floorAssets}
          {floor}
          {sky}
          {camera}
          {light}
          {visualization}
        </a-scene>
      )
  }
}
export default Visualization