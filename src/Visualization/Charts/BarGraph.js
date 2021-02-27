import React from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import Shape from "../Components/Shape";
import AxisBox from "../Components/AxisBox";
import { XAxis, YAxis, ZAxis } from "../Components/Axis";

const BarGraph = (props) => {
  if (!props.data || !props.graphSettings.style || !props.graphSettings.mark) {
    console.error(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }

  const xDomain = props.graphSettings.mark.position.x.domain
    ? props.graphSettings.mark.position.x.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.position.x.field,
        "ordinal",
        props.graphSettings.mark.position.x.startFromZero
      );

  const yDomain = props.graphSettings.mark.style.height.domain
    ? props.graphSettings.mark.style.height.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.style.height.field,
        "linear",
        props.graphSettings.mark.style.height.startFromZero
      );

  const zDomain = props.graphSettings.mark.position.z.domain
    ? props.graphSettings.mark.position.z.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.position.z.field,
        "ordinal",
        props.graphSettings.mark.position.z.startFromZero
      );

  const colorDomain = props.graphSettings.mark.style.fill.scaleType
    ? props.graphSettings.mark.style.fill.domain
      ? props.graphSettings.mark.style.fill.domain
      : GetDomain(
          props.data,
          props.graphSettings.mark.style.fill.field,
          props.graphSettings.mark.style.fill.scaleType,
          props.graphSettings.mark.style.fill.startFromZero
        )
    : null;

  //Adding Scale

  const xScale = d3
    .scaleBand()
    .range([0, props.graphSettings.style.dimensions.width])
    .domain(xDomain)
    .paddingInner(props.graphSettings.mark.style.padding.x);

  const width = xScale.bandwidth();

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([0, props.graphSettings.style.dimensions.height]);

  const zScale = d3
    .scaleBand()
    .domain(zDomain)
    .range([0, props.graphSettings.style.dimensions.depth])
    .paddingInner(props.graphSettings.mark.style.padding.z);

  const depth = zScale.bandwidth();

  const radius = depth > width ? width / 2 : depth / 2;

  const colorRange = props.graphSettings.mark.style.fill.color
    ? props.graphSettings.mark.style.fill.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark.style.fill.scaleType
    ? props.graphSettings.mark.style.fill.scaleType === "ordinal"
      ? d3.scaleOrdinal().domain(colorDomain).range(colorRange)
      : d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;

  //Adding marks
  const marks = props.data.map((d, i) => {
    const hght =
      yScale(d[props.graphSettings.mark.style.height.field]) === 0
        ? 0.000000000001
        : yScale(d[props.graphSettings.mark.style.height.field]);

    const color = colorScale
      ? colorScale(d[props.graphSettings.mark.style.fill.field])
      : props.graphSettings.mark.style.fill.color
      ? props.graphSettings.mark.style.fill.color
      : "#000000";

    const position =
      props.graphSettings.mark.type === "cone" ||
      props.graphSettings.mark.type === "cylinder"
        ? `${xScale(d[props.graphSettings.mark.position.x.field]) + radius} ${
            hght / 2
          } ${zScale(d[props.graphSettings.mark.position.z.field]) + radius}`
        : `${
            xScale(d[props.graphSettings.mark.position.x.field]) + width / 2
          } ${hght / 2} ${
            zScale(d[props.graphSettings.mark.position.z.field]) + depth / 2
          }`;

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
        type={
          props.graphSettings.mark.type ? props.graphSettings.mark.type : "box"
        }
        color={`${color}`}
        opacity={
          props.graphSettings.mark.style.fill.opacity
            ? props.graphSettings.mark.style.fill.opacity
            : 1
        }
        depth={`${depth}`}
        height={`${hght}`}
        width={`${width}`}
        radius={`${radius}`}
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

  //Axis
  const xAxis = props.graphSettings.axis["x-axis"] ? (
    <XAxis
      domain={xDomain}
      tick={props.graphSettings.axis["x-axis"].ticks}
      scale={xScale}
      orient={props.graphSettings.axis["x-axis"].orient}
      title={props.graphSettings.axis["x-axis"].title}
      dimensions={props.graphSettings.style.dimensions}
      padding={
        props.graphSettings.mark.type === "cylinder" ||
        props.graphSettings.mark.type === "cone"
          ? radius * 2
          : width
      }
      grid={props.graphSettings.axis["x-axis"].grid}
    />
  ) : null;

  const yAxis = props.graphSettings.axis["y-axis"] ? (
    <YAxis
      domain={yScale.ticks(
        props.graphSettings.axis["y-axis"].ticks?.noOfTicks
          ? props.graphSettings.axis["y-axis"].ticks.noOfTicks
          : 5
      )}
      tick={props.graphSettings.axis["y-axis"].ticks}
      scale={yScale}
      orient={props.graphSettings.axis["y-axis"].orient}
      title={props.graphSettings.axis["y-axis"].title}
      dimensions={props.graphSettings.style.dimensions}
      grid={props.graphSettings.axis["y-axis"].grid}
    />
  ) : null;

  const zAxis = props.graphSettings.axis["z-axis"] ? (
    <ZAxis
      domain={zDomain}
      tick={props.graphSettings.axis["z-axis"].ticks}
      scale={zScale}
      orient={props.graphSettings.axis["z-axis"].orient}
      title={props.graphSettings.axis["z-axis"].title}
      dimensions={props.graphSettings.style.dimensions}
      padding={
        props.graphSettings.mark.type === "cylinder" ||
        props.graphSettings.mark.type === "cone"
          ? radius * 2
          : width
      }
      grid={props.graphSettings.axis["z-axis"].grid}
    />
  ) : null;

  const box = props.graphSettings.axis["axis-box"] ? (
    <AxisBox
      width={props.graphSettings.style.dimensions.width}
      height={props.graphSettings.style.dimensions.height}
      depth={props.graphSettings.style.dimensions.depth}
      color={
        props.graphSettings.axis["axis-box"].color
          ? props.graphSettings.axis["axis-box"].color
          : "#000000"
      }
    />
  ) : null;

  return (
    <>
      {marks}
      {xAxis}
      {yAxis}
      {zAxis}
      {box}
    </>
  );
};

export default BarGraph;
