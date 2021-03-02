import React from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import Shape from "../Components/Shape";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const ConnectedScatterPlot = (props) => {
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
        "linear",
        props.graphSettings.mark.position.x.startFromZero
      );

  const yDomain = props.graphSettings.mark.position.y.domain
    ? props.graphSettings.mark.position.y.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.position.y.field,
        "liner",
        props.graphSettings.mark.position.y.startFromZero
      );

  const zDomain = props.graphSettings.mark.position.z.domain
    ? props.graphSettings.mark.position.z.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.position.z.field,
        "linear",
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

  const radiusDomain = !props.graphSettings.mark.style.radius.domain
    ? GetDomain(
        props.data,
        props.graphSettings.mark.style.radius.field,
        "linear",
        props.graphSettings.mark.style.radius.startFromZero
      )
    : props.graphSettings.mark.style.radius.domain;

  //Adding Scale

  const xScale = d3
    .scaleLinear()
    .domain(xDomain)
    .range([0, props.graphSettings.style.dimensions.width]);

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([0, props.graphSettings.style.dimensions.height]);

  const zScale = d3
    .scaleLinear()
    .domain(zDomain)
    .range([0, props.graphSettings.style.dimensions.depth]);

  const colorRange = props.graphSettings.mark.style.fill.color
    ? props.graphSettings.mark.style.fill.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark.style.fill.scaleType
    ? props.graphSettings.mark.style.fill.scaleType === "linear"
      ? d3.scaleLinear().domain(colorDomain).range(colorRange)
      : d3.scaleOrdinal().domain(colorDomain).range(colorRange)
    : null;

  const radiusScale = props.graphSettings.mark.style.radius.scaleType
    ? d3
        .scaleLinear()
        .domain(radiusDomain)
        .range(props.graphSettings.mark.style.radius.value)
    : null;

  //Adding marks
  const marks = props.data.map((d, i) => {
    const color = colorScale
      ? colorScale(d[props.graphSettings.mark.style.fill.field])
      : props.graphSettings.mark.style.fill.color
      ? props.graphSettings.mark.style.fill.color
      : "#000000";

    const radius = radiusScale
      ? radiusScale(d[props.graphSettings.mark.style.radius.field])
      : props.graphSettings.mark.style.radius.value
      ? props.graphSettings.mark.style.radius.value
      : 5;

    const position = `${xScale(
      d[props.graphSettings.mark.position.x.field]
    )} ${yScale(d[props.graphSettings.mark.position.y.field])} ${zScale(
      d[props.graphSettings.mark.position.z.field]
    )}`;

    const color = colorScale
      ? colorScale(d[props.graphSettings.mark.style.fill.field])
      : props.graphSettings.mark.style.fill.color;

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
          props.graphSettings.mark.type
            ? props.graphSettings.mark.type
            : "sphere"
        }
        color={color}
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

  // labels
  const labels = props.graphSettings.mark.label
    ? props.graphSettings.mark.points.style.radius.scaleType
      ? props.data.map((d, i) => (
          <a-text
            key={i}
            opacity={
              props.graphSettings.mark.label.style.opacity
                ? props.graphSettings.mark.label.style.opacity
                : 1
            }
            color={
              props.graphSettings.mark.label.style.color
                ? props.graphSettings.mark.label.style.color
                : "#000000"
            }
            width={props.graphSettings.mark.label.style.fontSize}
            value={`${d[props.graphSettings.mark.label.field]}`}
            anchor="align"
            side="double"
            align="left"
            position={`${
              xScale(d[props.graphSettings.mark.position.x.field]) +
              0.05 +
              radiusScale(d[props.graphSettings.mark.points.style.radius.field])
            } ${yScale(d[props.graphSettings.mark.position.y.field])} ${zScale(
              d[props.graphSettings.mark.position.z.field]
            )}`}
            billboard={props.graphSettings.mark.label.billboarding}
          />
        ))
      : props.data.map((d, i) => (
          <a-text
            key={i}
            opacity={
              props.graphSettings.mark.label.style.opacity
                ? props.graphSettings.mark.label.style.opacity
                : 1
            }
            color={
              props.graphSettings.mark.label.style.color
                ? props.graphSettings.mark.label.style.color
                : "#000000"
            }
            width={props.graphSettings.mark.label.style.fontSize}
            value={`${d[props.graphSettings.mark.label.field]}`}
            anchor="align"
            side="double"
            align="left"
            position={`${
              props.graphSettings.mark.style.radius.value
                ? xScale(d[props.graphSettings.mark.position.x.field]) +
                  0.05 +
                  props.graphSettings.mark.points.style.radius.value
                : xScale(d[props.graphSettings.mark.position.x.field]) +
                  0.05 +
                  5
            } ${yScale(d[props.graphSettings.mark.position.y.field])} ${zScale(
              d[props.graphSettings.mark.position.z.field]
            )}`}
            billboard={props.graphSettings.mark.label.billboarding}
          />
        ))
    : null;

  const pointList = props.data.map((d, i) => ({
    x: `${xScale(d[props.graphSettings.mark.position.x.field])}`,
    y: `${yScale(d[props.graphSettings.mark.position.y.field])}`,
    z: `${zScale(d[props.graphSettings.mark.position.z.field])}`,
  }));

  //Axis
  const xAxis = props.graphSettings.axis["x-axis"] ? (
    <XAxis
      domain={xScale.ticks(
        props.graphSettings.axis["x-axis"].ticks?.noOfTicks
          ? props.graphSettings.axis["x-axis"].ticks.noOfTicks
          : 5
      )}
      tick={props.graphSettings.axis["x-axis"].ticks}
      scale={xScale}
      orient={props.graphSettings.axis["x-axis"].orient}
      title={props.graphSettings.axis["x-axis"].title}
      dimensions={props.graphSettings.style.dimensions}
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
      domain={zScale.ticks(
        props.graphSettings.axis["z-axis"].ticks?.noOfTicks
          ? props.graphSettings.axis["z-axis"].ticks.noOfTicks
          : 5
      )}
      tick={props.graphSettings.axis["z-axis"].ticks}
      scale={zScale}
      orient={props.graphSettings.axis["z-axis"].orient}
      title={props.graphSettings.axis["z-axis"].title}
      dimensions={props.graphSettings.style.dimensions}
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
      <a-frame-curve-line
        points={JSON.stringify(pointList)}
        type={
          props.graphSettings.mark.line.style.stroke.curveType
            ? props.graphSettings.mark.line.style.stroke.curveType
            : "line"
        }
        stroke_width={
          props.graphSettings.mark.line.style.stroke.width
            ? props.graphSettings.mark.line.style.stroke.width
            : 1
        }
        color={
          props.graphSettings.mark.line.style.stroke.color
            ? props.graphSettings.mark.line.style.stroke.color
            : "#000000"
        }
        opacity={
          props.graphSettings.mark.line.style.stroke.opacity
            ? props.graphSettings.mark.line.style.stroke.opacity
            : 1
        }
        resolution={props.graphSettings.mark.line.style.stroke.resolution}
      />
      {marks}
      {labels}
      {xAxis}
      {yAxis}
      {zAxis}
      {box}
    </>
  );
};

export default ConnectedScatterPlot;
