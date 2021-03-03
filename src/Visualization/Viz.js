import React from "react";

import BarGraph from "./Charts/BarGraph";
import ConnectedScatterPlot from "./Charts/ConnectedScatterPlot";
import LollipopChart from "./Charts/LollipopChart";
import MeshPlot from "./Charts/MeshPlot";
import RectangleChart from "./Charts/RectangleChart";
import ScatterPlot from "./Charts/ScatterPlot";
import SpiralChart from "./Charts/SpiralChart";
import StackedBarGraph from "./Charts/StackedBarGraph";
import TimeSeries from "./Charts/TimeSeries";
import WaterFallPlot from "./Charts/WaterFallPlot";

import FlowMap from "./Maps/FlowMap";
import IsolineMap from "./Maps/IsolineMap";
import MapBarChart from "./Maps/MapBarChart";
import MapStackedBarChart from "./Maps/MapStackedBarChart";
import MapTimeBars from "./Maps/MapTimeBars";
import PrismMap from "./Maps/PrismMap";

import ContourMap from "./Diagrams/ContourMap";
import ForceDirectedGraph from "./Diagrams/ForceDirectedGraph";
import PointCloud from "./Diagrams/PointCloud";
import TreeMap from "./Diagrams/TreeMap";
import CrossSectionView from "./Diagrams/CrossSectionView";

import ContourPlot from "./Plots/ContourPlot";
import ParametricCurvePlot from "./Plots/ParametricCurvePlot";
import ParametricSurfacePlot from "./Plots/ParametricSurfacePlot";
import SurfacePlot from "./Plots/SurfacePlot";

const Viz = (props) => {
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

  let chart = null;

  switch (props.graphType) {
    case "BarGraph":
      chart = (
        <BarGraph
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "ConnectedScatterPlot":
      chart = (
        <ConnectedScatterPlot
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "LollipopChart":
      chart = (
        <LollipopChart
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "MeshPlot":
      chart = (
        <MeshPlot
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "RectangleChart":
      chart = (
        <RectangleChart
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "ScatterPlot":
      chart = (
        <ScatterPlot
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "SpiralChart":
      chart = (
        <SpiralChart
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "StackedBarGraph":
      chart = (
        <StackedBarGraph
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "TimeSeries":
      chart = (
        <TimeSeries
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "WaterFallPlot":
      chart = (
        <WaterFallPlot
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "FlowMap":
      chart = (
        <FlowMap
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "IsolineMap":
      chart = (
        <IsolineMap
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "MapBarChart":
      chart = (
        <MapBarChart
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "MapStackedBarChart":
      chart = (
        <MapStackedBarChart
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "MapTimeBars":
      chart = (
        <MapTimeBars
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "PrismMap":
      chart = (
        <PrismMap
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "ContourMap":
      chart = (
        <ContourMap
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "CrossSectionView":
      chart = (
        <CrossSectionView
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "ForceDirectedGraph":
      chart = (
        <ForceDirectedGraph
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "PointCloud":
      chart = (
        <PointCloud
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "TreeMap":
      chart = (
        <TreeMap
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "ContourPlot":
      chart = (
        <ContourPlot
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "ParametricCurvePlot":
      chart = (
        <ParametricCurvePlot
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "ParametricSurfacePlot":
      chart = (
        <ParametricSurfacePlot
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    case "SurfacePlot":
      chart = (
        <SurfacePlot
          data={props.data}
          graphSettings={props.graphSettings}
          graphID={props.graphID}
        />
      );
      break;
    default:
      console.error(
        `The visualization type ${props.graphType} does not match the set in the library.`
      );
      chart = null;
      break;
  }

  const entity =
    props.graphType === "CrossSectionView" ? (
      <a-entity id={props.graphID}>{chart}</a-entity>
    ) : (
      <a-entity
        click-rotation={`enabled:${clickRotation}`}
        pivot-center={`xPosition:${props.graphSettings.style.origin[0]};yPosition:${props.graphSettings.style.origin[1]};zPosition:${props.graphSettings.style.origin[2]};pivotX:${props.graphSettings.style.xPivot};pivotY:${props.graphSettings.style.yPivot};pivotZ:${props.graphSettings.style.zPivot}`}
        position={`${props.graphSettings.style.origin[0]} ${props.graphSettings.style.origin[1]} ${props.graphSettings.style.origin[2]}`}
        rotation={props.graphSettings.style.rotation}
        id={props.graphID}
      >
        {animation}
        {chart}
      </a-entity>
    );

  return { entity };
};

export default Viz;
