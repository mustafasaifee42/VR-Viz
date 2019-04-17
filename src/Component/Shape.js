import React, { Component } from 'react';
import * as AFRAME from 'aframe';
import * as d3 from 'd3';



AFRAME.registerComponent('change-color-on-hover', {
  schema: {
    hoverText: { type: 'string' },
    prevOpacity: { type: 'string' },
    prevColor: { type: 'string' },
    focusedObjectOpacity: { type: 'string', default: '1' },
    focusedObjectfill: { type: 'string', default: 'red' },
    nonFocusedObjectOpacity: { type: 'string', default: '0.2' },
    labelWidth: { type: 'string', default: 'auto' },
    labelHeight: { type: 'string', default: 'auto' },
    labelAlign: { type: 'string', default: 'center' },
    wrapCount: { type: 'string', default: '4' },
    labelBackgroundColor: { type: 'string', default: 'black' },
    labelFontColor: { type: 'string', default: 'white' },
    labelPosition: { type: 'string', default: '0 -0.5 -0.5' },
    labelRotation: { type: 'string', default: '0 0 0' },
    graphID: { type: 'string' },
    backgroundOpacity: { type: 'string' },
  },

  init: function () {
    var data = this.data;
    var el = this.el;  // <a-box>
    var defaultColor = el.getAttribute('material').color;

    el.addEventListener('mouseenter', function () {
      let hvr = document.getElementById("hover")

      let shapes = d3.selectAll(`#${data.graphID}`)
        .selectAll('.shapes')

      if (data.hoverText != 'undefined') {
        hvr.setAttribute('visible', true);
        hvr.setAttribute('text', 'value', data.hoverText);
      }

      if (data.nonFocusedObjectOpacity != 'undefined') {
        shapes.attr('opacity', parseFloat(data.nonFocusedObjectOpacity))
      }

      if (data.focusedObjectOpacity != 'undefined') {
        el.setAttribute('opacity', data.focusedObjectOpacity);
      }

      if (data.focusedObjectfill != 'undefined') {
        el.setAttribute('color', data.focusedObjectfill);
      }

      if (data.labelPosition != 'undefined')
        hvr.setAttribute('position', data.labelPosition);
      else
        hvr.setAttribute('position', '0 -0.3 -1');

      if (data.labelRotation != 'undefined')
        hvr.setAttribute('rotation', data.labelRotation);
      else
        hvr.setAttribute('rotation', '0 0 0');

      console.log(data.wrapCount);
      if (data.wrapCount != 'undefined')
        hvr.setAttribute('text', 'wrapCount', data.wrapCount);

      if (data.lineHeight != 'undefined')
        hvr.setAttribute('text', 'lineHeight', data.lineHeight);

      if (data.labelFontColor != 'undefined')
        hvr.setAttribute('text', 'color', data.labelFontColor);

      if (data.labelAlign != 'undefined')
        hvr.setAttribute('text', 'align', data.labelAlign);

      if (data.labelWidth != 'undefined')
        hvr.setAttribute('geometry', 'width', data.labelWidth);

      if (data.labelHeight != 'undefined')
        hvr.setAttribute('geometry', 'height', data.labelHeight);

      if (data.labelBackgroundColor != 'undefined')
        hvr.setAttribute('material', 'color', data.labelBackgroundColor);

      if (data.backgroundOpacity != 'undefined')
        hvr.setAttribute('material', 'opacity', data.backgroundOpacity)
      else
        hvr.setAttribute('material', 'opacity', 1)

    });

    el.addEventListener('mouseleave', function () {
      let hvr = document.getElementById("hover")
      hvr.setAttribute('visible', false);
      el.setAttribute('opacity', data.prevOpacity);
      el.setAttribute('color', data.prevColor);
      let shapes = d3.selectAll(`#${data.graphID}`)
        .selectAll('.shapes')
        .attr('opacity', parseFloat(data.prevOpacity))
    });
  }
});
class Shapes extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    let marks;
    let rotation = '0 0 0';
    if (this.props.rotation) {
      rotation = this.props.rotation
    }
    if (this.props.hover) {
      switch (this.props.type) {
        case 'box':
          {
            return (
              <a-box color={this.props.color} class={'shapes clickable'} opacity={this.props.opacity} depth={this.props.depth} height={this.props.height} width={this.props.width} position={this.props.position} rotation={rotation} change-color-on-hover={`hoverText:${this.props.hoverText}; prevOpacity:${this.props.opacity};focusedObjectOpacity: ${this.props.hover.focusedObject.opacity};focusedObjectfill:${this.props.hover.focusedObject.fill};nonFocusedObjectOpacity:${this.props.hover.nonFocusedObject.opacity};labelWidth:${this.props.hover.label.width};lineHeight:${this.props.hover.label.lineHeight};labelHeight:${this.props.hover.label.height};labelAlign:${this.props.hover.label.align};wrapCount:${this.props.hover.label.wrapCount};labelBackgroundColor:${this.props.hover.label.backgroundColor};labelFontColor:${this.props.hover.label.fontColor};labelPosition:${this.props.hover.label.position};labelRotation:${this.props.hover.label.rotation};prevColor:${this.props.color};graphID:${this.props.graphID};backgroundOpacity:${this.props.hover.label.backgroundOpacity}`} />
            )
          }
        case 'cylinder':
          {
            return (
              <a-cylinder color={this.props.color} class={'shapes clickable'} opacity={this.props.opacity} height={this.props.height} radius={this.props.radius} segments-radial={this.props.segments} position={this.props.position} rotation={rotation} change-color-on-hover={`hoverText:${this.props.hoverText}; prevOpacity:${this.props.opacity};focusedObjectOpacity: ${this.props.hover.focusedObject.opacity};focusedObjectfill:${this.props.hover.focusedObject.fill};nonFocusedObjectOpacity:${this.props.hover.nonFocusedObject.opacity};labelWidth:${this.props.hover.label.width};lineHeight:${this.props.hover.label.lineHeight};labelHeight:${this.props.hover.label.height};labelAlign:${this.props.hover.label.align};wrapCount:${this.props.hover.label.wrapCount};labelBackgroundColor:${this.props.hover.label.backgroundColor};labelFontColor:${this.props.hover.label.fontColor};labelPosition:${this.props.hover.label.position};labelRotation:${this.props.hover.label.rotation};prevColor:${this.props.color};graphID:${this.props.graphID};backgroundOpacity:${this.props.hover.label.backgroundOpacity}`} />
            )
          }
        case 'cone':
          {
            return (
              <a-cone color={this.props.color} class={'shapes clickable'} opacity={this.props.opacity} height={this.props.height} radius-bottom={this.props.radius} radius-top={0} segments-radial={this.props.segments} position={this.props.position} rotation={rotation} change-color-on-hover={`hoverText:${this.props.hoverText}; prevOpacity:${this.props.opacity};focusedObjectOpacity: ${this.props.hover.focusedObject.opacity};focusedObjectfill:${this.props.hover.focusedObject.fill};nonFocusedObjectOpacity:${this.props.hover.nonFocusedObject.opacity};labelWidth:${this.props.hover.label.width};lineHeight:${this.props.hover.label.lineHeight};labelHeight:${this.props.hover.label.height};labelAlign:${this.props.hover.label.align};wrapCount:${this.props.hover.label.wrapCount};labelBackgroundColor:${this.props.hover.label.backgroundColor};labelFontColor:${this.props.hover.label.fontColor};labelPosition:${this.props.hover.label.position};labelRotation:${this.props.hover.label.rotation};prevColor:${this.props.color};graphID:${this.props.graphID};backgroundOpacity:${this.props.hover.label.backgroundOpacity}`} />
            )
          }
        case 'sphere':
          {
            return (
              <a-sphere color={this.props.color} class={'shapes clickable'} opacity={this.props.opacity} radius={this.props.radius} position={this.props.position} change-color-on-hover={`hoverText:${this.props.hoverText}; prevOpacity:${this.props.opacity};focusedObjectOpacity: ${this.props.hover.focusedObject.opacity};focusedObjectfill:${this.props.hover.focusedObject.fill};nonFocusedObjectOpacity:${this.props.hover.nonFocusedObject.opacity};labelWidth:${this.props.hover.label.width};lineHeight:${this.props.hover.label.lineHeight};labelHeight:${this.props.hover.label.height};labelAlign:${this.props.hover.label.align};wrapCount:${this.props.hover.label.wrapCount};labelBackgroundColor:${this.props.hover.label.backgroundColor};labelFontColor:${this.props.hover.label.fontColor};labelPosition:${this.props.hover.label.position};labelRotation:${this.props.hover.label.rotation};prevColor:${this.props.color};graphID:${this.props.graphID};backgroundOpacity:${this.props.hover.label.backgroundOpacity}`} />
            )
          }
        default:
          {
            return (
              <a-box color={this.props.color} class={'shapes clickable'} opacity={this.props.opacity} depth={this.props.depth} height={this.props.hght} width={this.props.width} position={this.props.position} rotation={rotation} change-color-on-hover={`hoverText:${this.props.hoverText}; prevOpacity:${this.props.opacity};focusedObjectOpacity: ${this.props.hover.focusedObject.opacity};focusedObjectfill:${this.props.hover.focusedObject.fill};nonFocusedObjectOpacity:${this.props.hover.nonFocusedObject.opacity};labelWidth:${this.props.hover.label.width};lineHeight:${this.props.hover.label.lineHeight};labelHeight:${this.props.hover.label.height};labelAlign:${this.props.hover.label.align};wrapCount:${this.props.hover.label.wrapCount};labelBackgroundColor:${this.props.hover.label.backgroundColor};labelFontColor:${this.props.hover.label.fontColor};labelPosition:${this.props.hover.label.position};labelRotation:${this.props.hover.label.rotation};prevColor:${this.props.color};graphID:${this.props.graphID};backgroundOpacity:${this.props.hover.label.backgroundOpacity}`} />
            )
          }
      }
    }
    else {
      switch (this.props.type) {
        case 'box':
          {
            return (
              <a-box color={this.props.color} class={'shapes'} opacity={this.props.opacity} depth={this.props.depth} height={this.props.height} width={this.props.width} position={this.props.position} rotation={rotation} />
            )
          }
        case 'cylinder':
          {
            return (
              <a-cylinder color={this.props.color} class={'shapes'} opacity={this.props.opacity} height={this.props.height} radius={this.props.radius} segments-radial={this.props.segments} position={this.props.position} rotation={rotation} />
            )
          }
        case 'cone':
          {
            return (
              <a-cone color={this.props.color} class={'shapes'} opacity={this.props.opacity} height={this.props.height} radius-bottom={this.props.radius} radius-top={0} segments-radial={this.props.segments} position={this.props.position} rotation={rotation} />
            )
          }
        case 'sphere':
          {
            return (
              <a-sphere color={this.props.color} class={'shapes'} opacity={this.props.opacity} radius={this.props.radius} position={this.props.position} />
            )
          }
        default:
          {
            return (
              <a-box color={this.props.color} class={'shapes'} opacity={this.props.opacity} depth={this.props.depth} height={this.props.hght} width={this.props.width} position={this.props.position} rotation={rotation} />
            )
          }
      }
    }
  }
}
export default Shapes