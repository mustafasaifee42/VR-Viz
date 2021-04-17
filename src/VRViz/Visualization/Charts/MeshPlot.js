import React from "react";
import * as d3 from "d3";
import _ from "lodash";
import GetDomain from "../../utils/GetDomain";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const MeshPlot = (props) => {
  if (!props.data || !props.graphSettings.mark) {
    console.warn(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }

  const xDomain = props.graphSettings.mark.position.x.domain
    ? props.graphSettings.mark.position.x.domain
    : GetDomain(
      props.data,
      props.graphSettings.mark.position.x.field,
      props.graphSettings.mark.position.x.scaleType
        ? props.graphSettings.mark.position.x.scaleType
        : "ordinal",
      props.graphSettings.mark.position.x.startFromZero
    );

  const zDomain = props.graphSettings.mark.position.z.domain
    ? props.graphSettings.mark.position.z.domain
    : Object.keys(props.data[0]).map((d) =>
      d !== props.graphSettings.mark.position.x.field ? d : null
    );

  let yDomain = props.graphSettings.mark.position.y?.domain;
  if (!yDomain) {
    let dataList = [];
    for (let k = 0; k < zDomain.length; k++) {
      for (let i = 0; i < props.data.length; i++) {
        dataList.push(props.data[i][zDomain[k]]);
      }
    }
    yDomain = props.graphSettings.mark.position.y?.startFromZero
      ? [0, _.max(dataList)]
      : [_.min(dataList), _.max(dataList)];
  }

  let dataCoordinate = [];
  for (let i = 0; i < props.data.length; i++) {
    for (let j = 0; j < zDomain.length; j++) {
      dataCoordinate.push([
        props.data[i][props.graphSettings.mark.position.x.field],
        props.data[i][zDomain[j]],
        zDomain[j],
      ]);
    }
  }

  const graphHeight = props.graphSettings.style?.dimensions?.height
    ? props.graphSettings.style?.dimensions?.height
    : 10;
  const graphWidth = props.graphSettings.style?.dimensions?.width
    ? props.graphSettings.style?.dimensions?.width
    : 10;
  const graphDepth = props.graphSettings.style?.dimensions?.depth
    ? props.graphSettings.style?.dimensions?.depth
    : 10;

  const colorDomain = props.graphSettings.mark.style?.fill?.axis
    ? [
      0,
      props.graphSettings.mark.style?.fill?.axis === "y"
        ? graphHeight
        : props.graphSettings.mark.style?.fill?.axis === "z"
          ? graphDepth
          : graphWidth,
    ]
    : null;
  //Adding Scale
  const xScale =
    props.graphSettings.mark.position.x.scaleType === "linear"
      ? d3.scaleLinear().range([0, graphWidth]).domain(xDomain)
      : d3
        .scaleOrdinal()
        .range(
          xDomain.map((_d, i) => (i * graphWidth) / (xDomain.length - 1))
        )
        .domain(xDomain);

  const yScale = d3.scaleLinear().domain(yDomain).range([0, graphHeight]);

  const zScale = d3
    .scaleOrdinal()
    .range(zDomain.map((_d, i) => (i * graphDepth) / (zDomain.length - 1)))
    .domain(zDomain);

  const colorRange = props.graphSettings.mark.style?.fill?.color
    ? props.graphSettings.mark.style?.fill?.color
    : ["#ff0000", "#ffff00"];
  const colorScale = props.graphSettings.mark.style?.fill?.axis
    ? d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;
  //Adding marks

  let meshVertices = [],
    colorMatrix = [];
  for (let i = 0; i < props.data.length - 1; i++) {
    for (let j = 0; j < zDomain.length - 1; j++) {
      meshVertices.push(
        xScale(props.data[i][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i][zDomain[j]]));
      meshVertices.push(zScale(zDomain[j]));

      let vertColorIndex =
        props.graphSettings.mark.style?.fill?.axis === "y"
          ? yScale(props.data[i][zDomain[j]])
          : props.graphSettings.mark.style?.fill?.axis === "z"
            ? zScale(zDomain[j])
            : xScale(props.data[i][props.graphSettings.mark.position.x.field]);

      let vertColor = colorScale
        ? colorScale(vertColorIndex)
        : props.graphSettings.mark.style?.fill?.color
          ? props.graphSettings.mark.style?.fill?.color
          : "#ff0000";

      colorMatrix.push(vertColor);

      meshVertices.push(
        xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i + 1][zDomain[j]]));
      meshVertices.push(zScale(zDomain[j]));

      vertColorIndex =
        props.graphSettings.mark.style?.fill?.axis === "y"
          ? yScale(props.data[i + 1][zDomain[j]])
          : props.graphSettings.mark.style?.fill?.axis === "z"
            ? zScale(zDomain[j])
            : xScale(
              props.data[i + 1][props.graphSettings.mark.position.x.field]
            );

      vertColor = colorScale
        ? colorScale(vertColorIndex)
        : props.graphSettings.mark.style?.fill?.color
          ? props.graphSettings.mark.style?.fill?.color
          : "#ff0000";

      colorMatrix.push(vertColor);

      meshVertices.push(
        xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i + 1][zDomain[j + 1]]));
      meshVertices.push(zScale(zDomain[j + 1]));

      vertColorIndex =
        props.graphSettings.mark.style?.fill?.axis === "y"
          ? yScale(props.data[i + 1][zDomain[j + 1]])
          : props.graphSettings.mark.style?.fill?.axis === "z"
            ? zScale(zDomain[j + 1])
            : xScale(
              props.data[i + 1][props.graphSettings.mark.position.x.field]
            );

      vertColor = colorScale
        ? colorScale(vertColorIndex)
        : props.graphSettings.mark.style?.fill?.color
          ? props.graphSettings.mark.style?.fill?.color
          : "#ff0000";

      colorMatrix.push(vertColor);

      meshVertices.push(
        xScale(props.data[i + 1][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i + 1][zDomain[j + 1]]));
      meshVertices.push(zScale(zDomain[j + 1]));

      vertColorIndex =
        props.graphSettings.mark.style?.fill?.axis === "y"
          ? yScale(props.data[i + 1][zDomain[j + 1]])
          : props.graphSettings.mark.style?.fill?.axis === "z"
            ? zScale(zDomain[j + 1])
            : xScale(
              props.data[i + 1][props.graphSettings.mark.position.x.field]
            );

      vertColor = colorScale
        ? colorScale(vertColorIndex)
        : props.graphSettings.mark.style?.fill?.color
          ? props.graphSettings.mark.style?.fill?.color
          : "#ff0000";

      colorMatrix.push(vertColor);

      meshVertices.push(
        xScale(props.data[i][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i][zDomain[j + 1]]));
      meshVertices.push(zScale(zDomain[j + 1]));

      vertColorIndex =
        props.graphSettings.mark.style?.fill?.axis === "y"
          ? yScale(props.data[i][zDomain[j + 1]])
          : props.graphSettings.mark.style?.fill?.axis === "z"
            ? zScale(zDomain[j + 1])
            : xScale(props.data[i][props.graphSettings.mark.position.x.field]);

      vertColor = colorScale
        ? colorScale(vertColorIndex)
        : props.graphSettings.mark.style?.fill?.color
          ? props.graphSettings.mark.style?.fill?.color
          : "#ff0000";

      colorMatrix.push(vertColor);

      meshVertices.push(
        xScale(props.data[i][props.graphSettings.mark.position.x.field])
      );
      meshVertices.push(yScale(props.data[i][zDomain[j]]));
      meshVertices.push(zScale(zDomain[j]));

      vertColorIndex =
        props.graphSettings.mark.style?.fill?.axis === "y"
          ? yScale(props.data[i][zDomain[j]])
          : props.graphSettings.mark.style?.fill?.axis === "z"
            ? zScale(zDomain[j])
            : xScale(props.data[i][props.graphSettings.mark.position.x.field]);

      vertColor = colorScale
        ? colorScale(vertColorIndex)
        : props.graphSettings.mark.style?.fill?.color
          ? props.graphSettings.mark.style?.fill?.color
          : "#ff0000";

      colorMatrix.push(vertColor);
    }
  }

  //Axis
  const xAxis = props.graphSettings.axis ? (
    props.graphSettings.axis["x-axis"] ? (
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

  const stroke_bool = props.graphSettings.mark.style?.stroke ? true : false;
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
        stroke_bool={stroke_bool}
        stroke_color={stroke_color}
        stroke_width={stroke_width}
        stroke_opacity={stroke_opacity}
        opacity={
          props.graphSettings.mark.style?.fill
            ? props.graphSettings.mark.style?.fill?.opacity
              ? props.graphSettings.mark.style?.fill?.opacity
              : 1
            : 0
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

export default MeshPlot;
