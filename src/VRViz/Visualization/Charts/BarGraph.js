import React, { useEffect } from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import Shape from "../Components/Shape";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const BarGraph = (props) => {

  useEffect(() => {
    d3.selectAll(".clickShape").on("click", (event) => {
      if (typeof props.graphSettings.mark?.onClick === "function")
        props.graphSettings.mark?.onClick(JSON.parse(d3.select(event.currentTarget).attr("data")));
    });
  }, [props.graphSettings.mark]);

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
      "ordinal",
      props.graphSettings.mark.position.x.startFromZero
    );

  let yDomain = props.graphSettings.mark.style.height.domain
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

  let xyProjectionData = xDomain.map((d) => ({
    label: d,
    value: 0,
  }));

  xDomain.forEach((d, i) => {
    props.data.forEach((data) => {
      if (data[props.graphSettings.mark.position.x.field] === d) {
        xyProjectionData[i].value =
          xyProjectionData[i].value +
          data[props.graphSettings.mark.style.height.field];
      }
    });
  });

  let yzProjectionData = zDomain.map((d) => ({
    label: d,
    value: 0,
  }));

  zDomain.forEach((d, i) => {
    props.data.forEach((data) => {
      if (data[props.graphSettings.mark.position.z.field] === d) {
        yzProjectionData[i].value =
          yzProjectionData[i].value +
          data[props.graphSettings.mark.style.height.field];
      }
    });
  });

  if (props.graphSettings.mark.projections?.xy) {
    yDomain[1] =
      yDomain[1] < d3.max(xyProjectionData, (d) => d.value)
        ? d3.max(xyProjectionData, (d) => d.value)
        : yDomain[1];
  }

  if (props.graphSettings.mark.projections?.yz) {
    yDomain[1] =
      yDomain[1] < d3.max(yzProjectionData, (d) => d.value)
        ? d3.max(yzProjectionData, (d) => d.value)
        : yDomain[1];
  }

  const colorDomain = props.graphSettings.mark.style.fill?.scaleType
    ? props.graphSettings.mark.style.fill?.domain
      ? props.graphSettings.mark.style.fill?.domain
      : GetDomain(
        props.data,
        props.graphSettings.mark.style.fill?.field,
        props.graphSettings.mark.style.fill?.scaleType,
        props.graphSettings.mark.style.fill?.startFromZero
      )
    : null;

  //Adding Scale

  const xScale = d3
    .scaleBand()
    .range([
      0,
      props.graphSettings.style?.dimensions?.width
        ? props.graphSettings.style?.dimensions?.width
        : 10,
    ])
    .domain(xDomain)
    .paddingInner(
      props.graphSettings.mark.style.padding?.x
        ? props.graphSettings.mark.style.padding?.x
        : 0.1
    );

  const width = xScale.bandwidth();

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
    .scaleBand()
    .domain(zDomain)
    .range([
      0,
      props.graphSettings.style?.dimensions?.depth
        ? props.graphSettings.style?.dimensions?.depth
        : 10,
    ])
    .paddingInner(
      props.graphSettings.mark.style.padding?.z
        ? props.graphSettings.mark.style.padding?.z
        : 0.1
    );

  const depth = zScale.bandwidth();

  const radius = depth > width ? width / 2 : depth / 2;

  const colorRange = props.graphSettings.mark.style.fill?.color
    ? props.graphSettings.mark.style.fill?.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark.style.fill?.scaleType
    ? props.graphSettings.mark.style.fill?.scaleType === "ordinal"
      ? d3.scaleOrdinal().domain(colorDomain).range(colorRange)
      : d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;

  //Adding marks
  const marks = props.data.map((d, i) => {
    const hght =
      yScale(d[props.graphSettings.mark.style.height.field]) === 0
        ? 0.000000000001
        : yScale(d[props.graphSettings.mark.style.height.field]);

    const color =
      colorScale && props.graphSettings.mark.style.fill?.field
        ? colorScale(d[props.graphSettings.mark.style.fill?.field])
        : props.graphSettings.mark.style.fill?.color
          ? props.graphSettings.mark.style.fill?.color
          : "#ff0000";

    const position = `${xScale(d[props.graphSettings.mark.position.x.field]) + width / 2
      } ${hght / 2} ${zScale(d[props.graphSettings.mark.position.z.field]) + depth / 2
      }`;

    const hoverText = props.graphSettings.mark.mouseOver?.label
      ? props.graphSettings.mark.mouseOver?.label?.value(d)
      : null;

    const className =
      typeof props.graphSettings.mark.class === "function"
        ? `clickShape clickable ${props.graphSettings.mark.class(d, i)}`
        : "clickShape clickable";

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
          props.graphSettings.mark.style.fill?.opacity
            ? props.graphSettings.mark.style.fill?.opacity
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
        graphID={props.graphID}
        class={className}
        id={idName}
        data={JSON.stringify(d)}
      />
    );
  });

  //Adding Projections
  const xyProjectionsShape = xyProjectionData.map((d, i) => (
    <Shape
      key={i}
      type={"box"}
      color={
        props.graphSettings.mark.projections?.style?.color
          ? props.graphSettings.mark.projections?.style?.color
          : "#ff0000"
      }
      opacity={
        props.graphSettings.mark.projections?.style?.opacity
          ? props.graphSettings.mark.projections?.style?.opacity
          : 1
      }
      depth="0.000000000001"
      height={`${yScale(d.value) === 0 ? 0.000000000001 : yScale(d.value)}`}
      width={
        props.graphSettings.mark.type === "box" ||
          !props.graphSettings.mark.type
          ? width
          : radius * 2
      }
      radius={`${radius}`}
      segments={"16"}
      position={`${xScale(d.label) + width / 2} ${yScale(d.value) === 0 ? 0.000000000001 / 2 : yScale(d.value) / 2
        } 0`}
      hover={false}
      hoverText={null}
      graphID={props.graphID}
      class="clickable"
      data={JSON.stringify(d)}
    />
  ));
  const yzProjectionsShape = yzProjectionData.map((d, i) => (
    <Shape
      key={i}
      type={"box"}
      color={
        props.graphSettings.mark.projections?.style?.color
          ? props.graphSettings.mark.projections?.style?.color
          : "#ff0000"
      }
      opacity={
        props.graphSettings.mark.projections?.style?.opacity
          ? props.graphSettings.mark.projections?.style?.opacity
          : 1
      }
      depth={
        props.graphSettings.mark.type === "box" ||
          !props.graphSettings.mark.type
          ? depth
          : radius * 2
      }
      height={`${yScale(d.value) === 0 ? 0.000000000001 : yScale(d.value)}`}
      width="0.000000000001"
      radius={`${radius}`}
      segments={"16"}
      position={`0 ${yScale(d.value) === 0 ? 0.000000000001 / 2 : yScale(d.value) / 2
        } ${zScale(d.label) + depth / 2}`}
      hover={false}
      hoverText={null}
      graphID={props.graphID}
      class="clickable"
      data={JSON.stringify(d)}
    />
  ));

  //Axis
  const xAxis = props.graphSettings.axis ? (
    props.graphSettings.axis["x-axis"] ? (
      <XAxis
        domain={xDomain}
        tick={props.graphSettings.axis["x-axis"].ticks}
        scale={xScale}
        orient={props.graphSettings.axis["x-axis"].orient}
        title={props.graphSettings.axis["x-axis"].title}
        dimensions={
          props.graphSettings.style?.dimensions
            ? props.graphSettings.style?.dimensions
            : { width: 10, height: 10, depth: 10 }
        }
        padding={width}
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
        domain={zDomain}
        tick={props.graphSettings.axis["z-axis"].ticks}
        scale={zScale}
        orient={props.graphSettings.axis["z-axis"].orient}
        title={props.graphSettings.axis["z-axis"].title}
        dimensions={
          props.graphSettings.style?.dimensions
            ? props.graphSettings.style?.dimensions
            : { width: 10, height: 10, depth: 10 }
        }
        padding={depth}
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

  return (
    <>
      {marks}
      {props.graphSettings.mark.projections?.xy ? xyProjectionsShape : null}
      {props.graphSettings.mark.projections?.yz ? yzProjectionsShape : null}
      {xAxis}
      {yAxis}
      {zAxis}
      {box}
    </>
  );
};

export default BarGraph;
