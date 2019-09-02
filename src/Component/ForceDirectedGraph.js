import React, { Component } from 'react';
import * as d3 from 'd3';
import * as moment from 'moment';

import GetDomain from '../Utils/GetDomain.js';
import ReadPLY from '../Utils/ReadPLY.js';
import Shape from './Shape.js';

import { csv } from 'd3-request';
import { json } from 'd3-request';
import { text } from 'd3-request';


class ForceDirectedGraph extends Component {
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

      let ifLabel = this.props.mark.labels, labelWidth;

      let nodeType = this.props.mark.nodes.type, labelPadding, scale = this.props.style.scale;



      if (ifLabel) {
        labelWidth = this.props.mark.labels.style.fontSize
        labelPadding = this.props.mark.labels.style.padding
      }


      // Adding Domain
      let nodeRadiusDomain, linkColorDomain, nodeColorDomain, linkOpacityDomain, linkAnimatedDotRadiusDomain, linkanimatedDotDurationDomain;

      if (this.props.mark.nodes.style.radius.scaleType) {
        if (!this.props.mark.nodes.style.radius.domain) {
          nodeRadiusDomain = GetDomain(this.state.data.nodes, this.props.mark.nodes.style.radius.field, this.props.mark.nodes.style.radius.scaleType, this.props.mark.nodes.style.radius.startFromZero)
        } else
          nodeRadiusDomain = this.props.mark.nodes.style.radius.domain
      }

      if (this.props.mark.nodes.style.fill.scaleType) {
        if (!this.props.mark.nodes.style.fill.domain) {
          nodeColorDomain = GetDomain(this.state.data.nodes, this.props.mark.nodes.style.fill.field, this.props.mark.nodes.style.fill.scaleType, this.props.mark.nodes.style.fill.startFromZero)
        } else
          nodeColorDomain = this.props.mark.nodes.style.fill.domain
      }

      if (this.props.mark.links.style.fill.scaleType) {
        if (!this.props.mark.links.style.fill.domain) {
          linkColorDomain = GetDomain(this.state.data.link, this.props.mark.links.style.fill.field, this.props.mark.links.style.fill.scaleType, this.props.mark.links.style.fill.startFromZero)
        } else
          linkColorDomain = this.props.mark.links.style.fill.domain
      }

      if (this.props.mark.links.style.fill.opacity.scaleType) {
        if (!this.props.mark.links.style.fill.opacity.domain) {
          linkOpacityDomain = GetDomain(this.state.data.link, this.props.mark.links.style.fill.opacity.field, this.props.mark.links.style.fill.opacity.scaleType, this.props.mark.links.style.fill.opacity.startFromZero)
        } else
          linkOpacityDomain = this.props.mark.links.style.fill.opacity.domain
      }


      
      if (this.props.mark.links.flowAnimation){
        if (this.props.mark.links.flowAnimation.radius.scaleType){
          if (!this.props.mark.links.flowAnimation.radius.domain) {
            linkAnimatedDotRadiusDomain = GetDomain(this.state.data.link, this.props.mark.links.flowAnimation.radius.field, this.props.mark.links.flowAnimation.radius.scaleType, this.props.mark.links.flowAnimation.radius.startFromZero)
          } else
            linkAnimatedDotRadiusDomain = this.props.mark.links.flowAnimation.radius.domain
        }

        if (this.props.mark.links.flowAnimation.duration.scaleType){
          if (!this.props.mark.links.flowAnimation.duration.domain) {
            linkanimatedDotDurationDomain = GetDomain(this.state.data.link, this.props.mark.links.flowAnimation.duration.field, this.props.mark.links.flowAnimation.duration.scaleType, this.props.mark.links.flowAnimation.duration.startFromZero)
          } else
            linkanimatedDotDurationDomain = this.props.mark.links.flowAnimation.duration.domain
        }
      }


      // Scales

      let nodeRadiusScale, nodeColorScale, linkColorScale, linkOpacityScale, animatedDotRadiusScale, animatedDotDurationScale;

      if (this.props.mark.nodes.style.radius.scaleType)
        nodeRadiusScale = d3.scaleLinear()
          .domain(nodeRadiusDomain)
          .range(this.props.mark.nodes.style.radius.value)

      if (this.props.mark.nodes.style.fill.scaleType) {
        let nodeColorRange = d3.schemeCategory10;
        if (this.props.mark.nodes.style.fill.color)
          nodeColorRange = this.props.mark.nodes.style.fill.color
        if (this.props.mark.nodes.style.fill.scaleType === 'ordinal')
          nodeColorScale = d3.scaleOrdinal()
            .domain(nodeColorDomain)
            .range(nodeColorRange)
        else
          nodeColorScale = d3.scaleLinear()
            .domain(nodeColorDomain)
            .range(nodeColorRange)
      }

