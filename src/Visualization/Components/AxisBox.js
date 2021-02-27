import React from "react";

const AxisBox = (props) => (
  <a-entity
    line={`start: 0 0 0; end: ${props.width} 0 0; color: ${props.color}`}
    line__2={`start: 0 0 0; end: 0 ${props.height} 0; color: ${props.color}`}
    line__3={`start: 0 0 0; end: 0 0 ${props.depth}; color: ${props.color}`}
    line__4={`start: ${props.width} ${props.height} ${props.depth}; end: 0 ${props.height} ${props.depth}; color: ${props.color}`}
    line__5={`start: ${props.width} ${props.height} ${props.depth}; end: ${props.width} 0 ${props.depth}; color: ${props.color}`}
    line__6={`start: ${props.width} ${props.height} ${props.depth}; end: ${props.width} ${props.height} 0; color: ${props.color}`}
    line__7={`start: ${props.width} 0 ${props.depth}; end: 0 0 ${props.depth}; color: ${props.color}`}
    line__8={`start: ${props.width} 0 ${props.depth}; end: ${props.width} 0 0; color: ${props.color}`}
    line__9={`start: 0 ${props.height} 0; end: 0 ${props.height} ${props.depth}; color: ${props.color}`}
    line__10={`start: 0 ${props.height} 0; end: ${props.width} ${props.height} 0; color: ${props.color}`}
    line__11={`start: 0 0 ${props.depth}; end: 0 ${props.height} ${props.depth}; color: ${props.color}`}
    line__12={`start: ${props.width} 0 0; end: ${props.width} ${props.height} 0; color: ${props.color}`}
  />
);

export default AxisBox;
