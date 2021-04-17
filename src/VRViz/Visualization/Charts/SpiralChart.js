import React from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";

const SpiralChart = (props) => {
  // Getting domain
  const strokeColorDomain = props.graphSettings.mark.style?.stroke?.scaleType
    ? props.graphSettings.mark.style?.stroke?.domain
      ? props.graphSettings.mark.style?.stroke?.domain
      : GetDomain(
        props.data,
        props.graphSettings.mark.style?.stroke?.field,
        props.graphSettings.mark.style?.stroke?.scaleType,
        props.graphSettings.mark.style?.stroke?.startFromZero
      )
    : null;

  const fillColorDomain = props.graphSettings.mark.style?.fill?.scaleType
    ? props.graphSettings.mark.style?.fill?.domain
      ? props.graphSettings.mark.style?.fill?.domain
      : GetDomain(
        props.data,
        props.graphSettings.mark.style?.fill?.field,
        props.graphSettings.mark.style?.fill?.scaleType,
        props.graphSettings.mark.style?.fill?.startFromZero
      )
    : null;

  //Adding scales

  const scales = props.graphSettings.mark.vertices.map((d) =>
    d3
      .scaleLinear()
      .domain(
        d.domain
          ? d.domain
          : GetDomain(props.data, d.title, "linear", d.startFromZero)
      )
      .range([0, props.graphSettings.style.width])
  );

  const strokeColorRange = props.graphSettings.mark.style?.stroke?.color
    ? props.graphSettings.mark.style?.stroke?.color
    : d3.schemeCategory10;

  const strokeColorScale = props.graphSettings.mark.style?.stroke?.scaleType
    ? props.graphSettings.mark.style?.stroke?.scaleType === "linear"
      ? d3.scaleLinear().domain(strokeColorDomain).range(strokeColorRange)
      : d3.scaleOrdinal().domain(strokeColorDomain).range(strokeColorRange)
    : null;

  const fillColorRange = props.graphSettings.mark.style?.fill?.color
    ? props.graphSettings.mark.style?.fill?.color
    : d3.schemeCategory10;

  const fillColorScale = props.graphSettings.mark.style?.fill?.scaleType
    ? props.graphSettings.mark.style?.fill?.scaleType === "linear"
      ? d3.scaleLinear().domain(fillColorDomain).range(fillColorRange)
      : d3.scaleOrdinal().domain(fillColorDomain).range(fillColorRange)
    : null;

  //Drawing SpiralCoordinates
  const yPos = props.graphSettings.style.height / props.data.length;
  const angle = (Math.PI * 2) / props.graphSettings.mark.vertices.length;

  const shapeCoordinates = props.data.map((d) => {
    let coordinates = "";
    scales.forEach((scale, j) => {
      coordinates =
        coordinates +
        `${scale(d[props.graphSettings.mark.vertices[j].title]) *
        Math.sin(j * angle)
        } ${0 -
        scale(d[props.graphSettings.mark.vertices[j].title]) *
        Math.cos(j * angle)
        },`;
    });
    coordinates =
      coordinates +
      `${scales[0](d[props.graphSettings.mark.vertices[0].title]) * Math.sin(0)
      } ${0 -
      scales[0](d[props.graphSettings.mark.vertices[0].title]) * Math.cos(0)
      }`;

    return coordinates;
  });

  //Adding curves

  const marks = props.data.map((d, i) => {
    const points = shapeCoordinates[i].split(",");
    let pntArray = points.map((d) => {
      let pnts = d.split(" ");
      return { x: pnts[0], y: pnts[1], z: 0 };
    });
    const outline =
      strokeColorScale && props.graphSettings.mark.style?.stroke?.field ? (
        <a-frame-curve-line
          points={JSON.stringify(pntArray)}
          type={"line"}
          color={strokeColorScale(
            d[props.graphSettings.mark.style?.stroke?.field]
          )}
          opacity={1}
          stroke_width={
            props.graphSettings.mark.style?.stroke?.width
              ? props.graphSettings.mark.style?.stroke?.width
              : 1
          }
        />
      ) : (
        <a-frame-curve-line
          points={JSON.stringify(pntArray)}
          type={"line"}
          color={
            props.graphSettings.mark.style?.stroke?.color
              ? props.graphSettings.mark.style?.stroke?.color
              : "#ff0000"
          }
          opacity={1}
          stroke_width={
            props.graphSettings.mark.style?.stroke?.width
              ? props.graphSettings.mark.style?.stroke?.width
              : 1
          }
        />
      );
    const shape = props.graphSettings.mark.style?.fill ? (
      fillColorScale && props.graphSettings.mark.style?.fill?.field ? (
        <a-frame-shape
          points={JSON.stringify(pntArray)}
          color={"#ff0000"}
          opacity={
            props.graphSettings.mark.style?.fill?.opacity
              ? props.graphSettings.mark.style?.fill?.opacity
              : 1
          }
        />
      ) : (
        <a-frame-shape
          points={JSON.stringify(pntArray)}
          color={
            props.graphSettings.mark.style?.fill?.color
              ? props.graphSettings.mark.style?.fill?.color
              : "#ff0000"
          }
          opacity={
            props.graphSettings.mark.style?.fill?.opacity
              ? props.graphSettings.mark.style?.fill?.opacity
              : 1
          }
        />
      )
    ) : null;
    return (
      <a-entity rotation="90 0 0" position={`0 ${i * yPos} 0`} key={i}>
        {shape}
        {outline}
      </a-entity>
    );
  });

  return (
    <>
      {marks}
      <a-box
        class="clickable"
        position={`0 ${props.graphSettings.style.height / 2} 0`}
        opacity="0"
        height={props.graphSettings.style.height}
        depth={props.graphSettings.style.width * 2}
        width={props.graphSettings.style.width * 2}
      />
    </>
  );
};
export default SpiralChart;