      if (this.props.mark.links.style.fill.scaleType) {
        let linkColorRange = d3.schemeCategory10;
        if (this.props.mark.links.style.fill.color)
          linkColorRange = this.props.mark.links.style.fill.color
        if (this.props.mark.links.style.fill.scaleType === 'ordinal')
          linkColorScale = d3.scaleOrdinal()
            .domain(linkColorDomain)
            .range(linkColorRange);
        else
          linkColorScale = d3.scaleLinear()
            .domain(linkColorDomain)
            .range(linkColorRange);
      }

      if (this.props.mark.links.style.fill.opacity.scaleType)
        linkOpacityScale = d3.scaleLinear()
          .domain(linkOpacityDomain)
          .range(this.props.mark.links.style.fill.opacity.value)
      
      if (this.props.mark.links.flowAnimation){
        if (this.props.mark.links.flowAnimation.radius.scaleType)
          animatedDotRadiusScale = d3.scaleLinear()
            .domain(linkAnimatedDotRadiusDomain)
            .range(this.props.mark.links.flowAnimation.radius.value)
        if (this.props.mark.links.flowAnimation.duration.scaleType)
          animatedDotDurationScale = d3.scaleLinear()
            .domain(linkanimatedDotDurationDomain)
            .range(this.props.mark.links.flowAnimation.duration.value)
      }



      //Graph Coordinates

      let createGraph = require('ngraph.graph');

      let g = createGraph()
      let physicsSettings = { integrator: 'verlet' };

      for (let i = 0; i < this.state.data.nodes.length; i++) {
        let col, r, lab;
        if (this.props.mark.nodes.style.radius.scaleType)
          r = nodeRadiusScale(this.state.data.nodes[i][this.props.mark.nodes.style.radius.field])
        else
          r = this.props.mark.nodes.style.radius.value
        if (this.props.mark.nodes.style.fill.scaleType)
          col = nodeColorScale(this.state.data.nodes[i][this.props.mark.nodes.style.fill.field])
        else
          col = this.props.mark.nodes.style.fill.color
        if (this.props.mark.labels)
          lab = this.state.data.nodes[i][this.props.mark.labels.field]
        else
          lab = ''
        g.addNode(this.state.data.nodes[i].id, {
          color: col,
          radius: r,
          text: lab,
          data: this.state.data.nodes[i]
        })
      }


      for (let i = 0; i < this.state.data.links.length; i++) {
        let col, op, animatedDotRadius = 0, animatedDotDuration = 0;
        if (this.props.mark.links.style.fill.opacity.scaleType)
          op = linkOpacityScale(this.state.data.links[i][this.props.mark.links.style.fill.opacity.field])
        else
          op = this.props.mark.links.style.fill.opacity.value
        if (this.props.mark.links.style.fill.scaleType)
          col = linkColorScale(this.state.data.links[i][this.props.mark.links.style.fill.field])
        else
          col = this.props.mark.links.style.fill.color
        if (this.props.mark.links.flowAnimation){
          if (this.props.mark.links.flowAnimation.radius.scaleType)
            animatedDotRadius = animatedDotRadiusScale(this.state.data.links[i][this.props.mark.links.flowAnimation.radius.field])
          else
            animatedDotRadius = this.props.mark.links.flowAnimation.radius.value
          if (this.props.mark.links.flowAnimation.duration.scaleType)
            animatedDotDuration = animatedDotDurationScale(this.state.data.links[i][this.props.mark.links.flowAnimation.duration.field])
          else
            animatedDotDuration = this.props.mark.links.flowAnimation.duration.value
        }

        g.addLink(this.state.data.links[i].fromId, this.state.data.links[i].toId, {
          color: col,
          opacity: op,
          animatedDotRadius: animatedDotRadius,
          animatedDotDuration: animatedDotDuration,
          data: this.state.data.links[i]
        })
      }

