import React from "react";
import * as d3 from "d3";
import Shape from "../Components/Shape";

const TreeMap = (props) => {
  if (!props.data || !props.graphSettings.style || !props.graphSettings.mark) {
    console.warn(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }

  const treemap = d3
    .treemap()
    .size([
      props.graphSettings.style.dimensions.width,
      props.graphSettings.style.dimensions.depth,
    ])
    .paddingInner(props.graphSettings.mark.style.paddingInner)
    .paddingOuter(props.graphSettings.mark.style.paddingOuter);

  const root = d3
    .hierarchy(this.state.data, (d) => d.children)
    .sum((d) => d.size);

  const tree = treemap(root);

  const parent = tree
    .leaves()
    .map((d) =>
      parent.indexOf(d.parent.data.name) === -1 && d.parent.data.name !== null
        ? d.parent.data.name
        : null
    );

  const heightDomain = props.graphSettings.mark.style.extrusion.domain
    ? props.graphSettings.mark.style.extrusion.domain
    : props.graphSettings.mark.style.extrusion.startFromZero
    ? [
        0,
        d3.max(
          tree.leaves(),
          (d) => d.data[props.graphSettings.mark.style.extrusion.field]
        ),
      ]
    : [
        d3.min(
          tree.leaves(),
          (d) => d.data[props.graphSettings.mark.style.extrusion.field]
        ),
        d3.max(
          tree.leaves(),
          (d) => d.data[props.graphSettings.mark.style.extrusion.field]
        ),
      ];

  const heightScale = props.graphSettings.mark.style.extrusion.value
    ? d3
        .scaleLinear()
        .domain(heightDomain)
        .range(props.graphSettings.mark.style.extrusion.value)
    : d3
        .scaleLinear()
        .domain(heightDomain)
        .range([0, props.graphSettings.style.dimensions.height]);

  const colorScale = props.graphSettings.mark.style.fill.scaleType
    ? d3
        .scaleOrdinal()
        .domain(parent)
        .range(
          props.graphSettings.mark.style.fill.color
            ? props.graphSettings.mark.style.fill.color
            : d3.schemeCategory10
        )
    : null;

  //Adding marks
  const marks = tree.leaves().map((d, i) => {
    const width = (d.x1 - d.x0).toFixed(3);

    const depth = (d.y1 - d.y0).toFixed(3);

    const hght = heightScale(
      d.data[props.graphSettings.mark.style.extrusion.field]
    ).toFixed(3);

    const position = `${(d.x0 + (d.x1 - d.x0) / 2).toFixed(3)} ${hght / 2} ${(
      d.y0 +
      (d.y1 - d.y0) / 2
    ).toFixed(3)}`;

    const color = colorScale
      ? colorScale(d.parent.data.name)
      : props.graphSettings.mark.style.fill.color
      ? props.graphSettings.mark.style.fill.color
      : "#000000";

    const hoverText = props.graphSettings.mark.mouseOver?.label
      ? props.graphSettings.mark.mouseOver.label.value(d)
      : null;

    const className =
      typeof props.graphSettings.mark.class === "function"
        ? `clickable ${props.graphSettings.mark.class(d, i)}`
        : "clickable";

    const idName =
      typeof props.graphSettings.mark.id === "function"
        ? props.graphSettings.mark.id(d, i)
        : null;

    return (
      <Shape
        key={i}
        type={"box"}
        color={`${color}`}
        opacity={
          props.graphSettings.mark.style.fill.opacity
            ? props.graphSettings.mark.style.fill.opacity
            : 1
        }
        depth={`${depth}`}
        height={`${hght}`}
        width={`${width}`}
        radius={"0"}
        segments={
          props.graphSettings.mark.style.segments
            ? `${props.graphSettings.mark.style.segments}`
            : "16"
        }
        position={position}
        hover={props.graphSettings.mark.mouseOver}
        hoverText={hoverText}
        graphID={props.graphSettings.index}
        class={className}
        id={idName}
        data={JSON.stringify(d)}
      />
    );
  });

  return <>{marks}</>;
};

export default TreeMap;
