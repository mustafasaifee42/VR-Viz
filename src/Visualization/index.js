import React, { useState, useEffect } from "react";
import { csv, json, text } from "d3-request";
import * as moment from "moment";
import * as d3 from "d3";
import ReadPLY from "../utils/ReadPLY.js";
import CrossSectionView from "./Models/CrossSectionView";

const Visualization = (props) => {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(false);
  useEffect(() => {
    switch (props.graphSettings.data?.fileType) {
      case "json": {
        json(props.graphSettings.data.dataFile, (error, data) => {
          if (error) {
            setError(true);
          } else {
            setData(data);
          }
        });
        break;
      }
      case "csv": {
        csv(props.graphSettings.data.dataFile, (error, data) => {
          data = data.map((d) => {
            for (
              let i = 0;
              i < props.graphSettings.data.fieldDesc.length;
              i++
            ) {
              if (props.graphSettings.data.fieldDesc[i][1] === "number")
                d[props.graphSettings.data.fieldDesc[i][0]] = +d[
                  props.graphSettings.data.fieldDesc[i][0]
                ];
              if (
                props.graphSettings.data.fieldDesc[i][1] === "date" ||
                props.graphSettings.data.fieldDesc[i][1] === "time"
              )
                d[props.graphSettings.data.fieldDesc[i][0]] = moment(
                  d[props.graphSettings.data.fieldDesc[i][0]],
                  props.graphSettings.data.fieldDesc[i][2]
                )["_d"];
              if (props.graphSettings.data.fieldDesc[i][1] === "jsonObject")
                d[props.graphSettings.data.fieldDesc[i][0]] = JSON.parse(
                  d[props.graphSettings.data.fieldDesc[i][0]]
                );
            }
            return d;
          });
          if (error) {
            setError(true);
          } else {
            setData(data);
          }
        });
        break;
      }
      case "ply": {
        let data = ReadPLY(props.graphSettings.data.dataFile);
        setData(data);
        break;
      }
      case "text": {
        text(props.graphSettings.data.dataFile, (error, text) => {
          let data = d3
            .csvParseRows(text)
            .map((row) => row.map((value) => +value));
          if (error) {
            setError(true);
          } else {
            setData(data);
          }
        });
        break;
      }
      default: {
        setData(
          props.graphSettings.data?.dataFile
            ? props.graphSettings.data?.dataFile
            : "NR"
        );
        break;
      }
    }
    // eslint-disable-next-line
  }, []);

  const clickRotation =
    props.graphSettings.rotationOnDrag && !props.graphSettings.animateRotation
      ? "true"
      : "false";

  const animation = props.graphSettings.animateRotation ? (
    <a-animation
      attribute="rotation"
      easing="linear"
      dur={`${props.graphSettings.animateRotation.duration}`}
      from={props.graphSettings.animateRotation.initialAngles}
      to={props.graphSettings.animateRotation.finalAngles}
      repeat="indefinite"
    />
  ) : null;
  return data === undefined || error ? null : (
    <>
      {props.graphSettings.title ? (
        <a-text
          color={
            props.graphSettings.title?.color
              ? props.graphSettings.title?.color
              : "#000000"
          }
          wrapCount={props.graphSettings.title?.wrapCount}
          lineHeight={props.graphSettings.title?.lineHeight}
          width={props.graphSettings.title?.width}
          value={props.graphSettings.title?.value}
          anchor="align"
          side="double"
          align={
            props.graphSettings.title?.align
              ? props.graphSettings.title?.align
              : "center"
          }
          position={props.graphSettings.title?.position}
          rotation={props.graphSettings.title?.rotation}
          billboard={props.graphSettings.title?.billboarding}
        />
      ) : null}
      <a-entity>
        {animation}
        <CrossSectionView
          data={data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      </a-entity>
    </>
  );
};

export default Visualization;
