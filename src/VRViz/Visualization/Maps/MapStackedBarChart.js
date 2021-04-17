import React from "react";
import * as d3 from "d3";
import _ from "lodash";
import GetMapShape from "../../utils/GetMapShape";
import GetMapCoordinates from "../../utils/GetMapCoordinates";
import GetDomain from "../../utils/GetDomain";
import Shape from "../Components/Shape";

const MapStackedBarChart = (props) => {
  // Data manipulation

  let data = d3.stack().keys(props.graphSettings.mark.bars.style.fill.field)(
    props.data
  );
  let dataset = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      dataset.push(data[i][j]);
    }
  }
  // Getting domain
  let heightDomain = props.graphSettings.mark.bars.style.height?.domain
    ? props.graphSettings.mark.bars.style.height?.domain
    : GetDomain(
      _.flattenDepth(data, 1),
      1,
      "linear",
      props.graphSettings.mark.bars.style.height?.startFromZero
    );
  //Adding scales

  let yScale;

  yScale = d3
    .scaleLinear()
    .domain(heightDomain)
    .range(
      props.graphSettings.mark.bars.style.height?.value
        ? props.graphSettings.mark.bars.style.height?.value
        : [0, 5]
    );

  //Drawing Map

  let geoData = GetMapShape(
    props.graphSettings.mark.map.data,
    props.graphSettings.mark.map.projection
      ? props.graphSettings.mark.map.projection
      : "Mercator",
    props.graphSettings.mark.mapScale,
    props.graphSettings.mark.mapOrigin,
    props.graphSettings.mark.map.shapeIdentifier,
    props.graphSettings.mark.map.shapeKey
  );

  const extrusionHeight = props.graphSettings.mark.map.style?.extrusion
    ? props.graphSettings.mark.map.style?.extrusion
    : 0.001;
  let extrusionArr = [],
    colorArray = [],
    boundingBox = [];

  let pointsArray = geoData.map((d, i) => {
    const points = d.vertices.split(", ");
    const pntArray = points.map((d) => {
      let pnts = d.split(" ");
      return { x: parseFloat(pnts[0]), y: parseFloat(pnts[1]) };
    });
    extrusionArr.push(extrusionHeight);
    colorArray.push(
      props.graphSettings.mark.map.style?.fill?.color
        ? props.graphSettings.mark.map.style?.fill?.color
        : "#ff0000"
    );

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
        position={`${max.x / 2 + min.x / 2} ${(max.y + min.y) / 2} ${extrusionHeight / 2
          }`}
        opacity={0}
      />
    );
    boundingBox.push(box);
    return pntArray;
  });

  const stroke = props.graphSettings.mark.map.style?.stroke ? true : false;

  const strokeColor = props.graphSettings.mark.map.style?.stroke?.color
    ? props.graphSettings.mark.map.style?.stroke?.color
    : "#000000";

  const mapShape = (
    <a-frame-map
      points={JSON.stringify(pointsArray)}
      stroke_bool={stroke}
      stroke_color={strokeColor}
      extrude={JSON.stringify(extrusionArr)}
      color={JSON.stringify(colorArray)}
      opacity={
        props.graphSettings.mark.map.style?.fill?.opacity
          ? props.graphSettings.mark.map.style?.fill?.opacity
          : 1
      }
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

  let marks = data.map((d, i) => {
    let markTemp = d.map((d1, j) => {
      const hght =
        yScale(d1[1] - d1[0]) === 0 ? 0.000000000001 : yScale(d1[1] - d1[0]);

      const color = props.graphSettings.mark.bars.style.fill.color
        ? props.graphSettings.mark.bars.style.fill.color[i]
        : d3.schemeCategory10[i % 10];

      const coordinates = GetMapCoordinates(
        d1.data.longitude,
        d1.data.latitude,
        props.graphSettings.mark.map.projection
          ? props.graphSettings.mark.map.projection
          : "Mercator",
        props.graphSettings.mark.mapScale,
        props.graphSettings.mark.mapOrigin
      );

      const position = `${coordinates[0]} ${0 - coordinates[1]} ${yScale(d1[0]) + hght / 2
        }`;

      const hoverText = props.graphSettings.mark.bars.mouseOver?.label
        ? props.graphSettings.mark.bars.mouseOver.label
          .value(d1.data)
          .replace("Label", `${d.key}`)
          .replace("LabelValue", `${d1.data[d.key]}`)
        : null;

      return (
        <Shape
          key={`${i}_${j}`}
          type={
            props.graphSettings.mark.bars.type
              ? props.graphSettings.mark.bars.type
              : "box"
          }
          color={`${color}`}
          opacity={
            props.graphSettings.mark.bars.style.fill.opacity
              ? props.graphSettings.mark.bars.style.fill.opacity
              : 1
          }
          depth={
            props.graphSettings.mark.bars.style.depth
              ? `${props.graphSettings.mark.bars.style.depth}`
              : "0.2"
          }
          height={`${hght}`}
          width={
            props.graphSettings.mark.bars.style.width
              ? `${props.graphSettings.mark.bars.style.width}`
              : "0.2"
          }
          radius={
            props.graphSettings.mark.bars.style.radius
              ? `${props.graphSettings.mark.bars.style.radius}`
              : "0.2"
          }
          segments={
            props.graphSettings.mark.bars.style.segments
              ? `${props.graphSettings.mark.bars.style.segments}`
              : "16"
          }
          position={position}
          hover={props.graphSettings.mark.bars.mouseOver}
          hoverText={hoverText}
          graphID={props.graphID}
          rotation={"90 0 0"}
        />
      );
    });
    return markTemp;
  });
  return (
    <a-entity
      rotation={
        props.graphSettings.mark.rotation
          ? props.graphSettings.mark.rotation
          : "0 0 0"
      }
    >
      {mapShape}
      {stroke ? mapOutline : null}
      {marks}
      {boundingBox}
    </a-entity>
  );
};

export default MapStackedBarChart;
