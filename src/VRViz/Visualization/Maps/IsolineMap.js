import React from "react";
import * as d3 from "d3";

import GetDomain from "../../utils/GetDomain";
import GetMapShape from "../../utils/GetMapShape";
import GetMapCoordinates from "../../utils/GetMapCoordinates";

const IsolineMap = (props) => {
  // Getting domain]

  const colorDomain = props.graphSettings.mark.isoLines.style?.stroke?.domain
    ? props.graphSettings.mark.isoLines.style?.stroke?.domain
    : GetDomain(
      props.data,
      props.graphSettings.mark.isoLines.style?.stroke?.field,
      props.graphSettings.mark.isoLines.style?.stroke?.scaleType,
      props.graphSettings.mark.isoLines.style?.stroke?.startFromZero
    );

  const elevationDomain = props.graphSettings.mark.isoLines.elevation.domain
    ? props.graphSettings.mark.isoLines.elevation.domain
    : GetDomain(
      props.data,
      props.graphSettings.mark.isoLines.elevation.field,
      "linear",
      props.graphSettings.mark.isoLines.elevation.startFromZero
    );

  //Adding scales

  const colorRange = props.graphSettings.mark.isoLines.style?.stroke?.color
    ? props.graphSettings.mark.isoLines.style?.stroke?.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark.isoLines.style?.stroke?.scaleType
    ? props.graphSettings.mark.isoLines.style?.stroke?.scaleType === "ordinal"
      ? d3.scaleOrdinal().domain(colorDomain).range(colorRange)
      : d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;

  const elevationScale = d3
    .scaleLinear()
    .domain(elevationDomain)
    .range(
      props.graphSettings.mark.isoLines.elevation.value
        ? props.graphSettings.mark.isoLines.elevation.value
        : [0, 5]
    );

  //Drawing Map
  const extrusionHeight = props.graphSettings.mark.map.style?.extrusion
    ? props.graphSettings.mark.map.style?.extrusion
    : 0.001;
  let extrusionArr = [],
    mapColorArray = [],
    boundingBox = [];

  const geoData = GetMapShape(
    props.graphSettings.mark.map.data,
    props.graphSettings.mark.map.projection
      ? props.graphSettings.mark.map.projection
      : "Mercator",
    props.graphSettings.mark.mapScale,
    props.graphSettings.mark.mapOrigin,
    props.graphSettings.mark.map.shapeIdentifier,
    props.graphSettings.mark.map.shapeKey
  );

  const pointsArray = geoData.map((d, i) => {
    const points = d.vertices.split(", ");
    const pntArray = points.map((d) => {
      const pnts = d.split(" ");
      return { x: parseFloat(pnts[0]), y: parseFloat(pnts[1]) };
    });
    extrusionArr.push(extrusionHeight);
    mapColorArray.push(
      props.graphSettings.mark.map.style?.fill?.color
        ? props.graphSettings.mark.map.style?.fill?.color
        : "#000000"
    );

    let min = {
      x: d3.min(pntArray, (d) => d["x"]),
      y: d3.min(pntArray, (d) => d["y"]),
    };
    let max = {
      x: d3.max(pntArray, (d) => d["x"]),
      y: d3.max(pntArray, (d) => d["y"]),
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
      color={JSON.stringify(mapColorArray)}
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

  let path = [],
    colorArray = [];
  props.data.forEach((d, i) => {
    for (let j = 0; j < d.geojson.geometry.coordinates.length; j++) {
      let position = GetMapCoordinates(
        d.geojson.geometry.coordinates[j][0],
        d.geojson.geometry.coordinates[j][1],
        props.graphSettings.mark.map.projection
          ? props.graphSettings.mark.map.projection
          : "Mercator",
        props.graphSettings.mark.mapScale,
        props.graphSettings.mark.mapOrigin
      );
      if (j === 0 || j === d.geojson.geometry.coordinates.length - 1) {
        path.push({
          x: position[0],
          y: 0 - position[1],
          z: elevationScale(
            d[props.graphSettings.mark.isoLines.elevation.field]
          ),
        });
        colorArray.push(
          colorScale
            ? colorScale(
              d[props.graphSettings.mark.isoLines.style?.stroke?.field]
            )
            : props.graphSettings.mark.isoLines.style?.stroke?.color
              ? props.graphSettings.mark.isoLines.style?.stroke?.color
              : "#000000"
        );
      } else {
        path.push({
          x: position[0],
          y: 0 - position[1],
          z: elevationScale(
            d[props.graphSettings.mark.isoLines.elevation.field]
          ),
        });
        path.push({
          x: position[0],
          y: 0 - position[1],
          z: elevationScale(
            d[props.graphSettings.mark.isoLines.elevation.field]
          ),
        });
        colorArray.push(
          colorScale
            ? colorScale(
              d[props.graphSettings.mark.isoLines.style?.stroke?.field]
            )
            : props.graphSettings.mark.isoLines.style?.stroke?.color
              ? props.graphSettings.mark.isoLines.style?.stroke?.color
              : "#000000"
        );
        colorArray.push(
          colorScale
            ? colorScale(
              d[props.graphSettings.mark.isoLines.style?.stroke?.field]
            )
            : props.graphSettings.mark.isoLines.style?.stroke?.color
              ? props.graphSettings.mark.isoLines.style?.stroke?.color
              : "#000000"
        );
      }
    }
  });
  let contourList = JSON.stringify(path);
  let colorList = JSON.stringify(colorArray);
  let contours = (
    <a-frame-contour-lines
      points={contourList}
      color={colorList}
      opacity={
        props.graphSettings.mark.isoLines.style?.stroke?.opacity
          ? props.graphSettings.mark.isoLines.style?.stroke?.opacity
          : 1
      }
    />
  );
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
      {contours}
      {boundingBox}
    </a-entity>
  );
};
export default IsolineMap;
