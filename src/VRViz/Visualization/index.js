import React, { useState, useEffect } from "react";
import { csv, json, text } from "d3-request";
import * as moment from "moment";
import * as d3 from "d3";
import ReadPLY from "../utils/ReadPLY";
import Viz from "./Viz";

const Visualization = (props) => {
  const [data, setData] = useState();
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
          if (error) {
            setError(true);
          } else {
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
  return (
    <>
      {" "}
      {data === undefined || error ? null : (
        <>
          {props.graphSettings.title ? (
            <a-text
              color={
                props.graphSettings.title?.color
                  ? props.graphSettings.title?.color
                  : "#000000"
              }
              wrapCount={
                props.graphSettings.title?.wrapCount
                  ? props.graphSettings.title?.wrapCount
                  : 80
              }
              lineHeight={
                props.graphSettings.title?.lineHeight
                  ? props.graphSettings.title?.lineHeight
                  : 14
              }
              width={
                props.graphSettings.title?.fontSize
                  ? props.graphSettings.title?.fontSize
                  : 12
              }
              value={
                props.graphSettings.title?.text
                  ? props.graphSettings.title?.text
                  : "Visualization"
              }
              anchor="align"
              side="double"
              align={
                props.graphSettings.title?.align
                  ? props.graphSettings.title?.align
                  : "center"
              }
              position={props.graphSettings.title?.position}
              rotation={props.graphSettings.title?.rotation}
              billboard={
                props.graphSettings.title?.billboarding === false ? false : true
              }
            />
          ) : null}
          <Viz
            data={data}
            graphType={props.graphType}
            graphSettings={props.graphSettings}
            graphID={props.graphID}
          />
        </>
      )}
    </>
  );
};

export default Visualization;
