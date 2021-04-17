import React from "react";
import * as d3 from "d3";

import GetDomain from "../../utils/GetDomain";
import GetMapShape from "../../utils/GetMapShape";
import GetMapCoordinates from "../../utils/GetMapCoordinates";

const FlowMap = (props) => {
  // Getting domain
  const colorDomain = props.graphSettings.mark.flowlines?.style?.stroke?.domain
    ? props.graphSettings.mark.flowlines?.style?.stroke?.domain
    : GetDomain(
      props.data,
      props.graphSettings.mark.flowlines?.style?.stroke?.field,
      props.graphSettings.mark.flowlines?.style?.stroke?.scaleType,
      props.graphSettings.mark.flowlines?.style?.stroke?.startFromZero
    );

  //Adding scales

  const colorRange = props.graphSettings.mark.flowlines?.style?.stroke?.color
    ? props.graphSettings.mark.flowlines?.style?.stroke?.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark.flowlines?.style?.stroke
    ?.scaleType
    ? props.graphSettings.mark.flowlines?.style?.stroke?.scaleType === "ordinal"
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
      props.graphSettings.mark.map?.style?.fill?.color
        ? props.graphSettings.mark.map?.style?.fill?.color
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

  //Adding Bars

  const sourceNode = props.graphSettings.mark.nodes?.source
    ? props.data.map((d, i) => {
      let sourcePosition = GetMapCoordinates(
        d.source_longitude,
        d.source_latitude,
        props.graphSettings.mark.map.projection
          ? props.graphSettings.mark.map.projection
          : "Mercator",
        props.graphSettings.mark.mapScale,
        props.graphSettings.mark.mapOrigin
      );

      sourcePosition[1] = -1 * sourcePosition[1];
      switch (props.graphSettings.mark.nodes?.source?.type) {
        case "box": {
          return (
            <a-box
              key={`${props.graphID}_Source${i}`}
              opacity={
                props.graphSettings.mark.nodes?.source?.style?.fill?.opacity
                  ? props.graphSettings.mark.nodes?.source?.style?.fill
                    ?.opacity
                  : 1
              }
              color={
                props.graphSettings.mark.nodes?.source?.style?.fill?.color
                  ? props.graphSettings.mark.nodes?.source?.style?.fill?.color
                  : "#000000"
              }
              width={
                props.graphSettings.mark.nodes?.source?.style?.radius
                  ? props.graphSettings.mark.nodes?.source?.style?.radius
                  : 0.05
              }
              height={
                props.graphSettings.mark.nodes?.source?.style?.radius
                  ? props.graphSettings.mark.nodes?.source?.style?.radius
                  : 0.05
              }
              depth={
                props.graphSettings.mark.nodes?.source?.style?.radius
                  ? props.graphSettings.mark.nodes?.source?.style?.radius
                  : 0.05
              }
              position={`${sourcePosition[0]} ${sourcePosition[1]} 0`}
            />
          );
        }
        default: {
          return (
            <a-sphere
              key={`${props.graphID}_Source${i}`}
              opacity={
                props.graphSettings.mark.nodes?.source?.style?.fill?.opacity
                  ? props.graphSettings.mark.nodes?.source?.style?.fill
                    ?.opacity
                  : 1
              }
              color={
                props.graphSettings.mark.nodes?.source?.style?.fill?.color
                  ? props.graphSettings.mark.nodes?.source?.style?.fill?.color
                  : "#000000"
              }
              radius={
                props.graphSettings.mark.nodes?.source?.style?.radius
                  ? props.graphSettings.mark.nodes?.source?.style?.radius
                  : 0.05
              }
              position={`${sourcePosition[0]} ${sourcePosition[1]} 0`}
            />
          );
        }
      }
    })
    : null;

  const targetNode = props.graphSettings.mark.nodes?.target
    ? props.data.map((d, i) => {
      let targetPosition = GetMapCoordinates(
        d.target_longitude,
        d.target_latitude,
        props.graphSettings.mark.map.projection
          ? props.graphSettings.mark.map.projection
          : "Mercator",
        props.graphSettings.mark.mapScale,
        props.graphSettings.mark.mapOrigin
      );

      targetPosition[1] = -1 * targetPosition[1];
      switch (props.graphSettings.mark.nodes?.target?.type) {
        case "box": {
          return (
            <a-box
              key={`${props.graphID}_Target${i}`}
              opacity={
                props.graphSettings.mark.nodes?.target?.style?.fill?.opacity
                  ? props.graphSettings.mark.nodes?.target?.style?.fill
                    ?.opacity
                  : 1
              }
              color={
                props.graphSettings.mark.nodes?.target?.style?.fill?.color
                  ? props.graphSettings.mark.nodes?.target?.style?.fill?.color
                  : "#000000"
              }
              width={
                props.graphSettings.mark.nodes?.target?.style?.radius
                  ? props.graphSettings.mark.nodes?.target?.style?.radius
                  : 0.05
              }
              height={
                props.graphSettings.mark.nodes?.target?.style?.radius
                  ? props.graphSettings.mark.nodes?.target?.style?.radius
                  : 0.05
              }
              depth={
                props.graphSettings.mark.nodes?.target?.style?.radius
                  ? props.graphSettings.mark.nodes?.target?.style?.radius
                  : 0.05
              }
              position={`${targetPosition[0]} ${targetPosition[1]} 0`}
            />
          );
        }
        default: {
          return (
            <a-sphere
              key={`${props.graphID}_Target${i}`}
              opacity={
                props.graphSettings.mark.nodes?.target?.style?.fill?.opacity
                  ? props.graphSettings.mark.nodes?.target?.style?.fill
                    ?.opacity
                  : 1
              }
              color={
                props.graphSettings.mark.nodes?.target?.style?.fill?.color
                  ? props.graphSettings.mark.nodes?.target?.style?.fill?.color
                  : "#000000"
              }
              radius={
                props.graphSettings.mark.nodes?.target?.style?.radius
                  ? props.graphSettings.mark.nodes?.target?.style?.radius
                  : 0.05
              }
              position={`${targetPosition[0]} ${targetPosition[1]} 0`}
            />
          );
        }
      }
    })
    : null;

  const curviness = props.graphSettings.mark.flowlines?.style?.stroke?.curviness
    ? props.graphSettings.mark.flowlines?.style?.stroke?.curviness
    : 0.67;

  const resolution = props.graphSettings.mark.flowlines?.style?.stroke
    ?.resolution
    ? props.graphSettings.mark.flowlines?.style?.stroke?.resolution
    : 20;

  const linkAnimatedDotRadiusDomain = props.graphSettings.mark.flowlines
    ?.flowAnimation?.radius?.domain
    ? props.graphSettings.mark.flowlines?.flowAnimation?.radius?.domain
    : GetDomain(
      props.data,
      props.graphSettings.mark.flowlines?.flowAnimation?.radius?.field,
      "linear",
      props.graphSettings.mark.flowlines?.flowAnimation?.radius?.startFromZero
    );

  const linkanimatedDotDurationDomain = props.graphSettings.mark.flowlines
    ?.flowAnimation?.duration?.domain
    ? props.graphSettings.mark.flowlines?.flowAnimation?.duration?.domain
    : GetDomain(
      props.data,
      props.graphSettings.mark.flowlines?.flowAnimation?.duration?.field,
      "linear",
      props.graphSettings.mark.flowlines?.flowAnimation?.duration
        ?.startFromZero
    );

  const animatedDotRadiusScale = props.graphSettings.mark.flowlines
    ?.flowAnimation?.radius?.scaleType
    ? d3
      .scaleLinear()
      .domain(linkAnimatedDotRadiusDomain)
      .range(props.graphSettings.mark.flowlines?.flowAnimation?.radius?.value)
    : null;

  const animatedDotDurationScale = props.graphSettings.mark.flowlines
    ?.flowAnimation?.duration?.scaleType
    ? d3
      .scaleLinear()
      .domain(linkanimatedDotDurationDomain)
      .range(
        props.graphSettings.mark.flowlines?.flowAnimation?.duration?.value
      )
    : null;

  const opacity = props.graphSettings.mark.flowlines?.style?.opacity
    ? props.graphSettings.mark.flowlines?.style?.opacity
    : 1;

  let vertexColorArray = [];
  let animationDot = [],
    curves = [];
  let curvesPoints = props.data.map((d, i) => {
    let sourcePosition = GetMapCoordinates(
      d.source_longitude,
      d.source_latitude,
      props.graphSettings.mark.map.projection
        ? props.graphSettings.mark.map.projection
        : "Mercator",
      props.graphSettings.mark.mapScale,
      props.graphSettings.mark.mapOrigin
    );

    sourcePosition[1] = -1 * sourcePosition[1];
    sourcePosition.push(0);

    let targetPosition = GetMapCoordinates(
      d.target_longitude,
      d.target_latitude,
      props.graphSettings.mark.map.projection,
      props.graphSettings.mark.mapScale,
      props.graphSettings.mark.mapOrigin
    );

    targetPosition[1] = -1 * targetPosition[1];
    targetPosition.push(0);
    const heightScaltFactor = props.graphSettings.mark.flowlines?.style?.height
      ?.scaleFactor
      ? props.graphSettings.mark.flowlines?.style?.height?.scaleFactor
      : 1;
    const middlePoint = props.graphSettings.mark.flowlines?.style?.height
      ? [
        (targetPosition[0] + sourcePosition[0]) / 2,
        (targetPosition[1] + sourcePosition[1]) / 2,
        d[props.graphSettings.mark.flowlines?.style?.height?.field] *
        heightScaltFactor,
      ]
      : [
        (targetPosition[0] + sourcePosition[0]) / 2,
        (targetPosition[1] + sourcePosition[1]) / 2,
        Math.sqrt(
          (targetPosition[0] - sourcePosition[0]) *
          (targetPosition[0] - sourcePosition[0]) +
          (targetPosition[1] - sourcePosition[1]) *
          (targetPosition[1] - sourcePosition[1])
        ) / 4,
      ];

    let pointsData = [sourcePosition, middlePoint, targetPosition];

    let pointList = pointsData.map((d) => ({
      x: `${d[0]}`,
      y: `${d[1]}`,
      z: `${d[2]}`,
    }));

    vertexColorArray.push(
      colorScale
        ? colorScale(
          d[props.graphSettings.mark.flowlines?.style?.stroke?.field]
        )
        : props.graphSettings.mark.flowlines?.style?.stroke?.color
          ? props.graphSettings.mark.flowlines?.style?.stroke?.color
          : "#ffff00"
    );

    if (props.graphSettings.mark.flowlines?.flowAnimation) {
      let animatedDotDuration = animatedDotDurationScale
        ? animatedDotDurationScale(
          d[props.graphSettings.mark.flowlines?.flowAnimation.duration.field]
        )
        : props.graphSettings.mark.flowlines?.flowAnimation.duration.value;
      let animatedDotRadius = animatedDotRadiusScale
        ? animatedDotRadiusScale(
          d[props.graphSettings.mark.flowlines?.flowAnimation.radius.field]
        )
        : props.graphSettings.mark.flowlines?.flowAnimation.radius.value;
      animationDot.push(
        <a-sphere
          key={i}
          animate-points-on-curve={`points:${JSON.stringify(
            pointList
          )};curviness:${curviness};resolution:${resolution};duration:${animatedDotDuration}`}
          radius={animatedDotRadius}
          opacity={props.graphSettings.mark.flowlines?.flowAnimation.opacity}
          color={props.graphSettings.mark.flowlines?.flowAnimation.color}
          position={`${sourcePosition[0]} ${sourcePosition[1]} ${sourcePosition[2]}`}
        />
      );
    }
    if (!props.graphSettings.mark.flowlines?.optimizePerformance) {
      curves.push(
        <a-frame-flowLine
          key={i}
          points={JSON.stringify([pointList])}
          color={JSON.stringify(vertexColorArray)}
          opacity={opacity}
          curviness={curviness}
          resolution={resolution}
        />
      );
    }
    return pointList;
  });

  if (props.graphSettings.mark.flowlines?.optimizePerformance) {
    curves = (
      <a-frame-flowLine
        points={JSON.stringify(curvesPoints)}
        color={JSON.stringify(vertexColorArray)}
        opacity={opacity}
        curviness={curviness}
        resolution={resolution}
      />
    );
  }

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
      {sourceNode}
      {targetNode}
      {curves}
      {animationDot}
      {boundingBox}
    </a-entity>
  );
};

export default FlowMap;
