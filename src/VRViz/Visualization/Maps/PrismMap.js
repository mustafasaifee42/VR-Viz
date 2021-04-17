import React from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import GetMapShape from "../../utils/GetMapShape";

const PrismMap = (props) => {
  // Data Manipulation

  let data = {};
  props.data.forEach((d) => {
    data[d[props.graphSettings.mark.shapeIdentifier]] = props.graphSettings.mark
      .style.fill?.scaleType
      ? {
        value: d[props.graphSettings.mark.style.extrusion.field],
        colorField: d[props.graphSettings.mark.style.fill?.field],
      }
      : {
        value: d[props.graphSettings.mark.style.extrusion.field],
        colorField: null,
      };
  });

  // Getting domain

  const extrusionDomain = props.graphSettings.mark.style.extrusion.domain
    ? props.graphSettings.mark.style.extrusion.domain
    : GetDomain(
      props.data,
      props.graphSettings.mark.style.extrusion.field,
      "linear",
      props.graphSettings.mark.style.extrusion.startFromZero
    );

  const colorDomain = props.graphSettings.mark.style.fill?.scaleType
    ? props.graphSettings.mark.style.fill?.scaleType
      ? props.graphSettings.mark.style.fill?.scaleType
      : GetDomain(
        props.data,
        props.graphSettings.mark.style.fill?.field,
        props.graphSettings.mark.style.fill?.scaleType,
        props.graphSettings.mark.style.fill?.startFromZero
      )
    : null;

  //Adding scales

  const extrusionScale = d3
    .scaleLinear()
    .domain(extrusionDomain)
    .range(
      props.graphSettings.mark.style.extrusion.value
        ? props.graphSettings.mark.style.extrusion.value
        : [0, 5]
    );

  const colorRange = props.graphSettings.mark.style.fill?.color
    ? props.graphSettings.mark.style.fill?.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark.style.fill?.scaleType
    ? props.graphSettings.mark.style.fill?.scaleType === "ordinal"
      ? d3.scaleOrdinal().domain(colorDomain).range(colorRange)
      : d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;

  //Adding marks
  const stroke = props.graphSettings.mark.style.stroke ? true : false;
  const strokeColor = props.graphSettings.mark.style.stroke?.color
    ? props.graphSettings.mark.style.stroke?.color
    : "#000000";
  const sphere = props.graphSettings.mark.projection ? null : (
    <a-sphere
      class="clickable"
      position={`0 0 0`}
      radius={props.graphSettings.mark.mapScale}
      color={props.graphSettings.mark.sphereColor}
    />
  );
  const geoData = GetMapShape(
    props.graphSettings.mark.data,
    props.graphSettings.mark.projection,
    props.graphSettings.mark.mapScale,
    props.graphSettings.mark.mapOrigin,
    props.graphSettings.mark.shapeIdentifier,
    props.graphSettings.mark.shapeKey
  );

  let extrusionArr = [];
  let colorArray = [];
  let boundingBox = [];
  const pts = geoData.map((d, i) => {
    const points = d.vertices.split(", ");
    const pointsArray = points.map((d) => {
      const pnts = d.split(" ");
      return { x: parseFloat(pnts[0]), y: parseFloat(pnts[1]) };
    });
    const extrusionHeight =
      extrusionScale(data[d["code"]]["value"]) === 0
        ? 0.000000000001
        : extrusionScale(data[d["code"]]["value"]);
    extrusionArr.push(extrusionHeight);
    colorArray.push(
      colorScale
        ? colorScale(data[d["code"]]["colorField"])
        : props.graphSettings.mark.style.fill?.color
          ? props.graphSettings.mark.style.fill?.color
          : "#ff0000"
    );

    let min = {
      x: d3.min(pointsArray, (d) => d["x"]),
      y: d3.min(pointsArray, (d) => d["y"]),
    };
    let max = {
      x: d3.max(pointsArray, (d) => d["x"]),
      y: d3.max(pointsArray, (d) => d["y"]),
    };
    let box = (
      <a-box
        class="clickable"
        key={i}
        width={max.x - min.x}
        height={max.y - min.y}
        depth={extrusionHeight}
        position={`${(max.x + min.x) / 2} ${(max.y + min.y) / 2} ${extrusionHeight / 2
          }`}
        opacity={0}
      />
    );
    boundingBox.push(box);
    return pointsArray;
  });

  const projectiocMapShape = (
    <a-frame-map
      class="clickable"
      points={JSON.stringify(pts)}
      stroke_bool={stroke}
      stroke_color={strokeColor}
      extrude={JSON.stringify(extrusionArr)}
      color={JSON.stringify(colorArray)}
      opacity={
        props.graphSettings.mark.style.fill?.opacity
          ? props.graphSettings.mark.style.fill?.opacity
          : 1
      }
    />
  );

  const shapes = props.graphSettings.mark.projection
    ? projectiocMapShape
    : geoData.map((d, i) => (
      <a-frame-globe
        key={i}
        points={JSON.stringify(d.vertices.geometry)}
        radius={props.graphSettings.mark.mapScale}
        extrude={
          extrusionScale(data[d.code].value) === 0
            ? 0.000000000001
            : extrusionScale(data[d.code].value)
        }
        color={
          colorScale
            ? colorScale(data[d.code].colorField)
            : props.graphSettings.mark.style.fill?.color
              ? props.graphSettings.mark.style.fill?.color
              : "#ff0000"
        }
        opacity={
          props.graphSettings.mark.style.fill?.opacity
            ? props.graphSettings.mark.style.fill?.opacity
            : 1
        }
        stroke_bool={stroke}
        stroke_color={strokeColor}
      />
    ));

  return (
    <a-entity
      rotation={
        props.graphSettings.mark.rotation
          ? props.graphSettings.mark.rotation
          : "0 0 0"
      }
    >
      {sphere}
      {shapes}
      {props.graphSettings.mark.projection ? boundingBox : null}
    </a-entity>
  );
};
export default PrismMap;
