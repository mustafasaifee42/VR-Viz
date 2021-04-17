import React, { useEffect } from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import Shape from "../Components/Shape";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const ConnectedScatterPlot = (props) => {

  useEffect(() => {
    d3.selectAll(".clickShape").on("click", (event) => {
      if (typeof props.graphSettings.mark?.points?.onClick === "function")
        props.graphSettings.mark?.points?.onClick(JSON.parse(d3.select(event.currentTarget).attr("data")));
    });
  }, [props.graphSettings.mark?.points]);

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

  const colorDomain = props.graphSettings.mark.points?.style?.fill?.scaleType
    ? props.graphSettings.mark.points?.style?.fill?.domain
      ? props.graphSettings.mark.points?.style?.fill?.domain
      : GetDomain(
        props.data,
        props.graphSettings.mark.points?.style?.fill?.field,
        props.graphSettings.mark.points?.style?.fill?.scaleType
          ? props.graphSettings.mark.points?.style?.fill?.scaleType
          : "ordinal",
        props.graphSettings.mark.points?.style?.fill?.startFromZero
      )
    : null;

  const radiusDomain = props.graphSettings.mark.points?.style?.radius?.domain
    ? props.graphSettings.mark.points?.style?.radius?.domain
    : GetDomain(
      props.data,
      props.graphSettings.mark.points?.style?.radius?.field,
      "linear",
      props.graphSettings.mark.points?.style?.radius?.startFromZero
    );

  //Adding Scale

  const xScale = d3
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

  const colorRange = props.graphSettings.mark.points?.style?.fill?.color
    ? props.graphSettings.mark.points?.style?.fill?.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark.points?.style?.fill?.scaleType
    ? props.graphSettings.mark.points?.style?.fill?.scaleType === "linear"
      ? d3.scaleLinear().domain(colorDomain).range(colorRange)
      : d3.scaleOrdinal().domain(colorDomain).range(colorRange)
    : null;

  const radiusScale = props.graphSettings.mark.points?.style?.radius?.scaleType
    ? d3
      .scaleLinear()
      .domain(radiusDomain)
      .range(
        props.graphSettings.mark.points?.style?.radius?.value
          ? props.graphSettings.mark.points?.style?.radius?.value
          : [0, 0.5]
      )
    : null;

  //Adding marks
  const marks = props.data.map((d, i) => {
    const color =
      colorScale && props.graphSettings.mark.points?.style?.fill?.field
        ? colorScale(d[props.graphSettings.mark.points?.style?.fill?.field])
        : props.graphSettings.mark.points?.style?.fill?.color
          ? props.graphSettings.mark.points?.style?.fill?.color
          : "#ff0000";

    const radius =
      radiusScale && props.graphSettings.mark.points?.style?.radius?.field
        ? radiusScale(d[props.graphSettings.mark.points?.style?.radius?.field])
        : props.graphSettings.mark.points?.style?.radius?.value
          ? props.graphSettings.mark.points?.style?.radius?.value
          : 0.05;

    const position = `${xScale(
      d[props.graphSettings.mark.position.x.field]
    )} ${yScale(d[props.graphSettings.mark.position.y.field])} ${zScale(
      d[props.graphSettings.mark.position.z.field]
    )}`;

    const hoverText = props.graphSettings.mark.points?.mouseOver?.label
      ? props.graphSettings.mark.points?.mouseOver?.label.value(d)
      : null;

    const className =
      typeof props.graphSettings.mark.points?.class === "function"
        ? `clickShape clickable ${props.graphSettings.mark.points?.class(d, i)}`
        : "clickShape clickable";

    const idName =
      typeof props.graphSettings.mark.points?.id === "function"
        ? props.graphSettings.mark.points?.id(d, i)
        : null;

    return (
      <Shape
        key={i}
        type={
          props.graphSettings.mark.points?.type
            ? props.graphSettings.mark.points?.type
            : "sphere"
        }
        color={color}
        opacity={
          props.graphSettings.mark.points?.style?.fill?.opacity
            ? props.graphSettings.mark.points?.style?.fill?.opacity
            : 1
        }
        depth={`${radius}`}
        height={`${radius}`}
        width={`${radius}`}
        radius={`${radius}`}
        segments={
          props.graphSettings.mark.points?.style?.segments
            ? `${props.graphSettings.mark.points?.style?.segments}`
            : "16"
        }
        position={position}
        hover={props.graphSettings.mark.points?.mouseOver}
        hoverText={hoverText}
        graphID={props.graphID}
        class={className}
        id={idName}
        data={JSON.stringify(d)}
      />
    );
  });

  // labels
  const labels = props.graphSettings.mark.label
    ? props.graphSettings.mark.points?.style?.radius?.scaleType
      ? props.data.map((d, i) => (
        <a-text
          key={i}
          opacity={
            props.graphSettings.mark.label?.opacity
              ? props.graphSettings.mark.label?.opacity
              : 1
          }
          color={
            props.graphSettings.mark.label?.color
              ? props.graphSettings.mark.label?.color
              : "#000000"
          }
          width={
            props.graphSettings.mark.label?.fontSize
              ? props.graphSettings.mark.label?.fontSize
              : 1
          }
          value={`${d[props.graphSettings.mark.label.field]}`}
          anchor="align"
          side="double"
          align="left"
          position={`${props.graphSettings.mark.points?.style?.radius?.field
            ? xScale(d[props.graphSettings.mark.position.x.field]) +
            0.05 +
            radiusScale(
              d[props.graphSettings.mark.points?.style?.radius?.field]
            )
            : xScale(d[props.graphSettings.mark.position.x.field]) + 0.05
            } ${yScale(d[props.graphSettings.mark.position.y.field])} ${zScale(
              d[props.graphSettings.mark.position.z.field]
            )}`}
          billboard={
            props.graphSettings.mark.label?.billboarding === false
              ? false
              : true
          }
        />
      ))
      : props.data.map((d, i) => (
        <a-text
          key={i}
          opacity={
            props.graphSettings.mark.label?.opacity
              ? props.graphSettings.mark.label?.opacity
              : 1
          }
          color={
            props.graphSettings.mark.label?.color
              ? props.graphSettings.mark.label?.color
              : "#000000"
          }
          width={
            props.graphSettings.mark.label?.fontSize
              ? props.graphSettings.mark.label?.fontSize
              : 1
          }
          value={`${d[props.graphSettings.mark.label.field]}`}
          anchor="align"
          side="double"
          align="left"
          position={`${props.graphSettings.mark.points?.style?.radius?.value
            ? xScale(d[props.graphSettings.mark.position.x.field]) +
            0.05 +
            props.graphSettings.mark.points?.style?.radius?.value
            : xScale(d[props.graphSettings.mark.position.x.field]) +
            0.05 +
            0.05
            } ${yScale(d[props.graphSettings.mark.position.y.field])} ${zScale(
              d[props.graphSettings.mark.position.z.field]
            )}`}
          billboard={
            props.graphSettings.mark.label?.billboarding === false
              ? false
              : true
          }
        />
      ))
    : null;

  const pointList = props.data.map((d, i) => ({
    x: `${xScale(d[props.graphSettings.mark.position.x.field])}`,
    y: `${yScale(d[props.graphSettings.mark.position.y.field])}`,
    z: `${zScale(d[props.graphSettings.mark.position.z.field])}`,
  }));

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

  return (
    <>
      <a-frame-curve-line
        points={JSON.stringify(pointList)}
        type={
          props.graphSettings.mark.line?.style?.stroke?.curveType
            ? props.graphSettings.mark.line?.style?.stroke?.curveType
            : "line"
        }
        stroke_width={
          props.graphSettings.mark.line?.style?.stroke?.width
            ? props.graphSettings.mark.line?.style?.stroke?.width
            : 1
        }
        color={
          props.graphSettings.mark.line?.style?.stroke?.color
            ? props.graphSettings.mark.line?.style?.stroke?.color
            : "#000000"
        }
        opacity={
          props.graphSettings.mark.line?.style?.stroke?.opacity
            ? props.graphSettings.mark.line?.style?.stroke?.opacity
            : 1
        }
        resolution={
          props.graphSettings.mark.line?.style?.stroke?.resolution
            ? props.graphSettings.mark.line?.style?.stroke?.resolution
            : 20
        }
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
