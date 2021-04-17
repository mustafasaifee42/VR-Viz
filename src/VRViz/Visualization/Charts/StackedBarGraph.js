import React, { useEffect } from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import Shape from "../Components/Shape";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";
import _ from "lodash";

const StackedBarGraph = (props) => {

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


  const data = d3.stack().keys(props.graphSettings.mark.style.fill.field)(
    props.data
  );

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
      _.flattenDepth(data, 1),
      1,
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
      props.graphSettings.mark.style?.padding?.x
        ? props.graphSettings.mark.style?.padding?.x
        : 0.1
    );

  const width = xScale.bandwidth();
  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range(
      props.graphSettings.mark.style.height.value
        ? props.graphSettings.mark.style.height.value
        : [
          0,
          props.graphSettings.style?.dimensions?.height
            ? props.graphSettings.style?.dimensions?.height
            : 10,
        ]
    );
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
      props.graphSettings.mark.style?.padding?.z
        ? props.graphSettings.mark.style?.padding?.z
        : 0.1
    );

  const depth = zScale.bandwidth();

  const radius = depth > width ? width / 2 : depth / 2;

  //Adding marks
  const marks = data.map((d, i) =>
    d.map((d1, j) => {
      const hght =
        yScale(d1[1] - d1[0]) !== 0 ? yScale(d1[1] - d1[0]) : 0.000000000001;
      const color = props.graphSettings.mark.style.fill?.color
        ? props.graphSettings.mark.style.fill?.color[i]
        : d3.schemeCategory10[i % 10];
      const position = `${xScale(d1.data[props.graphSettings.mark.position.x.field]) + width / 2
        } ${yScale(d1[0]) + hght / 2} ${zScale(d1.data[props.graphSettings.mark.position.z.field]) + depth / 2
        }`;
      const hoverText = props.graphSettings.mark.mouseOver?.label
        ? props.graphSettings.mark.mouseOver.label
          .value(d1.data)
          .replace("Label", `${d.key}`)
          .replace("LabelValue", `${d1.data[d.key]}`)
        : null;
      return (
        <Shape
          key={`${i}_${j}`}
          type={props.graphSettings.mark.type}
          color={`${color}`}
          opacity={
            props.graphSettings.mark.style?.fill?.opacity
              ? props.graphSettings.mark.style?.fill?.opacity
              : 1
          }
          depth={`${depth}`}
          height={`${hght}`}
          width={`${width}`}
          radius={`${radius}`}
          segments={
            props.graphSettings.mark.style?.segments
              ? `${props.graphSettings.mark.style?.segments}`
              : "16"
          }
          position={position}
          hover={props.graphSettings.mark.mouseOver}
          class={"clickable clickShape"}
          hoverText={hoverText}
          graphID={props.graphID}
        />
      );
    })
  );

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
      {xAxis}
      {yAxis}
      {zAxis}
      {box}
    </>
  );
};

export default StackedBarGraph;
