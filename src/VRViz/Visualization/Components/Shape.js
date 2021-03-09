import React from "react";

const Shape = (props) => {
  const rotation = props.rotation ? props.rotation : "0 0 0";
  if (props.hover) {
    switch (props.type) {
      case "box": {
        return (
          <a-box
            id={props.id}
            data={props.data}
            color={props.color}
            class={`shapes ${props.class}`}
            opacity={props.opacity}
            depth={props.depth}
            height={props.height}
            width={props.width}
            position={props.position}
            rotation={rotation}
            change-color-on-hover={`hoverText:${props.hoverText}; prevOpacity:${props.opacity};focusedObjectOpacity: ${props.hover.focusedObject.opacity};focusedObjectfill:${props.hover.focusedObject.fill};nonFocusedObjectOpacity:${props.hover.nonFocusedObject.opacity};labelWidth:${props.hover.label.width};lineHeight:${props.hover.label.lineHeight};labelHeight:${props.hover.label.height};labelAlign:${props.hover.label.align};wrapCount:${props.hover.label.wrapCount};labelBackgroundColor:${props.hover.label.backgroundColor};labelFontColor:${props.hover.label.fontColor};labelPosition:${props.hover.label.position};labelRotation:${props.hover.label.rotation};prevColor:${props.color};graphID:${props.graphID};backgroundOpacity:${props.hover.label.backgroundOpacity}`}
          />
        );
      }
      case "cylinder": {
        return (
          <a-cylinder
            id={props.id}
            data={props.data}
            color={props.color}
            class={`shapes ${props.class}`}
            opacity={props.opacity}
            height={props.height}
            radius={props.radius}
            segments-radial={props.segments}
            position={props.position}
            rotation={rotation}
            change-color-on-hover={`hoverText:${props.hoverText}; prevOpacity:${props.opacity};focusedObjectOpacity: ${props.hover.focusedObject.opacity};focusedObjectfill:${props.hover.focusedObject.fill};nonFocusedObjectOpacity:${props.hover.nonFocusedObject.opacity};labelWidth:${props.hover.label.width};lineHeight:${props.hover.label.lineHeight};labelHeight:${props.hover.label.height};labelAlign:${props.hover.label.align};wrapCount:${props.hover.label.wrapCount};labelBackgroundColor:${props.hover.label.backgroundColor};labelFontColor:${props.hover.label.fontColor};labelPosition:${props.hover.label.position};labelRotation:${props.hover.label.rotation};prevColor:${props.color};graphID:${props.graphID};backgroundOpacity:${props.hover.label.backgroundOpacity}`}
          />
        );
      }
      case "cone": {
        return (
          <a-cone
            id={props.id}
            data={props.data}
            color={props.color}
            class={`shapes ${props.class}`}
            opacity={props.opacity}
            height={props.height}
            radius-bottom={props.radius}
            radius-top={0}
            segments-radial={props.segments}
            position={props.position}
            rotation={rotation}
            change-color-on-hover={`hoverText:${props.hoverText}; prevOpacity:${props.opacity};focusedObjectOpacity: ${props.hover.focusedObject.opacity};focusedObjectfill:${props.hover.focusedObject.fill};nonFocusedObjectOpacity:${props.hover.nonFocusedObject.opacity};labelWidth:${props.hover.label.width};lineHeight:${props.hover.label.lineHeight};labelHeight:${props.hover.label.height};labelAlign:${props.hover.label.align};wrapCount:${props.hover.label.wrapCount};labelBackgroundColor:${props.hover.label.backgroundColor};labelFontColor:${props.hover.label.fontColor};labelPosition:${props.hover.label.position};labelRotation:${props.hover.label.rotation};prevColor:${props.color};graphID:${props.graphID};backgroundOpacity:${props.hover.label.backgroundOpacity}`}
          />
        );
      }
      case "sphere": {
        return (
          <a-sphere
            id={props.id}
            data={props.data}
            color={props.color}
            class={`shapes ${props.class}`}
            opacity={props.opacity}
            radius={props.radius}
            position={props.position}
            change-color-on-hover={`hoverText:${props.hoverText}; prevOpacity:${props.opacity};focusedObjectOpacity: ${props.hover.focusedObject.opacity};focusedObjectfill:${props.hover.focusedObject.fill};nonFocusedObjectOpacity:${props.hover.nonFocusedObject.opacity};labelWidth:${props.hover.label.width};lineHeight:${props.hover.label.lineHeight};labelHeight:${props.hover.label.height};labelAlign:${props.hover.label.align};wrapCount:${props.hover.label.wrapCount};labelBackgroundColor:${props.hover.label.backgroundColor};labelFontColor:${props.hover.label.fontColor};labelPosition:${props.hover.label.position};labelRotation:${props.hover.label.rotation};prevColor:${props.color};graphID:${props.graphID};backgroundOpacity:${props.hover.label.backgroundOpacity}`}
          />
        );
      }
      default: {
        return (
          <a-box
            id={props.id}
            data={props.data}
            color={props.color}
            class={`shapes ${props.class}`}
            opacity={props.opacity}
            depth={props.depth}
            height={props.hght}
            width={props.width}
            position={props.position}
            rotation={rotation}
            change-color-on-hover={`hoverText:${props.hoverText}; prevOpacity:${props.opacity};focusedObjectOpacity: ${props.hover.focusedObject.opacity};focusedObjectfill:${props.hover.focusedObject.fill};nonFocusedObjectOpacity:${props.hover.nonFocusedObject.opacity};labelWidth:${props.hover.label.width};lineHeight:${props.hover.label.lineHeight};labelHeight:${props.hover.label.height};labelAlign:${props.hover.label.align};wrapCount:${props.hover.label.wrapCount};labelBackgroundColor:${props.hover.label.backgroundColor};labelFontColor:${props.hover.label.fontColor};labelPosition:${props.hover.label.position};labelRotation:${props.hover.label.rotation};prevColor:${props.color};graphID:${props.graphID};backgroundOpacity:${props.hover.label.backgroundOpacity}`}
          />
        );
      }
    }
  } else {
    switch (props.type) {
      case "box": {
        return (
          <a-box
            id={props.id}
            data={props.data}
            color={props.color}
            class={`shapes ${props.class}`}
            opacity={props.opacity}
            depth={props.depth}
            height={props.height}
            width={props.width}
            position={props.position}
            rotation={rotation}
          />
        );
      }
      case "cylinder": {
        return (
          <a-cylinder
            id={props.id}
            data={props.data}
            color={props.color}
            class={`shapes ${props.class}`}
            opacity={props.opacity}
            height={props.height}
            radius={props.radius}
            segments-radial={props.segments}
            position={props.position}
            rotation={rotation}
          />
        );
      }
      case "cone": {
        return (
          <a-cone
            id={props.id}
            data={props.data}
            color={props.color}
            class={`shapes ${props.class}`}
            opacity={props.opacity}
            height={props.height}
            radius-bottom={props.radius}
            radius-top={0}
            segments-radial={props.segments}
            position={props.position}
            rotation={rotation}
          />
        );
      }
      case "sphere": {
        return (
          <a-sphere
            id={props.id}
            data={props.data}
            color={props.color}
            class={`shapes ${props.class}`}
            opacity={props.opacity}
            radius={props.radius}
            position={props.position}
          />
        );
      }
      default: {
        return (
          <a-box
            id={props.id}
            data={props.data}
            color={props.color}
            class={`shapes ${props.class}`}
            opacity={props.opacity}
            depth={props.depth}
            height={props.hght}
            width={props.width}
            position={props.position}
            rotation={rotation}
          />
        );
      }
    }
  }
};

export default Shape;
