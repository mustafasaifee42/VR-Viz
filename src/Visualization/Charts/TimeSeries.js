import React, { Component } from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const TimeSeries = (props) => {
  if (!props.graphSettings.style || !props.graphSettings.mark) {
    console.error(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }

  // Getting domain for axis

  const xDomain = props.graphSettings.mark.position.x.domain
    ? props.graphSettings.mark.position.x.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.position.x.field,
        "linear",
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
        "linear",
        props.graphSettings.mark.position.z.startFromZero
      );
  //Adding Scale

  const xScale =
    props.graphSettings.mark.position.x.scaleType === "ordinal"
      ? d3
          .scaleBand()
          .range([0, props.graphSettings.style.dimensions.width])
          .domain(xDomain)
      : d3
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

  //Adding Marks

  let meshVertices = [],
    colorMatrix = [];
  for (let i = 0; i < props.data.length - 1; i++) {
    meshVertices.push(
      xScale(props.data[i][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(
      zScale(props.data[i][props.graphSettings.mark.position.z.field])
    );
    colorMatrix.push(props.graphSettings.mark.style.fill.color);

    meshVertices.push(
      xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i + 1][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(
      zScale(props.data[i + 1][props.graphSettings.mark.position.z.field])
    );
    colorMatrix.push(props.graphSettings.mark.style.fill.color);

    meshVertices.push(
      xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i + 1][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(zScale(0));
    colorMatrix.push(props.graphSettings.mark.style.fill.color);

    meshVertices.push(
      xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i + 1][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(zScale(0));
    colorMatrix.push(props.graphSettings.mark.style.fill.color);

    meshVertices.push(
      xScale(props.data[i][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(zScale(0));
    colorMatrix.push(props.graphSettings.mark.style.fill.color);

    meshVertices.push(
      xScale(props.data[i][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(
      zScale(props.data[i][props.graphSettings.mark.position.z.field])
    );
    colorMatrix.push(props.graphSettings.mark.style.fill.color);
  }

  let borderCoordinate = [];
  for (let i = 0; i < props.data.length; i++) {
    borderCoordinate.push({
      x: xScale(props.data[i][props.graphSettings.mark.position.x.field]),
      y: yScale(props.data[i][props.graphSettings.mark.position.y.field]),
      z: zScale(props.data[i][props.graphSettings.mark.position.z.field]),
    });
  }
  for (let i = props.data.length - 1; i >= 0; i--) {
    borderCoordinate.push({
      x: xScale(props.data[i][props.graphSettings.mark.position.x.field]),
      y: yScale(props.data[i][props.graphSettings.mark.position.y.field]),
      z: 0,
    });
  }

  borderCoordinate.push({
    x: borderCoordinate[0].x,
    y: borderCoordinate[0].y,
    z: borderCoordinate[0].z,
  });

  //Axis

  const xAxis = props.graphSettings.axis["x-axis"] ? (
    <XAxis
      domain={
        props.graphSettings.mark.position.z.scaleType === "linear"
          ? xScale.ticks(
              props.graphSettings.axis["x-axis"].ticks?.noOfTicks
                ? props.graphSettings.axis["x-axis"].ticks.noOfTicks
                : 5
            )
          : xDomain
      }
      tick={props.graphSettings.axis["x-axis"].ticks}
      scale={xScale}
      orient={props.graphSettings.axis["x-axis"].orient}
      title={props.graphSettings.axis["x-axis"].title}
      dimensions={props.graphSettings.style.dimensions}
      padding={
        props.graphSettings.mark.position.z.scaleType === "linear" ? 0 : width
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
      domain={
        props.graphSettings.mark.position.z.scaleType === "linear"
          ? zScale.ticks(
              props.graphSettings.axis["z-axis"].ticks?.noOfTicks
                ? props.graphSettings.axis["z-axis"].ticks.noOfTicks
                : 5
            )
          : zDomain
      }
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

  const stroke_width = props.graphSettings.mark.style.stroke?.width
    ? props.graphSettings.mark.style.stroke?.width
    : 1;
  const stroke_color = props.graphSettings.mark.style.stroke?.color
    ? props.graphSettings.mark.style.stroke?.color
    : "#000000";
  const stroke_opacity = props.graphSettings.mark.style.stroke?.opacity
    ? props.graphSettings.mark.style.stroke?.opacity
    : 1;

  return (
    <>
      {xAxis}
      {yAxis}
      {zAxis}
      {box}
      <a-frame-mesh-from-points
        points={JSON.stringify(meshVertices)}
        color={JSON.stringify(colorMatrix)}
        stroke_bool={false}
        stroke_color={stroke_color}
        stroke_width={stroke_width}
        stroke_opacity={stroke_opacity}
        opacity={props.graphSettings.mark.style.fill.opacity}
      />
      {props.graphSettings.mark.style.stroke ? (
        <a-frame-curve-line
          points={JSON.stringify(borderCoordinate)}
          type={"line"}
          color={stroke_color}
          opacity={stroke_opacity}
          resolution={20}
        />
      ) : null}
      <a-box
        class="clickable"
        width={props.graphSettings.style.dimensions.width}
        height={props.graphSettings.style.dimensions.height}
        depth={props.graphSettings.style.dimensions.depth}
        position={`${props.graphSettings.style.dimensions.width / 2} ${
          props.graphSettings.style.dimensions.height / 2
        } ${props.graphSettings.style.dimensions.depth / 2}`}
        opacity={0}
      />
    </>
  );
};
export default TimeSeries;
