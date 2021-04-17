import React from "react";
import * as d3 from "d3";

const ContourMap = (props) => {
  if (!props.data || !props.graphSettings.style || !props.graphSettings.mark) {
    console.warn(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }

  let dataFormatted = [];
  for (let i = 0; i < props.data.length; i++) {
    for (let k = 0; k < props.data[i].length; k++) {
      dataFormatted.push([]);
      dataFormatted[dataFormatted.length - 1].push(props.data[i][k]);
    }
  }

  // Getting domain

  const colorDomain = props.graphSettings.mark?.style?.fill?.scaleType
    ? props.graphSettings.mark?.style?.fill?.domain
      ? props.graphSettings.mark?.style?.fill?.domain
      : [d3.min(dataFormatted, (d) => d[0]), d3.max(dataFormatted, (d) => d[0])]
    : null;

  //Adding scales

  const colorRange = props.graphSettings.mark?.style?.fill?.color
    ? props.graphSettings.mark?.style?.fill?.color
    : d3.schemeCategory10;

  const colorScale = props.graphSettings.mark?.style?.fill?.scaleType
    ? props.graphSettings.mark?.style?.fill?.scaleType === "ordinal"
      ? d3.scaleOrdinal().domain(colorDomain).range(colorRange)
      : d3.scaleLinear().domain(colorDomain).range(colorRange)
    : null;

  let meshVertices = [],
    colorMatrix = [],
    vertX = [],
    vertY = [],
    vertZ = [];
  for (let i = 0; i < props.data.length - 1; i++) {
    for (let k = 0; k < props.data[i].length - 1; k++) {
      const threshold = props.graphSettings.mark?.heightThreshold
        ? props.graphSettings.mark?.heightThreshold
        : 0;
      const objScaleGround = props.graphSettings.style?.objectScale?.ground
        ? props.graphSettings.style?.objectScale?.ground
        : 0.1;
      const objScaleHeight = props.graphSettings.style?.objectScale?.height
        ? props.graphSettings.style?.objectScale?.height
        : 0.1;
      vertX.push(i * objScaleGround);
      vertY.push((props.data[i][k] - threshold) * objScaleHeight);
      vertZ.push(k * objScaleGround);
      meshVertices.push(i * objScaleGround);
      meshVertices.push((props.data[i][k] - threshold) * objScaleHeight);
      meshVertices.push(k * objScaleGround);
      colorMatrix.push(
        colorScale
          ? colorScale(props.data[i][k])
          : props.graphSettings.mark?.style?.fill?.color
            ? props.graphSettings.mark?.style?.fill?.color
            : "#ff0000"
      );

      meshVertices.push((i + 1) * objScaleGround);
      meshVertices.push((props.data[i + 1][k] - threshold) * objScaleHeight);
      meshVertices.push(k * objScaleGround);
      colorMatrix.push(
        colorScale
          ? colorScale(props.data[i + 1][k])
          : props.graphSettings.mark?.style?.fill?.color
            ? props.graphSettings.mark?.style?.fill?.color
            : "#ff0000"
      );

      meshVertices.push((i + 1) * objScaleGround);
      meshVertices.push(
        (props.data[i + 1][k + 1] - threshold) * objScaleHeight
      );
      meshVertices.push((k + 1) * objScaleGround);
      colorMatrix.push(
        colorScale
          ? colorScale(props.data[i + 1][k + 1])
          : props.graphSettings.mark?.style?.fill?.color
            ? props.graphSettings.mark?.style?.fill?.color
            : "#ff0000"
      );

      meshVertices.push((i + 1) * objScaleGround);
      meshVertices.push(
        (props.data[i + 1][k + 1] - threshold) * objScaleHeight
      );
      meshVertices.push((k + 1) * objScaleGround);
      colorMatrix.push(
        colorScale
          ? colorScale(props.data[i + 1][k + 1])
          : props.graphSettings.mark?.style?.fill?.color
            ? props.graphSettings.mark?.style?.fill?.color
            : "#ff0000"
      );

      meshVertices.push(i * objScaleGround);
      meshVertices.push((props.data[i][k + 1] - threshold) * objScaleHeight);
      meshVertices.push((k + 1) * objScaleGround);
      colorMatrix.push(
        colorScale
          ? colorScale(props.data[i][k + 1])
          : props.graphSettings.mark?.style?.fill?.color
            ? props.graphSettings.mark?.style?.fill?.color
            : "#ff0000"
      );

      meshVertices.push(i * objScaleGround);
      meshVertices.push((props.data[i][k] - threshold) * objScaleHeight);
      meshVertices.push(k * objScaleGround);
      colorMatrix.push(
        colorScale
          ? colorScale(props.data[i][k])
          : props.graphSettings.mark?.style?.fill?.color
            ? props.graphSettings.mark?.style?.fill?.color
            : "#ff0000"
      );
    }
  }

  const stroke_bool = props.graphSettings.mark?.style?.stroke ? true : false;
  const stroke_width = props.graphSettings.mark?.style?.stroke?.width
    ? props.graphSettings.mark?.style?.stroke?.width
    : 1;
  const stroke_color = props.graphSettings.mark?.style?.stroke?.color
    ? props.graphSettings.mark?.style?.stroke?.color
    : "#000000";
  const stroke_opacity = props.graphSettings.mark?.style?.stroke?.opacity
    ? props.graphSettings.mark?.style?.stroke?.opacity
    : 1;
  return (
    <>
      <a-frame-mesh-from-points
        points={JSON.stringify(meshVertices)}
        color={JSON.stringify(colorMatrix)}
        stroke_bool={stroke_bool}
        stroke_color={stroke_color}
        stroke_width={stroke_width}
        stroke_opacity={stroke_opacity}
        opacity={
          props.graphSettings.mark?.style?.fill?.opacity
            ? props.graphSettings.mark?.style?.fill?.opacity
            : 1
        }
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

export default ContourMap;
