import React, { useEffect } from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import Shape from "../Components/Shape";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const LollipopChart = (props) => {

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
      "ordinal",
      props.graphSettings.mark.position.z.startFromZero
    );

  const colorDomain = props.graphSettings.mark.style?.fill?.scaleType
    ? props.graphSettings.mark.style?.fill?.domain
      ? props.graphSettings.mark.style?.fill?.domain
      : GetDomain(
        props.data,
        props.graphSettings.mark.style?.fill?.field,
        props.graphSettings.mark.style?.fill?.scaleType,
        props.graphSettings.mark.style?.fill?.startFromZero
      )
    : null;

  const radiusDomain = !props.graphSettings.mark.style?.radius?.domain
    ? GetDomain(
      props.data,
      props.graphSettings.mark.style?.radius?.field,
      "linear",
      props.graphSettings.mark.style?.radius?.startFromZero
    )
    : props.graphSettings.mark.style?.radius?.domain;

  const stemColorDomain = props.graphSettings.mark.droplines?.style?.fill
    .scaleType
    ? props.graphSettings.mark.droplines?.style?.fill?.domain
      ? props.graphSettings.mark.droplines?.style?.fill?.domain
      : GetDomain(
        props.data,
        props.graphSettings.mark.droplines?.style?.fill?.field,
        props.graphSettings.mark.droplines?.style?.fill?.scaleType,
        props.graphSettings.mark.droplines?.style?.fill?.startFromZero
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
      props.graphSettings.mark.style?.padding?.x
        ? props.graphSettings.mark.style?.padding?.x
        : 0
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
      props.graphSettings.mark.style?.padding?.z
        ? props.graphSettings.mark.style?.padding?.z
        : 0
    );

  const depth = zScale.bandwidth();

  const radiusScale = props.graphSettings.mark.style?.radius?.scaleType
    ? d3
      .scaleLinear()
      .domain(radiusDomain)
      .range(props.graphSettings.mark.style?.radius?.value)
    : null;

  const colorRange = props.graphSettings.mark.style?.fill?.color
    ? props.graphSettings.mark.style?.fill?.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark.style?.fill?.scaleType
    ? props.graphSettings.mark.style?.fill?.scaleType === "ordinal"
      ? d3.scaleOrdinal().domain(colorDomain).range(colorRange)
      : d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;

  const stemColorRange = props.graphSettings.mark.droplines?.style?.fill?.color
    ? props.graphSettings.mark.droplines?.style?.fill?.color
    : d3.schemeCategory10;

  const stemColorScale = props.graphSettings.mark.droplines?.style?.fill
    ?.scaleType
    ? props.graphSettings.droplines?.mark.style?.fill?.scaleType === "ordinal"
      ? d3.scaleOrdinal().domain(stemColorDomain).range(stemColorRange)
      : d3.scaleLinear().domain(stemColorDomain).range(stemColorRange)
    : null;
  //Adding marks
  const marks = props.data.map((d, i) => {
    const color =
      colorScale && props.graphSettings.mark.style?.fill?.field
        ? colorScale(d[props.graphSettings.mark.style?.fill?.field])
        : props.graphSettings.mark.style?.fill.color
          ? props.graphSettings.mark.style?.fill.color
          : "#ff0000";

    const radiusValue =
      radiusScale && props.graphSettings.mark.style?.radius?.field
        ? radiusScale(d[props.graphSettings.mark.style?.radius?.field])
        : props.graphSettings.mark.style?.radius?.value
          ? props.graphSettings.mark.style?.radius?.value
          : 0.1;

    const position = `${xScale(d[props.graphSettings.mark.position.x.field]) + width / 2
      } ${yScale(d[props.graphSettings.mark.position.y.field])} ${zScale(d[props.graphSettings.mark.position.z.field]) + depth / 2
      }`;

    const hoverText = props.graphSettings.mark.mouseOver?.label
      ? props.graphSettings.mark.mouseOver?.label?.value(d)
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
        color={`${color}`}
        opacity={
          props.graphSettings.mark.style?.fill?.opacity
            ? props.graphSettings.mark.style?.fill?.opacity
            : 1
        }
        depth={`${radiusValue}`}
        height={`${radiusValue}`}
        width={`${radiusValue}`}
        radius={`${radiusValue}`}
        segments={
          props.graphSettings.mark.style?.segments
            ? `${props.graphSettings.mark.style?.segments}`
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

  const stem = props.data.map((d, i) => {
    const color =
      stemColorScale && props.graphSettings.mark.droplines?.style?.fill?.field
        ? stemColorScale(
          d[props.graphSettings.mark.droplines?.style?.fill?.field]
        )
        : props.graphSettings.mark.droplines?.style?.fill?.color
          ? props.graphSettings.mark.droplines?.style?.fill?.color
          : "#ff0000";
    const position = `${xScale(d[props.graphSettings.mark.position.x.field]) + width / 2
      } ${yScale(d[props.graphSettings.mark.position.y.field]) / 2} ${zScale(d[props.graphSettings.mark.position.z.field]) + depth / 2
      }`;

    const className =
      typeof props.graphSettings.mark.droplines?.class === "function"
        ? `clickShape clickable ${props.graphSettings.mark.droplines?.class(
          d,
          i
        )}`
        : "clickShape clickable";

    const idName =
      typeof props.graphSettings.mark.droplines?.id === "function"
        ? props.graphSettings.mark.droplines?.id(d, i)
        : null;

    return (
      <Shape
        key={i}
        type={"cylinder"}
        color={`${color}`}
        opacity={
          props.graphSettings.mark.droplines?.style?.fill?.opacity
            ? props.graphSettings.mark.droplines?.style?.fill?.opacity
            : 1
        }
        depth={
          props.graphSettings.mark.droplines?.style?.radius
            ? `${props.graphSettings.mark.droplines?.style?.radius}`
            : 0.01
        }
        height={`${yScale(d[props.graphSettings.mark.position.y.field])}`}
        width={
          props.graphSettings.mark.droplines?.style?.radius
            ? `${props.graphSettings.mark.droplines?.style?.radius}`
            : 0.01
        }
        radius={
          props.graphSettings.mark.droplines?.style?.radius
            ? props.graphSettings.mark.droplines?.style?.radius
            : 0.01
        }
        segments={
          props.graphSettings.mark.droplines?.style?.segments
            ? `${props.graphSettings.mark.droplines?.style?.segments}`
            : "16"
        }
        position={position}
        hover={false}
        hoverText={""}
        graphID={props.graphID}
        class={className}
        id={idName}
        data={JSON.stringify(d)}
      />
    );
  });

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
      {stem}
      {marks}
      {xAxis}
      {yAxis}
      {zAxis}
      {box}
    </>
  );
};

export default LollipopChart;
