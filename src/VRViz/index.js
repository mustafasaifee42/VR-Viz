import React, { useState, useEffect } from "react";
import AFRAME from "aframe";
import Visualization from "./Visualization";

import "./AFrameComponents/ChangeColorOnHover";
import "./AFrameComponents/CursorListener";
import "./AFrameComponents/PlayAllModelAnimations";
import "./AFrameComponents/Billboard";
import "./AFrameComponents/DragRotateComponent";
import "./AFrameComponents/PivotCenter";
import "./AFrameComponents/PivotCenterForModel";
import "./AFrameComponents/MaterialModification";
import "./AFrameComponents/HighlightOnClick";

import "./AFrameGeometries/AFrameContourLines";
import "./AFrameGeometries/AFrameCurveLine";
import "./AFrameGeometries/AFrameFlowLine";
import "./AFrameGeometries/AFrameFlowLineAnimationDot";
import "./AFrameGeometries/AFrameGlobe";
import "./AFrameGeometries/AFrameMap";
import "./AFrameGeometries/AFrameMapOutline";
import "./AFrameGeometries/AFrameMeshFromPoints";
import "./AFrameGeometries/AFrameShape";
import "./AFrameGeometries/AFramePointGeometry";

require("aframe-teleport-controls");

const VRViz = (props) => {
  const [isHeadset, setIsHeadset] = useState(false);

  useEffect(() => {
    document.querySelector("a-scene").addEventListener("enter-vr", (e) => {
      if (AFRAME.utils.device.checkHeadsetConnected()) {
        setIsHeadset(true);
        if (AFRAME.utils.device.isMobile()) {
          setIsHeadset(false);
        }
      } else {
        setIsHeadset(false);
      }
    });
    document.querySelector("a-scene").addEventListener("exit-vr", (e) => {
      if (props.scene?.reloadPageOnExitVR) {
        window.location.reload();
      } else {
        setIsHeadset(false);
      }
    });
  }, [props.scene?.reloadPageOnExitVR]);

  //Light system
  const light = props.scene?.lights.map((item, i) => {
    const intensity = !item.intensity ? 1 : item.intensity;
    const decay = !item.decay ? 1 : item.decay;
    return item.type === "ambient" ? (
      <a-entity
        light={`type:${item.type}; color: ${item.color}; intensity: ${intensity}; decay: ${decay}`}
        key={`Light${i}`}
      />
    ) : (
      <a-entity
        light={`type:${item.type}; color: ${item.color}; castShadow: true; intensity: ${intensity}; decay: ${decay}`}
        position={item.position}
        key={`Light${i}`}
      />
    );
  });

  //Camera Rig and Camera
  const fov = !props.scene?.camera?.fov ? 80 : props.scene?.camera?.fov;
  const nearClipping = !props.scene?.camera?.nearClipping
    ? 0.005
    : props.scene?.camera?.nearClipping;
  const camera = isHeadset ? (
    <a-entity
      id="cameraRig"
      position={props.scene?.camera.position}
      rotation={props.scene?.camera.rotation}
    >
      <a-camera id="head" fov={fov} near={nearClipping} position="0 1.6 0" />
      <a-entity
        id="left-hand"
        windows-motion-controls="hand: left"
        vive-controls="hand: left"
        teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head;"
      />
      <a-entity
        id="right-hand"
        laser-controls="hand: right"
        raycaster="objects: .clickable;"
        line="color: red; opacity: 0.75"
        windows-motion-controls="hand: right"
        vive-controls="hand: right"
        gearvr-controls
        daydream-controls
        teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head;"
      >
        <a-entity
          cursor="fuse: false"
          position="0 0 0"
          geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
          material="color: black; shader: flat"
          raycaster="far: 0; objects: .clickable;showLine: false;"
        />
        <a-entity
          id="hover"
          geometry="primitive: plane; height: auto; width: auto"
          material="color: #000; opacity: 1"
          position="3 -0.1 -5"
          rotation="0 0 0"
          text="align: center; color: #fff; anchor: center; value: "
          visible={false}
        />
      </a-entity>
    </a-entity>
  ) : (
    <a-entity
      id="cameraRig"
      position={props.scene?.camera.position}
      rotation={props.scene?.camera.rotation}
    >
      <a-camera
        id="head"
        fov={fov}
        near={nearClipping}
        position="0 1.6 0"
        look-controls="enabled: true"
      >
        <a-entity
          cursor="fuse: false; rayOrigin: mouse"
          position="0 0 0"
          geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
          material="color: black; shader: flat"
          raycaster="objects: .clickable;showLine: true;"
        />
        <a-entity
          id="hover"
          geometry="primitive: plane; height: auto; width: auto"
          material="color: #000; opacity: 1"
          position="3 -0.1 -5"
          rotation="0 0 0"
          text="align: center; color: #fff; anchor: center; value: "
          visible={false}
        />
      </a-camera>
    </a-entity>
  );

  //Sky
  const sky = props.scene?.sky ?
    props.scene?.sky?.style?.texture === true ? (
      <a-sky id="bg" src={props.scene?.sky?.style.img} />
    ) : (
      <a-sky id="bg" color={props.scene?.sky?.style?.color ? props.scene?.sky?.style?.color : '#fff'} />
    ) : null;

  //Floor
  const floor = props.scene?.floor ? (
    props.scene?.floor.style.texture ? (
      !props.scene?.floor.style.repeat ? (
        <a-plane
          src={props.scene?.floor.style.img}
          rotation="-90 0 0"
          width={`${props.scene?.floor.style.width}`}
          height={`${props.scene?.floor.style.depth}`}
        />
      ) : (
        <a-plane
          src={props.scene?.floor.style.img}
          rotation="-90 0 0"
          width={`${props.scene?.floor.style.width}`}
          height={`${props.scene?.floor.style.depth}`}
          repeat={props.scene?.floor.style.repeat}
        />
      )
    ) : (
      <a-plane
        color={props.scene?.floor.style.color}
        rotation="-90 0 0"
        width={`${props.scene?.floor.style.width}`}
        height={`${props.scene?.floor.style.depth}`}
      />
    )
  ) : null;

  //3D-Object
  const obj = props.scene?.ThreeDObjects?.map((item, i) => (
    <a-assets key={i}>
      <a-asset-item id={item.objectID} src={item.objectFile} />
      <a-asset-item id={item.materialID} src={item.materialFile} />
    </a-assets>
  ));

  const divHeight = props.scene?.parentDiv?.height
    ? `${props.scene?.parentDiv?.height}px`
    : "100vh";
  const divWidth = props.scene?.parentDiv?.width
    ? `${props.scene?.parentDiv?.width}px`
    : "100vw";
  const divClass = props.scene?.parentDiv?.class
    ? `${props.scene?.parentDiv?.class}px`
    : "aframeBox";

  const graphs = props.graph?.map((d, i) => (
    <Visualization
      key={i}
      graphType={d.type}
      graphSettings={d}
      graphID={`graph_${i}`}
    />
  ));

  return props.scene ? (
    <a-scene
      class={divClass}
      embedded
      style={{
        height: divHeight,
        width: divWidth,
      }}
    >
      {floor}
      {sky}
      {camera}
      {light}
      {obj}
      {graphs}
    </a-scene>
  ) : (
    <a-entity>{graphs}</a-entity>
  );
};

export default VRViz;
