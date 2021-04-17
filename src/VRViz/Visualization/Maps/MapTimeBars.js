import React from "react";
import * as d3 from "d3";
import Shape from "../Components/Shape";
import GetMapShape from "../../utils/GetMapShape";
import GetMapCoordinates from "../../utils/GetMapCoordinates";

const MapTimeBars = (props) => {
  let dataset = [];
  for (let i = 0; i < props.data.length; i++) {
    for (
      let j = 0;
      j < props.graphSettings.mark.timeLayers.position.y.domain.length;
      j++
    ) {
      dataset.push(
        props.data[i][props.graphSettings.mark.timeLayers.position.y.domain[j]]
      );
    }
  }
  // Getting domain

  const radiusDomain = props.graphSettings.mark.timeLayers.style.radius.domain
    ? props.graphSettings.mark.timeLayers.style.radius.domain
    : props.graphSettings.mark.timeLayers.style.radius.startFromZero
      ? [0, d3.max(dataset)]
      : [d3.min(dataset), d3.max(dataset)];

  const colorDomain = props.graphSettings.mark.timeLayers.style.fill?.domain
    ? props.graphSettings.mark.timeLayers.style.fill?.domain
    : props.graphSettings.mark.timeLayers.style.fill?.startFromZero
      ? [0, d3.max(dataset)]
      : [d3.min(dataset), d3.max(dataset)];

  //Adding Scale

  const radiusScale = d3
    .scaleLinear()
    .domain(radiusDomain)
    .range(
      props.graphSettings.mark.timeLayers.style.radius.value
        ? props.graphSettings.mark.timeLayers.style.radius.value
        : [0, 1]
    );

  const colorRange = props.graphSettings.mark.timeLayers.style.fill?.color
    ? props.graphSettings.mark.timeLayers.style.fill?.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark.timeLayers.style.fill?.scaleType
    ? props.graphSettings.mark.timeLayers.style.fill?.scaleType === "ordinal"
      ? d3.scaleOrdinal().domain(colorDomain).range(colorRange)
      : d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;
  //Drawing Map

  const extrusionHeight = props.graphSettings.mark.map.style?.extrusion
    ? props.graphSettings.mark.map.style?.extrusion
    : 0.001;
  let extrusionArr = [],
    mapColorArray = [],
    boundingBox = [];

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

  let pointsArray = geoData.map((d, i) => {
    let points = d.vertices.split(", ");
    let pntArray = points.map((d) => {
      let pnts = d.split(" ");
      return { x: parseFloat(pnts[0]), y: parseFloat(pnts[1]) };
    });

    extrusionArr.push(extrusionHeight);
    mapColorArray.push(
      props.graphSettings.mark.map.style?.fill?.color
        ? props.graphSettings.mark.map.style?.fill?.color
        : "#ff0000"
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
  //Adding marks

  let marks = props.data.map((d, i) =>
    props.graphSettings.mark.timeLayers.position.y.domain.map((d1, j) => {
      const color = colorScale
        ? colorScale(d[d1])
        : props.graphSettings.mark.timeLayers.style.fill?.color
          ? props.graphSettings.mark.timeLayers.style.fill?.color
          : "#ffff00";

      const coordinates = GetMapCoordinates(
        d[props.graphSettings.mark.timeLayers.position.x.field],
        d[props.graphSettings.mark.timeLayers.position.z.field],
        props.graphSettings.mark.map.projection
          ? props.graphSettings.mark.map.projection
          : "Mercator",
        props.graphSettings.mark.mapScale,
        props.graphSettings.mark.mapOrigin
      );

      const timebarsHeight = props.graphSettings.mark.timeLayers.style.height
        ? props.graphSettings.mark.timeLayers.style.height
        : 0.2;
      const timebarsPadding = props.graphSettings.mark.timeLayers.style.padding
        ? props.graphSettings.mark.timeLayers.style.padding
        : 0;

      const position = `${coordinates[0]} ${0 - coordinates[1]} ${(j + 1 / 2) * timebarsHeight + j * timebarsPadding
        }`;

      const radius = radiusScale(d[d1]);

      const hoverText = props.graphSettings.mark.timeLayers.mouseOver?.label
        ? props.graphSettings.mark.timeLayers.mouseOver.label
          .value(d)
          .replace("Label", `${d1}`)
          .replace("LabelValue", `${d[d1]}`)
        : null;
      return (
        <Shape
          key={`data_${i}_${j}`}
          type={
            props.graphSettings.mark.timeLayers.type
              ? props.graphSettings.mark.timeLayers.type
              : "cylinder"
          }
          color={`${color}`}
          opacity={
            props.graphSettings.mark.timeLayers.style.fill?.opacity
              ? props.graphSettings.mark.timeLayers.style.fill?.opacity
              : 1
          }
          depth={`${radius}`}
          height={timebarsHeight}
          width={`${radius}`}
          radius={`${radius}`}
          segments={
            props.graphSettings.mark.timeLayers.style.segments
              ? `${props.graphSettings.mark.timeLayers.style.segments}`
              : "16"
          }
          position={position}
          hover={props.graphSettings.mark.timeLayers.mouseOver}
          hoverText={hoverText}
          graphID={props.graphID}
          rotation={"90 0 0"}
        />
      );
    })
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
      {marks}
      {boundingBox}
    </a-entity>
  );
};

export default MapTimeBars;
