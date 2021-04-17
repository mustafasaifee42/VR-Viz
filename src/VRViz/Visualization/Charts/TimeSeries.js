import React from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const TimeSeries = (props) => {
  if (!props.graphSettings.mark) {
    console.warn(
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
      props.graphSettings.mark.position.x.scaleType
        ? props.graphSettings.mark.position.x.scaleType
        : "linear",
      props.graphSettings.mark.position.x.startFromZero
    );

  const yDomain = props.graphSettings.mark.position.y.domain
    ? props.graphSettings.mark.position.y.domain
    : GetDomain(
      props.data,
      props.graphSettings.mark.position.y.field,
      "linear",
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
  //Adding Scale
  const xScale =
    props.graphSettings.mark.position.x.scaleType === "ordinal"
      ? d3
        .scaleBand()
        .range([
          0,
          props.graphSettings.style?.dimensions?.width
            ? props.graphSettings.style?.dimensions?.width
            : 10,
        ])
        .domain(xDomain)
      : d3
        .scaleLinear()
        .domain(xDomain)
        .range([
          0,
          props.graphSettings.style?.dimensions?.width
            ? props.graphSettings.style?.dimensions?.width
            : 10,
        ]);

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

  //Adding Marks

  let meshVertices = [],
    colorMatrix = [];
  for (let i = 0; i < props.data.length - 1; i++) {
    const vertColor = props.graphSettings.mark.style?.fill?.color
      ? props.graphSettings.mark.style?.fill?.color
      : "#ff0000";
    meshVertices.push(
      xScale(props.data[i][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(
      zScale(props.data[i][props.graphSettings.mark.position.z.field])
    );
    colorMatrix.push(vertColor);

    meshVertices.push(
      xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i + 1][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(
      zScale(props.data[i + 1][props.graphSettings.mark.position.z.field])
    );
    colorMatrix.push(vertColor);

    meshVertices.push(
      xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i + 1][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(zScale(0));
    colorMatrix.push(vertColor);

    meshVertices.push(
      xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i + 1][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(zScale(0));
    colorMatrix.push(vertColor);

    meshVertices.push(
      xScale(props.data[i][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(zScale(0));
    colorMatrix.push(vertColor);

    meshVertices.push(
      xScale(props.data[i][props.graphSettings.mark.position.x.field])
    );
    meshVertices.push(
      yScale(props.data[i][props.graphSettings.mark.position.y.field])
    );
    meshVertices.push(
      zScale(props.data[i][props.graphSettings.mark.position.z.field])
    );
    colorMatrix.push(vertColor);
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

  const xAxis = props.graphSettings.axis ? (
    props.graphSettings.axis["x-axis"] ? (
      <XAxis
        domain={
          props.graphSettings.mark.position.x.scaleType === "ordinal"
            ? xDomain
            : xScale.ticks(
              props.graphSettings.axis["x-axis"].ticks?.noOfTicks
                ? props.graphSettings.axis["x-axis"].ticks.noOfTicks
                : 5
            )
        }
        tick={props.graphSettings.axis["x-axis"].ticks}
        scale={xScale}
        orient={props.graphSettings.axis["x-axis"].orient}
        title={props.graphSettings.axis["x-axis"].title}
        dimensions={
          props.graphSettings.style?.dimensions
            ? props.graphSettings.style?.dimensions
            : { width: 10, height: 10, depth: 10 }
        }
        padding={
          props.graphSettings.mark.position.x.scaleType === "ordinal"
            ? xScale.bandwidth()
            : 0
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

  const stroke_width = props.graphSettings.mark.style?.stroke?.width
    ? props.graphSettings.mark.style?.stroke?.width
    : 1;
  const stroke_color = props.graphSettings.mark.style?.stroke?.color
    ? props.graphSettings.mark.style?.stroke?.color
    : "#000000";
  const stroke_opacity = props.graphSettings.mark.style?.stroke?.opacity
    ? props.graphSettings.mark.style?.stroke?.opacity
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
        opacity={
          props.graphSettings.mark.style?.fill?.opacity
            ? props.graphSettings.mark.style?.fill?.opacity
            : 1
        }
      />
      {props.graphSettings.mark.style?.stroke ? (
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
export default TimeSeries;
