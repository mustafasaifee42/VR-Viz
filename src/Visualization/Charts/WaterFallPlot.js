import React from "react";
import * as d3 from "d3";
import _ from "lodash";
import GetDomain from "../../utils/GetDomain";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const WaterFallPlot = (props) => {
  if (!props.data || !props.graphSettings.style || !props.graphSettings.mark) {
    console.warn(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }

  // Getting domain for axis
  const zDomain = props.graphSettings.mark.position.z.domain
    ? props.graphSettings.mark.position.z.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.position.z.field,
        props.graphSettings.mark.position.z.scaleType
          ? props.graphSettings.mark.position.z.scaleType
          : "ordinal",
        false
      );

  const xDomain = props.graphSettings.mark.position.x.domain
    ? props.graphSettings.mark.position.x.domain
    : Object.keys(props.data[0]).map((d) =>
        d !== props.graphSettings.mark.position.z.field ? d : null
      );

  let yDomain = props.graphSettings.mark.position.y?.domain;
  if (!yDomain) {
    let dataList = [];
    for (let k = 0; k < xDomain.length; k++) {
      for (let i = 0; i < props.data.length; i++) {
        dataList.push(props.data[i][xDomain[k]]);
      }
    }
    yDomain = props.graphSettings.mark.position.y?.startFromZero
      ? [0, _.max(dataList)]
      : [_.min(dataList), _.max(dataList)];
  }
  //Adding Scale
  let zRange =
    props.graphSettings.mark.position.z.scaleType === "linear"
      ? [0, props.graphSettings.style.dimensions.depth]
      : zDomain.map(
          (_d, i) =>
            (i * props.graphSettings.style.dimensions.depth) /
            (zDomain.length - 1)
        );
  let xRange = xDomain.map(
    (_d, i) =>
      (i * props.graphSettings.style.dimensions.width) / (xDomain.length - 1)
  );

  const xScale = d3.scaleOrdinal().range(xRange).domain(xDomain);

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([0, props.graphSettings.style.dimensions.height]);

  const zScale = d3.scaleOrdinal().domain(zDomain).range(zRange);

  const fillColorDomain = props.graphSettings.mark.style?.fill?.domain
    ? props.graphSettings.mark.style?.fill?.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.style?.fill?.field,
        props.graphSettings.mark.style?.fill?.scaleType
          ? props.graphSettings.mark.style?.fill.scaleType
          : "ordinal",
        false
      );
  const fillColorRange = props.graphSettings.mark.style?.fill?.color
    ? props.graphSettings.mark.style?.fill?.color
    : d3.schemeCategory10;

  const fillColorScale = props.graphSettings.mark.style?.fill?.scaleType
    ? props.graphSettings.mark.style?.fill?.scaleType === "linear"
      ? d3.scaleLinear().domain(fillColorDomain).range(fillColorRange)
      : d3.scaleOrdinal().domain(fillColorDomain).range(fillColorRange)
    : null;

  //Adding marks

  const marks = props.data.map((d, i) => {
    let path = `0 0,`;
    for (let j = 0; j < xDomain.length; j++) {
      if (j !== xDomain.length - 1)
        path =
          path + ` ${xScale(xDomain[j])} ${yScale(d[xDomain[j].toString()])},`;
      else
        path =
          path + ` ${xScale(xDomain[j])} ${yScale(d[xDomain[j].toString()])}`;
    }
    path = path + `, ${xScale(xDomain[xDomain.length - 1])} 0`;
    let points = path.split(", ");
    let pntArray = points.map((el) => {
      const pnts = el.split(" ");
      return {
        x: pnts[0],
        y: pnts[1],
        z: `${zScale(d[props.graphSettings.mark.position.z.field])}`,
      };
    });

    let outlineArray = [];
    pntArray.forEach((el, i) => {
      if (i !== 0 && i !== pntArray.length - 1) outlineArray.push(el);
    });

    const plotShape = (
      <a-frame-shape
        points={JSON.stringify(pntArray)}
        key={i}
        color={
          fillColorScale && props.graphSettings.mark.style?.fill?.field
            ? fillColorScale(d[props.graphSettings.mark.style?.fill?.field])
            : props.graphSettings.mark.style?.fill?.color
            ? props.graphSettings.mark.style?.fill?.color
            : "#ff0000"
        }
        opacity={
          props.graphSettings.mark.style?.fill?.opacity
            ? props.graphSettings.mark.style?.fill?.opacity
            : 1
        }
      />
    );

    const plotOutline = props.graphSettings.mark.style?.stroke ? (
      <a-frame-curve-line
        points={JSON.stringify(outlineArray)}
        type={"line"}
        resolution={20}
        color={
          props.graphSettings.mark.style?.stroke?.color
            ? props.graphSettings.mark.style?.stroke?.color
            : "#000000"
        }
        opacity={
          props.graphSettings.mark.style?.stroke?.opacity
            ? props.graphSettings.mark.style?.stroke.opacity
            : 1
        }
        stroke_width={
          props.graphSettings.mark.style?.stroke?.width
            ? props.graphSettings.mark.style?.stroke?.width
            : 1
        }
      />
    ) : null;

    return (
      <a-entity key={i}>
        {plotOutline}
        <a-entity
          position={`0 0 ${zScale(
            d[props.graphSettings.mark.position.z.field]
          )}`}
        >
          {plotShape}
        </a-entity>
      </a-entity>
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
      {xAxis}
      {yAxis}
      {zAxis}
      {box}
      {marks}
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
export default WaterFallPlot;
