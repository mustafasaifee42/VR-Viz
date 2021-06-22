import React from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import Shape from "../Components/Shape";

const PointCloud = (props) => {
  if (!props.data || !props.graphSettings.style) {
    console.warn(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }

  const colorDomain = props.graphSettings.mark?.style?.fill?.scaleType
    ? props.graphSettings.mark?.style?.fill?.domain
      ? props.graphSettings.mark?.style?.fill?.domain
      : GetDomain(
        props.data,
        props.graphSettings.mark?.style?.fill?.field,
        props.graphSettings.mark?.style?.fill?.scaleType,
        props.graphSettings.mark?.style?.fill?.startFromZero
      )
    : null;

  let vertX = [],
    vertY = [],
    vertZ = [];
  const colorRange = props.graphSettings.mark?.style?.fill?.color
    ? props.graphSettings.mark?.style?.fill?.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark?.style?.fill?.scaleType
    ? props.graphSettings.mark?.style?.fill?.scaleType === "ordinal"
      ? d3.scaleOrdinal().domain(colorDomain).range(colorRange)
      : d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;
  const scalingFactor = props.graphSettings.style?.objectScale
    ? props.graphSettings.style?.objectScale
    : 1;
  //Adding marks
  const pointForPointGeom = [];
  const colorForPointGeom = [];
  const radiusForPointGeom = props.graphSettings.mark?.style?.radius
    ? props.graphSettings.mark?.style?.radius
    : 0.1;
  const marks = props.data.map((d, i) => {
    const color =
      d.r && d.g && d.b
        ? `rgb(${d.r},${d.g},${d.b})`
        : colorScale
          ? colorScale(d[props.graphSettings.mark?.style?.fill?.field])
          : props.graphSettings.mark?.style?.fill?.color
            ? props.graphSettings.mark?.style?.fill?.color
            : "#ff0000";
    colorForPointGeom.push(color)
    const radius = props.graphSettings.mark?.style?.radius
      ? props.graphSettings.mark?.style?.radius
      : 0.1;

    const hoverText = props.graphSettings.mark?.mouseOver?.label
      ? props.graphSettings.mark?.mouseOver.label.value(d)
      : null;

    vertX.push(d.x * scalingFactor);
    vertY.push(d.y * scalingFactor);
    vertZ.push(d.z * scalingFactor);
    pointForPointGeom.push(d.x * scalingFactor, d.y * scalingFactor, d.z * scalingFactor);

    return (
      <Shape
        key={i}
        type={
          props.graphSettings.mark?.type
            ? props.graphSettings.mark?.type
            : "sphere"
        }
        color={`${color}`}
        opacity={
          props.graphSettings.mark?.style?.fill?.opacity
            ? props.graphSettings.mark?.style?.fill?.opacity
            : 1
        }
        depth={`${radius}`}
        height={`${radius}`}
        width={`${radius}`}
        radius={`${radius}`}
        segments={
          props.graphSettings.mark?.style?.segments
            ? `${props.graphSettings.mark?.style?.segments}`
            : "16"
        }
        position={`${d.x * scalingFactor} ${d.y * scalingFactor} ${d.z * scalingFactor
          }`}
        hover={props.graphSettings.mark?.mouseOver}
        hoverText={hoverText}
        graphID={props.graphID}
      />
    );
  });
  if (!props.graphSettings.optimizeView)
    return (
      <>
        {marks}
        <a-box
          class="clickable"
          width={d3.max(vertX) - d3.min(vertX)}
          height={d3.max(vertY) - d3.min(vertY)}
          depth={d3.max(vertZ) - d3.min(vertZ)}
          position={`${(d3.max(vertX) + d3.min(vertX)) / 2} ${(d3.max(vertY) + d3.min(vertY)) / 2
            } ${(d3.max(vertZ) + d3.min(vertZ)) / 2}`}
          opacity={0}
        />
      </>
    );
  return (
    <>
      <a-frame-point-geometry
        points={JSON.stringify(pointForPointGeom)}
        color={JSON.stringify(colorForPointGeom)}
        size={radiusForPointGeom}
      />
      <a-box
        class="clickable"
        width={d3.max(vertX) - d3.min(vertX)}
        height={d3.max(vertY) - d3.min(vertY)}
        depth={d3.max(vertZ) - d3.min(vertZ)}
        position={`${(d3.max(vertX) + d3.min(vertX)) / 2} ${(d3.max(vertY) + d3.min(vertY)) / 2
          } ${(d3.max(vertZ) + d3.min(vertZ)) / 2}`}
        opacity={0}
      />
    </>
  );
};

export default PointCloud;
