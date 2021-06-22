import React, { useEffect } from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import Shape from "../Components/Shape";
import { XAxis, YAxis, ZAxis, AxisBox } from "../Components/Axis";

const ScatterPlot = (props) => {

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

  const colorRange = props.graphSettings.mark.style?.fill?.color
    ? props.graphSettings.mark.style?.fill?.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark.style?.fill?.scaleType
    ? props.graphSettings.mark.style?.fill?.scaleType === "linear"
      ? d3.scaleLinear().domain(colorDomain).range(colorRange)
      : d3.scaleOrdinal().domain(colorDomain).range(colorRange)
    : null;

  const radiusScale = props.graphSettings.mark.style?.radius?.scaleType
    ? d3
      .scaleLinear()
      .domain(radiusDomain)
      .range(
        props.graphSettings.mark.style?.radius?.value
          ? props.graphSettings.mark.style?.radius?.value
          : [0, 1]
      )
    : null;
  //Adding marks
  const pointForPointGeom = [];
  const colorForPointGeom = [];
  const radiusForPointGeom = radiusScale ? 0.1 : props.graphSettings.mark.style?.radius?.value
    ? props.graphSettings.mark.style?.radius?.value
    : 0.1
  const marks = props.data.map((d, i) => {
    const color =
      colorScale && props.graphSettings.mark.style?.fill?.field
        ? colorScale(d[props.graphSettings.mark.style?.fill?.field])
        : props.graphSettings.mark.style?.fill?.color
          ? props.graphSettings.mark.style?.fill?.color
          : "#ff0000";
    colorForPointGeom.push(color)
    const radius = radiusScale
      ? radiusScale(d[props.graphSettings.mark.style?.radius?.field])
      : props.graphSettings.mark.style?.radius?.value
        ? props.graphSettings.mark.style?.radius?.value
        : 0.5;

    const position = `${xScale(
      d[props.graphSettings.mark.position.x.field]
    )} ${yScale(d[props.graphSettings.mark.position.y.field])} ${zScale(
      d[props.graphSettings.mark.position.z.field]
    )}`;
    pointForPointGeom.push(xScale(d[props.graphSettings.mark.position.x.field]), yScale(d[props.graphSettings.mark.position.y.field]), zScale(d[props.graphSettings.mark.position.z.field]));
    const hoverText = props.graphSettings.mark.mouseOver?.label
      ? props.graphSettings.mark.mouseOver?.label.value(d)
      : null;

    const className =
      typeof props.graphSettings.mark.class === "function"
        ? `clickShape clickable ${props.graphSettings.mark.class(d, i)}`
        : "clickable clickShape";

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
        color={color}
        opacity={
          props.graphSettings.mark.style?.fill?.opacity
            ? props.graphSettings.mark.style?.fill?.opacity
            : 1
        }
        depth={`${radius}`}
        height={`${radius}`}
        width={`${radius}`}
        radius={`${radius}`}
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

  // Droplines

  const droplines = props.graphSettings.mark.droplines
    ? props.data.map((d, i) => {
      const color = props.graphSettings.mark.droplines?.style?.color
        ? props.graphSettings.mark.droplines?.style?.color
        : colorScale && props.graphSettings.mark.style?.fill?.field
          ? colorScale(d[props.graphSettings.mark.style?.fill?.field])
          : props.graphSettings.mark.style?.fill?.color
            ? props.graphSettings.mark.style?.fill?.color
            : "#ff0000";
      const xz = props.graphSettings.mark.droplines.xz ? (
        <a-entity
          key={`xz_${i}`}
          line={`start:${xScale(
            d[props.graphSettings.mark.position.x.field]
          )} 0 ${zScale(
            d[props.graphSettings.mark.position.z.field]
          )}; end:${xScale(
            d[props.graphSettings.mark.position.x.field]
          )} ${yScale(d[props.graphSettings.mark.position.y.field])} ${zScale(
            d[props.graphSettings.mark.position.z.field]
          )}; opacity:${props.graphSettings.mark.droplines?.style?.opacity
            ? props.graphSettings.mark.droplines?.style?.opacity
            : 1
            }; color:${color}`}
        />
      ) : null;
      const xy = props.graphSettings.mark.droplines.xy ? (
        <a-entity
          key={`xy_${i}`}
          line={`start:${xScale(
            d[props.graphSettings.mark.position.x.field]
          )} ${yScale(
            d[props.graphSettings.mark.position.y.field]
          )} 0; end:${xScale(
            d[props.graphSettings.mark.position.x.field]
          )} ${yScale(d[props.graphSettings.mark.position.y.field])} ${zScale(
            d[props.graphSettings.mark.position.z.field]
          )}; opacity:${props.graphSettings.mark.droplines?.style?.opacity
            ? props.graphSettings.mark.droplines?.style?.opacity
            : 1
            }; color:${color}`}
        />
      ) : null;
      const yz = props.graphSettings.mark.droplines.yz ? (
        <a-entity
          key={`yz_${i}`}
          line={`start:0 ${yScale(
            d[props.graphSettings.mark.position.y.field]
          )} 0; end:${xScale(
            d[props.graphSettings.mark.position.x.field]
          )} ${yScale(d[props.graphSettings.mark.position.y.field])} ${zScale(
            d[props.graphSettings.mark.position.z.field]
          )}; opacity:${props.graphSettings.mark.droplines?.style?.opacity
            ? props.graphSettings.mark.droplines?.style?.opacity
            : 1
            }; color:${color}`}
        />
      ) : null;
      return (
        <>
          {xz}
          {xy}
          {yz}
        </>
      );
    })
    : null;

  // Adding Projections

  const projections = props.graphSettings.mark.projections
    ? props.data.map((d, i) => {
      const color = colorScale
        ? colorScale(d[props.graphSettings.mark.style.fill.field])
        : props.graphSettings.mark.style.fill.color
          ? props.graphSettings.mark.style.fill.color
          : "#ff0000";
      const radius = radiusScale
        ? radiusScale(d[props.graphSettings.mark.style.radius.field])
        : props.graphSettings.mark.style.radius.value
          ? props.graphSettings.mark.style.radius.value
          : 0.5;
      const xz = props.graphSettings.mark.projections.xz ? (
        <a-circle
          key={`xz_${i}`}
          position={`${xScale(
            d[props.graphSettings.mark.position.x.field]
          )} 0 ${zScale(d[props.graphSettings.mark.position.z.field])}`}
          opacity={
            props.graphSettings.mark.projections.style?.opacity
              ? props.graphSettings.mark.projections.style?.opacity
              : 1
          }
          color={`${color}`}
          radius={radius}
          rotation="-90 0 0"
        />
      ) : null;
      const xy = props.graphSettings.mark.projections.xy ? (
        <a-circle
          key={`xy_${i}`}
          position={`${xScale(
            d[props.graphSettings.mark.position.x.field]
          )} ${yScale(d[props.graphSettings.mark.position.y.field])} 0`}
          opacity={
            props.graphSettings.mark.projections.style?.opacity
              ? props.graphSettings.mark.projections.style?.opacity
              : 1
          }
          color={`${color}`}
          radius={radius}
          rotation="00 0"
        />
      ) : null;
      const yz = props.graphSettings.mark.projections.yz ? (
        <a-circle
          key={`yz_${i}`}
          position={`0 ${yScale(
            d[props.graphSettings.mark.position.y.field]
          )} ${zScale(d[props.graphSettings.mark.position.z.field])}`}
          opacity={
            props.graphSettings.mark.projections.style?.opacity
              ? props.graphSettings.mark.projections.style?.opacity
              : 1
          }
          color={`${color}`}
          radius={radius}
          rotation="0 90 0"
        />
      ) : null;
      return (
        <>
          {xz}
          {xy}
          {yz}
        </>
      );
    })
    : null;

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
  if (!props.graphSettings.optimizeView)
    return (
      <>
        {droplines}
        {projections}
        {marks}
        {xAxis}
        {yAxis}
        {zAxis}
        {box}
      </>
    );
  return (
    <>
      <a-frame-point-geometry
        points={JSON.stringify(pointForPointGeom)}
        color={JSON.stringify(colorForPointGeom)}
        size={radiusForPointGeom}
      />
      {xAxis}
      {yAxis}
      {zAxis}
      {box}
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
        position={'0 0 0'}
        opacity={0}
      />
    </>
  )
};

export default ScatterPlot;
