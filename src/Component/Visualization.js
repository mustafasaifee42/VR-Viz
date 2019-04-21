import React, { Component } from 'react';
import AFRAME from 'aframe';
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
import MapContourLines from './MapContourLines.js';
import FlowMap from './FlowMap.js';
import ContourMap from './ContourMap.js';
import ParametricCurvePlot from './ParametricCurvePlot.js';
import ParametricSurfacePlot from './ParametricSurfacePlot.js';
import TreeMap from './TreeMap.js';
import WaterFallPlot from './WaterFallPlot.js';
import MeshPlot from './MeshPlot.js';
import RectangleChart from './RectangleChart.js';
import TimeSeries from './TimeSeries.js';
import MapTimeBars from './MapTimeBars.js';
import SpiralChart from './SpiralChart.js';
import LollipopChart from './LollipopChart.js';
import CrossSectionView from './CrossSectionView.js';

import PropTypes from 'prop-types';

require('aframe-teleport-controls');


const propTypes = {
  scene: PropTypes.object,
  graph: PropTypes.array.isRequired
}


class VRViz extends Component {
  constructor(props) {
    super(props)
    this.state = {
      headset:false,
    }
  }
  componentDidMount() {
    window.addEventListener('enter-vr', e => {
      if (AFRAME.utils.device.checkHeadsetConnected()) {
        this.setState({
          headset:true,
        })
        if(AFRAME.utils.device.isMobile()){
          this.setState({
            headset:false,
          })
        }
      }
      else {
        this.setState({
          headset:false,
        })
      }
    });
    window.addEventListener('exit-vr', e => {
      this.setState({
        headset:false,
      })
    });
  }
  render() {
    let light, camera, sky, floor, obj;
    if (this.props.scene) {
      //Light system
      light = this.props.scene.lights.map((item, i) => {
        let intensity, decay
        if (!item.intensity)
          intensity = 1
        else
          intensity = item.intensity;
        if (!item.decay)
          decay = 1
        else
          decay = item.decay;
        if (item.type === 'ambient')
          return <a-entity light={`type:${item.type}; color: ${item.color}; intensity: ${intensity}; decay: ${decay}`} key={`Light${i}`} />
        else
          return <a-entity light={`type:${item.type}; color: ${item.color}; castShadow: true; intensity: ${intensity}; decay: ${decay}`} position={item.position} key={`Light${i}`} />
      })

      //Camera Rig and Camera
      let fov
      if (!this.props.scene.camera.fov)
        fov = 80
      else
        fov = this.props.scene.camera.fov;
      let nearClipping
      if (!this.props.scene.camera.nearClipping)
        nearClipping = 0.005
      else
        nearClipping = this.props.scene.camera.nearClipping;
      let cameraSettings = `active: true;near:${nearClipping};fov:${fov}`
      if(this.state.headset)
      camera = <a-entity id="cameraRig" position={this.props.scene.camera.position} rotation={this.props.scene.camera.rotation}>
          <a-entity id="head" camera={cameraSettings} position="0 1.6 0" wasd-controls="#cameraRig;"/>
          <a-entity id="left-hand" windows-motion-controls="hand: left" vive-controls="hand: left" teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head;" />
          <a-entity id="right-hand" windows-motion-controls="hand: right" vive-controls="hand: right" gearvr-controls daydream-controls teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head;">
            <a-entity cursor="fuse: true; fuseTimeout: 50"
              position="0 0 -0.1"
              geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
              material="color: black; shader: flat"
              raycaster="far: 1000; interval: 100;objects: .clickable;showLine: true;" />
            <a-entity
              id="hover"
              geometry="primitive: plane; height: auto; width: auto"
              material="color: #000; opacity: 1"
              position="3 -0.1 -5"
              rotation='0 0 0'
              text="align: center; color: #fff; anchor: center; value: "
              visible={false} />
          </a-entity>
        </a-entity>
      else
        camera = <a-entity id="cameraRig" position={this.props.scene.camera.position} rotation={this.props.scene.camera.rotation}>
          <a-entity id="head" camera={cameraSettings} position="0 1.6 0"  look-controls  wasd-controls="#cameraRig;">
            <a-entity cursor="fuse: true; fuseTimeout: 50"
              position="0 0 -0.1"
              geometry="primitive: ring; radiusInner: 0.002; radiusOuter: 0.003"
              material="color: black; shader: flat"
              raycaster="far: 1000; interval: 100;objects: .clickable;showLine: true;" />
            <a-entity
              id="hover"
              geometry="primitive: plane; height: auto; width: auto"
              material="color: #000; opacity: 1"
              position="3 -0.1 -5"
              rotation='0 0 0'
              text="align: center; color: #fff; anchor: center; value: "
              visible={false} />
          </a-entity>
        </a-entity>
      //Sky
      sky = this.props.scene.sky.style.texture === false ? <a-sky id="bg" color={this.props.scene.sky.style.color} /> : <a-sky id="bg" src={this.props.scene.sky.style.img} />;

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
          if ((!d.data) || (!d.style) || (!d.mark)) {
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<BarGraph
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<BarGraph
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'ConnectedScatterPlot': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<ConnectedScatterPlot
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<ConnectedScatterPlot
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'ContourMap': {
          let heightThreshold;
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (!d.mark.heightThreshold)
            heightThreshold = 0
          else
            heightThreshold = d.mark.heightThreshold
          if (d.axis)
            return (<ContourMap
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              heightThreshold={heightThreshold}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<ContourMap
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              heightThreshold={heightThreshold}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'ContourPlot': {
          if ((!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<ContourPlot
              key={i}
              animateRotation={d.animateRotation}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<ContourPlot
              key={i}
              animateRotation={d.animateRotation}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'FlowMap': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<FlowMap
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<FlowMap
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'ForceDirectedGraph': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<ForceDirectedGraph
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<ForceDirectedGraph
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'MapBarChart': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<MapBarChart
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<MapBarChart
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'MapStackedBarChart': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<MapStackedBarChart
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<MapStackedBarChart
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'ParametricCurvePlot': {
          if ((!d.style) || (!d.mark) || (!d.parameter)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<ParametricCurvePlot
              key={i}
              animateRotation={d.animateRotation}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              parameter={d.parameter}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<ParametricCurvePlot
              key={i}
              animateRotation={d.animateRotation}
              style={d.style}
              mark={d.mark}
              parameter={d.parameter}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'ParametricSurfacePlot': {
          if ((!d.style) || (!d.mark) || (!d.parameter)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<ParametricSurfacePlot
              key={i}
              animateRotation={d.animateRotation}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              parameter={d.parameter}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<ParametricSurfacePlot
              key={i}
              animateRotation={d.animateRotation}
              style={d.style}
              mark={d.mark}
              parameter={d.parameter}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'PointCloud': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<PointCloud
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<PointCloud
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'PrismMap': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<PrismMap
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<PrismMap
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'ScatterPlot': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<ScatterPlot
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<ScatterPlot
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'StackedBarGraph': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<StackedBarGraph
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<StackedBarGraph
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'SurfacePlot': {
          if ((!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<SurfacePlot
              key={i}
              animateRotation={d.animateRotation}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<SurfacePlot
              key={i}
              animateRotation={d.animateRotation}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'TreeMap': {
          if ((!d.style) || (!d.data) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<TreeMap
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<TreeMap
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'WaterFallPlot': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<WaterFallPlot
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<WaterFallPlot
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'MeshPlot': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<MeshPlot
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<MeshPlot
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'RectangleChart': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<RectangleChart
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<RectangleChart
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'LollipopChart': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<LollipopChart
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<LollipopChart
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'TimeSeries': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.x) || (!d.y)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<TimeSeries
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              xAxis={d.axis['x-axis']}
              yAxis={d.axis['y-axis']}
              zAxis={d.axis['z-axis']}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<TimeSeries
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'MapTimeBars': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<MapTimeBars
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              axisBox={d.axis['axis-box']}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<MapTimeBars
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'MapContourLines': {
          if ((!d.data) || (!d.style) || (!d.mark)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<MapContourLines
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<MapContourLines
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'SpiralChart': {
          if ((!d.data) || (!d.style) || (!d.mark) || (!d.axis)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<SpiralChart
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              mark={d.mark}
              axis={d.axis}
              index={`Graph${i}`}
              title={d.title}
            />)
          else
            return (<SpiralChart
              key={i}
              animateRotation={d.animateRotation}
              data={d.data}
              style={d.style}
              index={`Graph${i}`}
              title={d.title}
            />)
        }
        case 'CrossSectionView': {
          if ((!d.object) || (!d.style)){
            console.log(`Error: Some necessary attributes missing for ${d.type}`)
            return null
          }
          if (d.axis)
            return (<CrossSectionView
              key={i}
              animateRotation={d.animateRotation}
              object={d.object}
              style={d.style}
              highlights={d.highlights}
              title={d.title}
            />)
          else
            return (<CrossSectionView
              key={i}
              animateRotation={d.animateRotation}
              object={d.object}
              style={d.style}
              highlights={d.highlights}
              title={d.title}
            />)
        }
        default: {
          console.log('The visualization type does not match the set in the library.')
          return null;
        }
      }

    })
    let divHeight = `${window.innerHeight}px`, divWidth  = `${window.innerWidth}px`, divClass = 'aframeBox';
    if (this.props.scene){
      if(this.props.scene.parentDiv){
        if(this.props.scene.parentDiv.height)
          divHeight = `${this.props.scene.parentDiv.height}px`
        if(this.props.scene.parentDiv.width)
          divWidth = `${this.props.scene.parentDiv.width}px`
        if(this.props.scene.parentDiv.class)
          divClass = `${this.props.scene.parentDiv.class}px`
      }
      return (
        <a-scene  class={divClass} embedded
          style={
            {
              height: divHeight,
              width: divWidth
            }
          }
        >
          {floor}
          {sky}
          {camera}
          {light}
          {obj}
          <a-entity class='parentEntity'>
            {visualization}
          </a-entity>
        </a-scene>
      )
    }
    else
      return (
        <a-entity>
          { visualization }
        </a-entity>
      )
  }
}

VRViz.propTypes = propTypes;
export default VRViz