      var layout = require('ngraph.forcelayout3d')(g, physicsSettings);
      let i;
      for (i = 0; i < 1000; ++i) {
        layout.step();
      }
      let sphere = [], lines = [], label = []
      i = 0
      g.forEachNode((node) => {
        let hoverText
        if (this.props.mark.nodes.mouseOver) {
          if (this.props.mark.nodes.mouseOver.label)
            hoverText = this.props.mark.nodes.mouseOver.label.value(node.data.data)
        }
        let className = 'clickable', idName
        if (typeof this.props.mark.nodes.class === "function"){
          className =  `clickable ${this.props.mark.nodes.class(node.data.data,i)}`
        }
        if (typeof this.props.mark.nodes.id === "function"){
          idName =  this.props.mark.nodes.id(node.data.data,i)
        }
        let labelClassName, labelIdName
        if (typeof this.props.mark.labels.class === "function"){
          labelClassName =  `clickable ${this.props.mark.labels.class(node.data.data,i)}`
        }
        if (typeof this.props.mark.labels.id === "function"){
          labelIdName =  this.props.mark.labels.id(node.data.data,i)
        }
        sphere.push(
          <Shape
            type={nodeType}
            key={i}
            color={`${node.data.color}`}
            opacity={1}
            depth={`${node.data.radius}`}
            height={`${node.data.radius}`}
            width={`${node.data.radius}`}
            radius={`${node.data.radius}`}
            segments={`${this.props.mark.nodes.style.segments}`}
            position={`${layout.getNodePosition(node.id).x * scale} ${layout.getNodePosition(node.id).y * scale} ${layout.getNodePosition(node.id).z * scale}`}
            hover={this.props.mark.nodes.mouseOver}
            hoverText={hoverText}
            graphID={this.props.index}
            class={className}
            id={idName}
            data={JSON.stringify(node.data.data)}
          />
        )
        if (ifLabel)
          label.push(<a-text key={i} class={labelClassName} id={labelIdName} data={JSON.stringify(node.data.data)} color={node.data.color} width={labelWidth} value={node.data.text} anchor='align' side='double' align='left' billboard={this.props.mark.labels.billboarding} position={`${layout.getNodePosition(node.id).x * scale + node.data.radius / 2 + labelPadding} ${layout.getNodePosition(node.id).y * scale} ${layout.getNodePosition(node.id).z * scale}`} />)
        i++;
      });
      let animatedSphere = []
      i = 0
      g.forEachLink((link) => {
        let linkClassName, linkIdName
        if (typeof this.props.mark.links.class === "function"){
          linkClassName =  `${this.props.mark.links.class(link.data.data,i)}`
        }
        if (typeof this.props.mark.links.id === "function"){
          linkIdName =  this.props.mark.links.id(link.data.data,i)
        }
        if(this.props.mark.links.flowAnimation){
          let animatedDotClassName, animatedDotIdName
          if (typeof this.props.mark.links.flowAnimation.class === "function"){
            animatedDotClassName =  `${this.props.mark.links.flowAnimation.class(link.data.data,i)}`
          }
          if (typeof this.props.mark.links.flowAnimation.id === "function"){
            animatedDotIdName =  this.props.mark.links.flowAnimation.id(link.data.data,i)
          }
          animatedSphere.push(<a-sphere key={i} class={animatedDotClassName} id={animatedDotIdName}  data={JSON.stringify(link.data.data)} position={`${layout.getLinkPosition(link.id).from.x * scale} ${layout.getLinkPosition(link.id).from.y * scale} ${layout.getLinkPosition(link.id).from.z * scale}`} radius={link.data.animatedDotRadius} opacity={this.props.mark.links.flowAnimation.opacity} color={this.props.mark.links.flowAnimation.color} animation={`property:position; to:${layout.getLinkPosition(link.id).to.x * scale} ${layout.getLinkPosition(link.id).to.y * scale} ${layout.getLinkPosition(link.id).to.z * scale}; loop: true; dur:${link.data.animatedDotDuration}; easing:linear`} />)
        }
        lines.push(<a-entity key={i} class={linkClassName} id={linkIdName}  data={JSON.stringify(link.data.data)} line={`start: ${layout.getLinkPosition(link.id).from.x * scale}, ${layout.getLinkPosition(link.id).from.y * scale}, ${layout.getLinkPosition(link.id).from.z * scale}; end: ${layout.getLinkPosition(link.id).to.x * scale} ${layout.getLinkPosition(link.id).to.y * scale} ${layout.getLinkPosition(link.id).to.z * scale}; color: ${link.data.color}; opacity: ${link.data.opacity}`} />)
        i++
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
        <a-entity click-rotation={`enabled:${clickRotation}`} pivot-center={`xPosition:${this.props.style.origin[0]};yPosition:${this.props.style.origin[1]};zPosition:${this.props.style.origin[2]};pivotX:${this.props.style.xPivot};pivotY:${this.props.style.yPivot};pivotZ:${this.props.style.zPivot}`}  position={`${this.props.style.origin[0]} ${this.props.style.origin[1]} ${this.props.style.origin[2]}`} rotation={this.props.style.rotation} id={this.props.index}>
          {animation}
          {sphere}
          {lines}
          {label}
          {animatedSphere}
        </a-entity>
      );
    }
  }
}
export default ForceDirectedGraph