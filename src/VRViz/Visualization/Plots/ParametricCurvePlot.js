import React from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const ParametricCurvePlot = (props) => {
  if (!props.graphSettings.mark) {
    console.warn(
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
    : props.graphSettings.mark.position.x.startFromZero
      ? [0, d3.max(dataCoordinate, (d) => d[0])]
      : [
        d3.min(dataCoordinate, (d) => d[0]),
        d3.max(dataCoordinate, (d) => d[0]),
      ];

  const yDomain = props.graphSettings.mark.position.y.domain
    ? props.graphSettings.mark.position.y.domain
    : GetDomain(
      dataCoordinate,
      1,
      "linear",
      props.graphSettings.mark.position.y.startFromZero
    );

  const zDomain = props.graphSettings.mark.position.z.domain
    ? props.graphSettings.mark.position.z.domain
    : GetDomain(
      dataCoordinate,
      2,
      "linear",
      props.graphSettings.mark.position.z.startFromZero
    );

  //Adding Scale
  const xScale = d3
    .scaleLinear()
    .range([
      0,
      props.graphSettings.style?.dimensions?.width
        ? props.graphSettings.style?.dimensions?.width
        : 10,
    ])
    .domain(xDomain);

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([
      0,
      props.graphSettings.style?.dimensions?.height
        ? props.graphSettings.style?.dimensions?.height
        : 10,
    ]);

  const zScale = d3
    .scaleLinear()
    .domain(zDomain)
    .range([
      0,
      props.graphSettings.style?.dimensions?.depth
        ? props.graphSettings.style?.dimensions?.depth
        : 10,
    ]);

  //Axis
  const xAxis = props.graphSettings.axis ? (
    props.graphSettings.axis["x-axis"] ? (
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
        dimensions={
          props.graphSettings.style?.dimensions
            ? props.graphSettings.style?.dimensions
            : { width: 10, height: 10, depth: 10 }
        }
        grid={props.graphSettings.axis["x-axis"].grid}
      />
    ) : null
  ) : null;

  const yAxis = props.graphSettings.axis ? (
    props.graphSettings.axis["y-axis"] ? (
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
        dimensions={
          props.graphSettings.style?.dimensions
            ? props.graphSettings.style?.dimensions
            : { width: 10, height: 10, depth: 10 }
        }
        grid={props.graphSettings.axis["y-axis"].grid}
      />
    ) : null
  ) : null;

  const zAxis = props.graphSettings.axis ? (
    props.graphSettings.axis["z-axis"] ? (
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
        dimensions={
          props.graphSettings.style?.dimensions
            ? props.graphSettings.style?.dimensions
            : { width: 10, height: 10, depth: 10 }
        }
        grid={props.graphSettings.axis["z-axis"].grid}
      />
    ) : null
  ) : null;

  const box = props.graphSettings.axis ? (
    props.graphSettings.axis["axis-box"] ? (
      <AxisBox
        width={
          props.graphSettings.style?.dimensions?.width
            ? props.graphSettings.style?.dimensions?.width
            : 10
        }
        height={
          props.graphSettings.style?.dimensions?.height
            ? props.graphSettings.style?.dimensions?.height
            : 10
        }
        depth={
          props.graphSettings.style?.dimensions?.depth
            ? props.graphSettings.style?.dimensions?.depth
            : 10
        }
        color={
          props.graphSettings.axis["axis-box"].color
            ? props.graphSettings.axis["axis-box"].color
            : "#000000"
        }
      />
    ) : null
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
        type={
          props.graphSettings.mark.style?.curveType
            ? props.graphSettings.mark.style?.curveType
            : "line"
        }
        color={
          props.graphSettings.mark.style?.color
            ? props.graphSettings.mark.style?.color
            : "#ff0000"
        }
        opacity={
          props.graphSettings.mark.style?.opacity
            ? props.graphSettings.mark.style?.opacity
            : 1
        }
        resolution={
          props.graphSettings.mark.style?.resolution
            ? props.graphSettings.mark.style?.resolution
            : 20
        }
      />
      <a-box
        class="clickable"
        width={
          props.graphSettings.style?.dimensions?.width
            ? props.graphSettings.style?.dimensions?.width
            : 10
        }
        height={
          props.graphSettings.style?.dimensions?.height
            ? props.graphSettings.style?.dimensions?.height
            : 10
        }
        depth={
          props.graphSettings.style?.dimensions?.depth
            ? props.graphSettings.style?.dimensions?.depth
            : 10
        }
        position={`${props.graphSettings.style?.dimensions?.width
            ? props.graphSettings.style?.dimensions?.width / 2
            : 5
          } ${props.graphSettings.style?.dimensions?.height
            ? props.graphSettings.style?.dimensions?.height / 2
            : 5
          } ${props.graphSettings.style?.dimensions?.depth
            ? props.graphSettings.style?.dimensions?.depth / 2
            : 5
          }`}
        opacity={0}
      />
    </>
  );
};

export default ParametricCurvePlot;
