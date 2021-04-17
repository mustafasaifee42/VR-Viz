import React from "react";

const CrossSectionView = (props) => {
  const clickRotation =
    props.graphSettings.animateRotation ||
      props.graphSettings.rotationOnDrag?.rotateVisualization === false
      ? "false"
      : "true";
  const modifyMaterial = props.graphSettings.mark.material ? true : false;
  const material = props.graphSettings.mark.material?.type
    ? props.graphSettings.mark.material.type
    : "none";
  const materialOpacity = props.graphSettings.mark.material?.fill?.opacity
    ? props.graphSettings.mark.material.fill.opacity
    : 1;
  const materialColor = props.graphSettings.mark.material?.fill?.color
    ? props.graphSettings.mark.material.fill.color
    : "#ff0000";
  const shininess = props.graphSettings.mark.material?.fill?.shininess
    ? props.graphSettings.mark.material.fill.shininess
    : 30;
  const emissive = props.graphSettings.mark.material?.fill?.emissive
    ? props.graphSettings.mark.material.fill.emissive
    : "#000000";
  const specular = props.graphSettings.mark.material?.fill?.specular
    ? props.graphSettings.mark.material.fill.specular
    : "#ffffff";

  const emphasisMaterial = props.graphSettings.mark.material?.emphasisMaterial
    ? true
    : false;
  const emphasisOpacity = props.graphSettings.mark.material?.emphasisMaterial
    ?.opacity
    ? props.graphSettings.mark.material.emphasisMaterial.opacity
    : 1;
  const emphasisColor = props.graphSettings.mark.material?.emphasisMaterial
    ?.color
    ? props.graphSettings.mark.material.emphasisMaterial.color
    : "#ffff00";

  const highlightEffect = props.graphSettings.mark.material?.highlightOnClick
    ? true
    : false;
  const highlightedOpacity = props.graphSettings.mark.material?.highlightOnClick
    ?.opacity
    ? props.graphSettings.mark.material?.highlightOnClick?.opacity
    : 1;
  const highlightedColor = props.graphSettings.mark.material?.highlightOnClick
    ?.color
    ? props.graphSettings.mark.material.highlightOnClick.color
    : "#ffff00";

  const stroke = props.graphSettings.mark.material?.stroke ? true : false;
  const strokeWidth = props.graphSettings.mark.material?.stroke?.width
    ? props.graphSettings.mark.material.stroke.width
    : 1;
  const strokeColor = props.graphSettings.mark.material?.stroke?.color
    ? props.graphSettings.mark.material.stroke.color
    : "#000000";
  const edgeThresholdAngle = props.graphSettings.mark.material?.stroke
    ?.edgeThresholdAngle
    ? props.graphSettings.mark.material.stroke.edgeThresholdAngle
    : 20;

  let meshName = "";
  if (props.graphSettings.mark.material?.emphasisMaterial?.meshes) {
    props.graphSettings.mark.material.emphasisMaterial.meshes.forEach((d) => {
      meshName = meshName === "" ? (meshName = d) : `${meshName},${d}`;
    });
  }
  return (
    <>
      <a-entity
        click-rotation={`enabled:${clickRotation};yAxis:${props.graphSettings.rotationOnDrag?.rotateAroundYaxis === false
            ? false
            : true
          };xAxis:${props.graphSettings.rotationOnDrag?.rotateAroundXaxis === false
            ? false
            : true
          }`}
        class={"clickable"}
        gltf-model={`url(${props.graphSettings.mark.object})`}
        position={`${props.graphSettings.style?.origin?.x
            ? props.graphSettings.style?.origin?.x
            : 0
          } ${props.graphSettings.style?.origin?.y
            ? props.graphSettings.style?.origin?.y
            : 0
          } ${props.graphSettings.style?.origin?.z
            ? props.graphSettings.style?.origin?.z
            : 0
          }`}
        play-all-model-animations
        pivot-center-model={`xPosition:${props.graphSettings.style?.origin?.x
            ? props.graphSettings.style?.origin?.x
            : 0
          };yPosition:${props.graphSettings.style?.origin?.y
            ? props.graphSettings.style?.origin?.y
            : 0
          };zPosition:${props.graphSettings.style?.origin?.z
            ? props.graphSettings.style?.origin?.z
            : 0
          };pivotX:${props.graphSettings.style?.pivot?.x};pivotY:${props.graphSettings.style?.pivot?.y
          };pivotZ:${props.graphSettings.style?.pivot?.z}`}
        modify-material={`specular:${specular};shininess:${shininess};emissive:${emissive};emphasisMaterial:${emphasisMaterial};emphasisMeshName:${meshName};emphasisOpacity:${emphasisOpacity};emphasisColor:${emphasisColor};modifyMaterial:${modifyMaterial};material:${material};materialColor:${materialColor};materialOpacity:${materialOpacity};edgeThresholdAngle:${edgeThresholdAngle};stroke:${stroke};strokeWidth:${strokeWidth};strokeColor:${strokeColor}`}
        highlight-on-click={`materialOpacity:${materialOpacity};emphasisOpacity:${emphasisOpacity};emphasisColor:${emphasisColor};materialColor:${materialColor};highlightEffect:${highlightEffect};highlightedOpacity:${highlightedOpacity};highlightedColor:${highlightedColor}`}
        scale={
          props.graphSettings.style?.scale
            ? `${props.graphSettings.style.scale[0]} ${props.graphSettings.style.scale[1]} ${props.graphSettings.style.scale[2]}`
            : "1 1 1"
        }
      />
    </>
  );
};

export default CrossSectionView;
