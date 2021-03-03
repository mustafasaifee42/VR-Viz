import React from "react";
import * as d3 from "d3";
import GetDomain from "../Utils/GetDomain.js";

const SpiralChart = (props) => {
  // Getting domain
  const strokeColorDomain = props.graphSettings.mark.style.stroke?.scaleType
    ? props.graphSettings.mark.style.stroke.domain
      ? props.graphSettings.mark.style.stroke.domain
      : GetDomain(
          props.data,
          props.graphSettings.mark.style.stroke.field,
          props.graphSettings.mark.style.stroke.scaleType,
          props.graphSettings.mark.style.stroke.startFromZero
        )
    : null;

  const fillColorDomain = props.graphSettings.mark.style.fill?.scaleType
    ? props.graphSettings.mark.style.fill.domain
      ? props.graphSettings.mark.style.fill.domain
      : GetDomain(
          props.data,
          props.graphSettings.mark.style.fill.field,
          props.graphSettings.mark.style.fill.scaleType,
          props.graphSettings.mark.style.fill.startFromZero
        )
    : null;

  //Adding scales

  const scales = props.graphSettings.mark.vertices.map((d) =>
    d3
      .scaleLinear()
      .domain(
        d.domain
          ? d.domain
          : GetDomain(props.data, d.title, d.scaleType, d.startFromZero)
      )
      .range([0, props.graphSettings.style.width])
  );

  const strokeColorRange = props.graphSettings.mark.style.stroke?.color
    ? props.graphSettings.mark.style.stroke.color
    : d3.schemeCategory10;

  const strokeColorScale = props.graphSettings.mark.style.stroke?.scaleType
    ? props.graphSettings.mark.style.stroke.scaleType === "linear"
      ? d3.scaleLinear().domain(strokeColorDomain).range(strokeColorRange)
      : d3.scaleOrdinal().domain(strokeColorDomain).range(strokeColorRange)
    : null;

  const fillColorRange = props.graphSettings.mark.style.fill?.color
    ? props.graphSettings.mark.style.fill.color
    : d3.schemeCategory10;

  const fillColorScale = props.graphSettings.mark.style.fill?.scaleType
    ? props.graphSettings.mark.style.fill.scaleType === "linear"
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
        `${scale(d[this.props.mark.vertices[j].title]) * Math.sin(j * angle)} ${
          0 - scale(d[this.props.mark.vertices[j].title]) * Math.cos(j * angle)
        },`;
    });
    coordinates =
      coordinates +
      `${scales[0](d[this.props.mark.vertices[0].title]) * Math.sin(0)} ${
        0 - scales[0](d[this.props.mark.vertices[0].title]) * Math.cos(0)
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
    const outline = props.graphSettings.mark.style.stroke ? (
      strokeColorScale ? (
        <a-frame-curve-line
          points={JSON.stringify(pntArray)}
          type={"line"}
          color={strokeColorScale(
            d[props.graphSettings.mark.style.stroke.field]
          )}
          opacity={1}
          stroke_width={props.graphSettings.mark.style.stroke.width}
        />
      ) : (
        <a-frame-curve-line
          points={JSON.stringify(pntArray)}
          type={"line"}
          color={props.graphSettings.mark.style.stroke.color}
          opacity={1}
          stroke_width={props.graphSettings.mark.style.stroke.width}
        />
      )
    ) : null;

    const shape = props.graphSettings.mark.style.fill ? (
      strokeColorScale ? (
        <a-frame-shape
          points={JSON.stringify(pntArray)}
          color={fillColorScale(d[props.graphSettings.mark.style.fill.field])}
          opacity={props.graphSettings.mark.style.fill.opacity}
        />
      ) : (
        <a-frame-shape
          points={JSON.stringify(pntArray)}
          color={props.graphSettings.mark.style.fill.color}
          opacity={props.graphSettings.mark.style.fill.opacity}
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
        position={`0 ${this.props.style.height / 2} 0`}
        opacity="0"
        height={this.props.style.height}
        depth={this.props.style.width * 2}
        width={this.props.style.width * 2}
      />
    </>
  );
};
export default SpiralChart;
