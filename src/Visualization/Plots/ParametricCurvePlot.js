import React from "react";
import * as d3 from "d3";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const ParametricCurvePlot = (props) => {
  if (!props.graphSettings.style || !props.graphSettings.mark) {
    console.error(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }
  let dataCoordinate = [];
  let yStep =
    (props.graphSettings.parameter.domain[1] -
      props.graphSettings.parameter.domain[0]) /
    props.graphSettings.parameter.steps;
  for (
    let k = props.graphSettings.parameter.domain[0];
    k <= props.graphSettings.parameter.domain[1];
    k = k + yStep
  ) {
    dataCoordinate.push([
      props.graphSettings.mark.position.x.function(k),
      props.graphSettings.mark.position.y.function(k),
      props.graphSettings.mark.position.z.function(k),
    ]);
  }

  // Getting domain for axis
  const xDomain = props.graphSettings.mark.position.x.domain
    ? props.graphSettings.mark.position.x.domain
    : GetDomain(dataCoordinate, 0, "linear", false);

  const yDomain = props.graphSettings.mark.position.y.domain
    ? props.graphSettings.mark.position.y.domain
    : GetDomain(dataCoordinate, 1, "linear", false);

  const zDomain = props.graphSettings.mark.position.z.domain
    ? props.graphSettings.mark.position.z.domain
    : GetDomain(dataCoordinate, 2, "linear", false);

  //Adding Scale
  const xScale = d3
    .scaleLinear()
    .range([0, props.graphSettings.style.dimensions.width])
    .domain(xDomain);

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([0, props.graphSettings.style.dimensions.height]);

  const zScale = d3
    .scaleLinear()
    .domain(zDomain)
    .range([0, props.graphSettings.style.dimensions.depth]);

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

  //Adding marks

  const pointList = dataCoordinate.map((d) => ({
    x: `${xScale(d[0])}`,
    y: `${yScale(d[1])}`,
    z: `${zScale(d[2])}`,
  }));

  return (
    <>
      {xAxis}
      {yAxis}
      {zAxis}
      {box}
      <a-frame-curve-line
        points={JSON.stringify(pointList)}
        type={props.graphSettings.mark.style.curveType}
        color={
          props.graphSettings.mark.style.color
            ? props.graphSettings.mark.style.color
            : "#000000"
        }
        opacity={
          props.graphSettings.mark.style.opacity
            ? props.graphSettings.mark.style.opacity
            : 1
        }
        resolution={
          props.graphSettings.mark.style.resolution
            ? props.graphSettings.mark.style.resolution
            : 20
        }
      />
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

export default ParametricCurvePlot;
