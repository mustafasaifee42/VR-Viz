import React, { Component } from 'react';

class Shapes extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    let rotation = '0 0 0';
    if (this.props.rotation) {
      rotation = this.props.rotation
    }
    if (this.props.hover) {
      switch (this.props.type) {
        case 'box':
          {
            return (
              <a-box id={this.props.id} data={this.props.data} color={this.props.color} class={`shapes ${this.props.class}`} opacity={this.props.opacity} depth={this.props.depth} height={this.props.height} width={this.props.width} position={this.props.position} rotation={rotation} change-color-on-hover={`hoverText:${this.props.hoverText}; prevOpacity:${this.props.opacity};focusedObjectOpacity: ${this.props.hover.focusedObject.opacity};focusedObjectfill:${this.props.hover.focusedObject.fill};nonFocusedObjectOpacity:${this.props.hover.nonFocusedObject.opacity};labelWidth:${this.props.hover.label.width};lineHeight:${this.props.hover.label.lineHeight};labelHeight:${this.props.hover.label.height};labelAlign:${this.props.hover.label.align};wrapCount:${this.props.hover.label.wrapCount};labelBackgroundColor:${this.props.hover.label.backgroundColor};labelFontColor:${this.props.hover.label.fontColor};labelPosition:${this.props.hover.label.position};labelRotation:${this.props.hover.label.rotation};prevColor:${this.props.color};graphID:${this.props.graphID};backgroundOpacity:${this.props.hover.label.backgroundOpacity}`} />
            )
          }
        case 'cylinder':
          {
            return (
              <a-cylinder id={this.props.id} data={this.props.data} color={this.props.color} class={`shapes ${this.props.class}`} opacity={this.props.opacity} height={this.props.height} radius={this.props.radius} segments-radial={this.props.segments} position={this.props.position} rotation={rotation} change-color-on-hover={`hoverText:${this.props.hoverText}; prevOpacity:${this.props.opacity};focusedObjectOpacity: ${this.props.hover.focusedObject.opacity};focusedObjectfill:${this.props.hover.focusedObject.fill};nonFocusedObjectOpacity:${this.props.hover.nonFocusedObject.opacity};labelWidth:${this.props.hover.label.width};lineHeight:${this.props.hover.label.lineHeight};labelHeight:${this.props.hover.label.height};labelAlign:${this.props.hover.label.align};wrapCount:${this.props.hover.label.wrapCount};labelBackgroundColor:${this.props.hover.label.backgroundColor};labelFontColor:${this.props.hover.label.fontColor};labelPosition:${this.props.hover.label.position};labelRotation:${this.props.hover.label.rotation};prevColor:${this.props.color};graphID:${this.props.graphID};backgroundOpacity:${this.props.hover.label.backgroundOpacity}`} />
            )
          }
        case 'cone':
          {
            return (
              <a-cone id={this.props.id} data={this.props.data} color={this.props.color} class={`shapes ${this.props.class}`} opacity={this.props.opacity} height={this.props.height} radius-bottom={this.props.radius} radius-top={0} segments-radial={this.props.segments} position={this.props.position} rotation={rotation} change-color-on-hover={`hoverText:${this.props.hoverText}; prevOpacity:${this.props.opacity};focusedObjectOpacity: ${this.props.hover.focusedObject.opacity};focusedObjectfill:${this.props.hover.focusedObject.fill};nonFocusedObjectOpacity:${this.props.hover.nonFocusedObject.opacity};labelWidth:${this.props.hover.label.width};lineHeight:${this.props.hover.label.lineHeight};labelHeight:${this.props.hover.label.height};labelAlign:${this.props.hover.label.align};wrapCount:${this.props.hover.label.wrapCount};labelBackgroundColor:${this.props.hover.label.backgroundColor};labelFontColor:${this.props.hover.label.fontColor};labelPosition:${this.props.hover.label.position};labelRotation:${this.props.hover.label.rotation};prevColor:${this.props.color};graphID:${this.props.graphID};backgroundOpacity:${this.props.hover.label.backgroundOpacity}`} />
            )
          }
        case 'sphere':
          {
            return (
              <a-sphere id={this.props.id} data={this.props.data} color={this.props.color} class={`shapes ${this.props.class}`} opacity={this.props.opacity} radius={this.props.radius} position={this.props.position} change-color-on-hover={`hoverText:${this.props.hoverText}; prevOpacity:${this.props.opacity};focusedObjectOpacity: ${this.props.hover.focusedObject.opacity};focusedObjectfill:${this.props.hover.focusedObject.fill};nonFocusedObjectOpacity:${this.props.hover.nonFocusedObject.opacity};labelWidth:${this.props.hover.label.width};lineHeight:${this.props.hover.label.lineHeight};labelHeight:${this.props.hover.label.height};labelAlign:${this.props.hover.label.align};wrapCount:${this.props.hover.label.wrapCount};labelBackgroundColor:${this.props.hover.label.backgroundColor};labelFontColor:${this.props.hover.label.fontColor};labelPosition:${this.props.hover.label.position};labelRotation:${this.props.hover.label.rotation};prevColor:${this.props.color};graphID:${this.props.graphID};backgroundOpacity:${this.props.hover.label.backgroundOpacity}`} />
            )
          }
        default:
          {
            return (
              <a-box id={this.props.id} data={this.props.data} color={this.props.color} class={`shapes ${this.props.class}`} opacity={this.props.opacity} depth={this.props.depth} height={this.props.hght} width={this.props.width} position={this.props.position} rotation={rotation} change-color-on-hover={`hoverText:${this.props.hoverText}; prevOpacity:${this.props.opacity};focusedObjectOpacity: ${this.props.hover.focusedObject.opacity};focusedObjectfill:${this.props.hover.focusedObject.fill};nonFocusedObjectOpacity:${this.props.hover.nonFocusedObject.opacity};labelWidth:${this.props.hover.label.width};lineHeight:${this.props.hover.label.lineHeight};labelHeight:${this.props.hover.label.height};labelAlign:${this.props.hover.label.align};wrapCount:${this.props.hover.label.wrapCount};labelBackgroundColor:${this.props.hover.label.backgroundColor};labelFontColor:${this.props.hover.label.fontColor};labelPosition:${this.props.hover.label.position};labelRotation:${this.props.hover.label.rotation};prevColor:${this.props.color};graphID:${this.props.graphID};backgroundOpacity:${this.props.hover.label.backgroundOpacity}`} />
            )
          }
      }
    }
    else {
      switch (this.props.type) {
        case 'box':
          {
            return (
              <a-box id={this.props.id} data={this.props.data} color={this.props.color} class={`shapes ${this.props.class}`} opacity={this.props.opacity} depth={this.props.depth} height={this.props.height} width={this.props.width} position={this.props.position} rotation={rotation} />
            )
          }
        case 'cylinder':
          {
            return (
              <a-cylinder id={this.props.id} data={this.props.data} color={this.props.color} class={`shapes ${this.props.class}`} opacity={this.props.opacity} height={this.props.height} radius={this.props.radius} segments-radial={this.props.segments} position={this.props.position} rotation={rotation} />
            )
          }
        case 'cone':
          {
            return (
              <a-cone id={this.props.id} data={this.props.data} color={this.props.color} class={`shapes ${this.props.class}`} opacity={this.props.opacity} height={this.props.height} radius-bottom={this.props.radius} radius-top={0} segments-radial={this.props.segments} position={this.props.position} rotation={rotation} />
            )
          }
        case 'sphere':
          {
            return (
              <a-sphere id={this.props.id} data={this.props.data} color={this.props.color} class={`shapes ${this.props.class}`} opacity={this.props.opacity} radius={this.props.radius} position={this.props.position} />
            )
          }
        default:
          {
            return (
              <a-box id={this.props.id} data={this.props.data} color={this.props.color} class={`shapes ${this.props.class}`} opacity={this.props.opacity} depth={this.props.depth} height={this.props.hght} width={this.props.width} position={this.props.position} rotation={rotation} />
            )
          }
      }
    }
  }
}
export default Shapes