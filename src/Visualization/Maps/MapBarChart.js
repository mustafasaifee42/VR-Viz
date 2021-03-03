import React from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import GetMapShape from "../../utils/GetMapShape";
import GetMapCoordinates from "../../utils/GetMapCoordinates";
import Shape from "./Components/Shape";

const MapBarChart = (props) => {
  // Getting domain

  const heightDomain = props.graphSettings.mark.bars.style.height.domain
    ? props.graphSettings.mark.bars.style.height.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.bars.style.height.field,
        props.graphSettings.mark.bars.style.height.scaleType,
        props.graphSettings.mark.bars.style.height.startFromZero
      );

  const colorDomain = props.graphSettings.mark.bars.style.fill.scaleType
    ? props.graphSettings.mark.bars.style.fill.domain
    : GetDomain(
        props.data,
        props.graphSettings.mark.bars.style.fill.field,
        props.graphSettings.mark.bars.style.fill.scaleType,
        props.graphSettings.mark.bars.style.fill.startFromZero
      );

  //Adding scales

  const heightScale = d3
    .scaleLinear()
    .domain(heightDomain)
    .range(props.graphSettings.mark.bars.style.height.value);

  const colorRange = props.graphSettings.mark.bars.style.fill.color
    ? props.graphSettings.mark.bars.style.fill.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark.bars.style.fill.scaleType
    ? props.graphSettings.mark.bars.style.fill.scaleType === "ordinal"
      ? d3.scaleOrdinal().domain(colorDomain).range(colorRange)
      : d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;

  //Drawing Map

  const extrusionHeight = props.graphSettings.mark.map.style.extrusion.value
    ? props.graphSettings.mark.map.style.extrusion.value
    : 0.001;
  let extrusionArr = [],
    colorArray = [],
    boundingBox = [];

  let geoData = GetMapShape(
    props.graphSettings.mark.map.data,
    props.graphSettings.mark.map.projection,
    props.graphSettings.mark.mapScale,
    props.graphSettings.mark.mapOrigin,
    props.graphSettings.mark.map.shapeIdentifier,
    props.graphSettings.mark.map.shapeKey
  );

  let pointsArray = geoData.map((d, i) => {
    const points = d.vertices.split(", ");
    const pntArray = points.map((d) => {
      const pnts = d.split(" ");
      return { x: parseFloat(pnts[0]), y: parseFloat(pnts[1]) };
    });
    extrusionArr.push(extrusionHeight);
    colorArray.push(props.graphSettings.mark.map.style.fill.color);

    const min = {
      x: d3.min(pntArray, (d) => d["x"]),
      y: d3.min(pntArray, (d) => d["y"]),
    };
    const max = {
      x: d3.max(pntArray, (d) => d["x"]),
      y: d3.max(pntArray, (d) => d["y"]),
    };
    const box = (
      <a-box
        class="clickable"
        key={i}
        width={max.x - min.x}
        height={max.y - min.y}
        depth={extrusionHeight}
        position={`${(max.x + min.x) / 2} ${(max.y + min.y) / 2} ${
          extrusionHeight / 2
        }`}
        opacity={0}
      />
    );
    boundingBox.push(box);
    return pntArray;
  });

  let stroke = props.graphSettings.mark.map.style.stroke ? true : false,
    strokeColor = props.graphSettings.mark.map.style.stroke?.color
      ? props.graphSettings.mark.map.style.stroke.color
      : "#000000";

  const mapShape = (
    <a-frame-map
      points={JSON.stringify(pointsArray)}
      stroke_bool={stroke}
      stroke_color={strokeColor}
      extrude={JSON.stringify(extrusionArr)}
      color={JSON.stringify(colorArray)}
      opacity={props.graphSettings.mark.map.style.fill.opacity}
    />
  );

  const mapOutline = (
    <a-frame-map-outline
      points={JSON.stringify(pointsArray)}
      stroke_bool={stroke}
      stroke_color={strokeColor}
      extrude={extrusionHeight}
    />
  );

  //Adding Bars
  let marks = props.data.map((d, i) => {
    const hght =
      heightScale(d[props.graphSettings.mark.bars.style.height.field]) === 0
        ? 0.000000000001
        : heightScale(d[props.graphSettings.mark.bars.style.height.field]);

    const color = colorScale
      ? colorScale(d[props.graphSettings.mark.bars.style.fill.field])
      : props.graphSettings.mark.bars.style.fill.color
      ? props.graphSettings.mark.bars.style.fill.color
      : "#000000";

    const coordinates = GetMapCoordinates(
      d.longitude,
      d.latitude,
      props.graphSettings.mark.projection,
      props.graphSettings.mark.mapScale,
      props.graphSettings.mark.mapOrigin
    );

    const position = `${coordinates[0]} ${0 - coordinates[1]} ${hght / 2}`;

    const hoverText = props.graphSettings.mark.bars.mouseOver?.label
      ? props.graphSettings.mark.bars.mouseOver.label.value(d)
      : null;

    const className =
      typeof props.graphSettings.mark.bars.class === "function"
        ? `clickable ${props.graphSettings.mark.class(d, i)}`
        : "clickable";

    const idName =
      typeof props.graphSettings.mark.id === "function"
        ? (idName = props.graphSettings.mark.bars.id(d, i))
        : null;
    return (
      <Shape
        key={`${props.graphSettings.index}_Shape${i}`}
        type={props.graphSettings.mark.bars.type}
        color={`${color}`}
        opacity={props.graphSettings.mark.bars.style.fill.opacity}
        depth={`${props.graphSettings.mark.bars.style.depth}`}
        height={`${hght}`}
        width={`${props.graphSettings.mark.bars.style.width}`}
        radius={`${props.graphSettings.mark.bars.style.radius}`}
        segments={`${props.graphSettings.mark.bars.style.segments}`}
        position={position}
        hover={props.graphSettings.mark.bars.mouseOver}
        hoverText={hoverText}
        graphID={props.graphID}
        rotation={"90 0 0"}
        class={className}
        id={idName}
        data={JSON.stringify(d)}
      />
    );
  });
  return (
    <>
      {mapShape}
      {stroke ? mapOutline : null}
      {marks}
      {boundingBox}
    </>
  );
};
export default MapBarChart;
