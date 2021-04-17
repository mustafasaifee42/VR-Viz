import React, { useEffect } from "react";
import * as d3 from "d3";
import GetDomain from "../../utils/GetDomain";
import Shape from "../Components/Shape";

const BarGraph = (props) => {

  useEffect(() => {
    d3.selectAll(".clickShape").on("click", (event) => {
      if (typeof props.graphSettings.mark?.nodes?.onClick === "function")
        props.graphSettings.mark?.nodes?.onClick(JSON.parse(d3.select(event.currentTarget).attr("data")));
    });
    d3.selectAll(".clickLink").on("click", (event) => {
      if (typeof props.graphSettings.mark?.links?.onClick === "function")
        props.graphSettings.mark?.links?.onClick(JSON.parse(d3.select(event.currentTarget).attr("data")));
    });
  }, [props.graphSettings.mark?.nodes, props.graphSettings.mark?.links]);

  if (!props.data || !props.graphSettings.style || !props.graphSettings.mark) {
    console.warn(
      `Error: Some necessary attributes missing for ${props.graphSettings.type}`
    );
    return null;
  }

  const nodeType = props.graphSettings.mark.nodes.type
    ? props.graphSettings.mark.nodes.type
    : "sphere";

  const scale = props.graphSettings.style.scale
    ? props.graphSettings.style.scale
    : 1;

  const labelWidth = props.graphSettings.mark.labels?.style?.fontSize
    ? props.graphSettings.mark.labels?.style?.fontSize
    : 1;
  const labelPadding = props.graphSettings.mark.labels?.style?.padding
    ? props.graphSettings.mark.labels?.style?.padding
    : 0.1;

  const nodeRadiusDomain = props.graphSettings.mark.nodes.style?.radius
    ?.scaleType
    ? props.graphSettings.mark.nodes.style?.radius?.domain
      ? props.graphSettings.mark.nodes.style?.radius?.domain
      : GetDomain(
        props.data.nodes,
        props.graphSettings.mark.nodes.style?.radius?.field,
        "linear",
        props.graphSettings.mark.nodes.style?.radius?.startFromZero
      )
    : null;

  const nodeColorDomain = props.graphSettings.mark.nodes.style?.fill?.scaleType
    ? props.graphSettings.mark.nodes.style?.fill?.domain
      ? props.graphSettings.mark.nodes.style?.fill?.domain
      : GetDomain(
        props.data.nodes,
        props.graphSettings.mark.nodes.style?.fill?.field,
        props.graphSettings.mark.nodes.style?.fill?.scaleType,
        props.graphSettings.mark.nodes.style?.fill?.startFromZero
      )
    : null;

  const linkColorDomain = props.graphSettings.mark.links.style?.fill?.scaleType
    ? props.graphSettings.mark.links.style?.fill?.domain
      ? props.graphSettings.mark.links.style?.fill?.domain
      : GetDomain(
        props.data.links,
        props.graphSettings.mark.links.style?.fill?.field,
        props.graphSettings.mark.links.style?.fill?.scaleType,
        props.graphSettings.mark.links.style?.fill?.startFromZero
      )
    : null;

  const linkOpacityDomain = props.graphSettings.mark.links.style?.fill?.opacity
    ?.scaleType
    ? props.graphSettings.mark.links.style?.fill?.opacity?.domain
      ? props.graphSettings.mark.links.style?.fill?.opacity?.domain
      : GetDomain(
        props.data.links,
        props.graphSettings.mark.links.style?.fill?.opacity?.field,
        "linear",
        props.graphSettings.mark.links.style?.fill?.opacity?.startFromZero
      )
    : null;

  const linkAnimatedDotRadiusDomain = props.graphSettings.mark.links
    .flowAnimation?.radius?.scaleType
    ? props.graphSettings.mark.links.flowAnimation?.radius?.domain
      ? props.graphSettings.mark.links.flowAnimation?.radius?.domain
      : GetDomain(
        props.data.link,
        props.graphSettings.mark.links.flowAnimation?.radius?.field,
        "linear",
        props.graphSettings.mark.links.flowAnimation?.radius?.startFromZero
      )
    : null;

  const linkanimatedDotDurationDomain = props.graphSettings.mark.links
    .flowAnimation?.duration?.scaleType
    ? props.graphSettings.mark.links.flowAnimation?.duration?.domain
      ? props.graphSettings.mark.links.flowAnimation?.duration?.domain
      : GetDomain(
        props.data.link,
        props.graphSettings.mark.links.flowAnimation?.duration?.field,
        "linear",
        props.graphSettings.mark.links.flowAnimation?.duration?.startFromZero
      )
    : null;

  // Scales

  const nodeRadiusScale = props.graphSettings.mark.nodes.style?.radius
    ?.scaleType
    ? d3
      .scaleLinear()
      .domain(nodeRadiusDomain)
      .range(props.graphSettings.mark.nodes.style?.radius?.value)
    : null;

  const nodeColorRange = props.graphSettings.mark.nodes?.style?.fill?.color
    ? props.graphSettings.mark.nodes.style?.fill?.color
    : d3.schemeCategory10;

  const nodeColorScale = props.graphSettings.mark.nodes?.style?.fill?.scaleType
    ? props.graphSettings.mark.nodes?.style?.fill?.scaleType === "linear"
      ? d3.scaleLinear().domain(nodeColorDomain).range(nodeColorRange)
      : d3.scaleOrdinal().domain(nodeColorDomain).range(nodeColorRange)
    : null;

  const linkColorRange = props.graphSettings.mark.links.style?.fill?.color
    ? props.graphSettings.mark.links.style?.fill?.color
    : d3.schemeCategory10;

  const linkColorScale = props.graphSettings.mark.links.style?.fill?.scaleType
    ? props.graphSettings.mark.links.style?.fill?.scaleType === "linear"
      ? d3.scaleLinear().domain(linkColorDomain).range(linkColorRange)
      : d3.scaleOrdinal().domain(linkColorDomain).range(linkColorRange)
    : null;

  const linkOpacityScale = props.graphSettings.mark.links.style?.fill?.opacity
    .scaleType
    ? d3
      .scaleLinear()
      .domain(linkOpacityDomain)
      .range(props.graphSettings.mark.links.style?.fill?.opacity.value)
    : null;

  const animatedDotRadiusScale = props.graphSettings.mark.links.flowAnimation
    ?.radius?.scaleType
    ? d3
      .scaleLinear()
      .domain(linkAnimatedDotRadiusDomain)
      .range(props.graphSettings.mark.links.flowAnimation?.radius?.value)
    : null;

  const animatedDotDurationScale = props.graphSettings.mark.links.flowAnimation
    ?.duration?.scaleType
    ? d3
      .scaleLinear()
      .domain(linkanimatedDotDurationDomain)
      .range(props.graphSettings.mark.links.flowAnimation?.duration?.value)
    : null;

  //Graph Coordinates

  let createGraph = require("ngraph.graph");

  let g = createGraph();
  let physicsSettings = { integrator: "verlet" };

  for (let i = 0; i < props.data.nodes.length; i++) {
    const r =
      nodeRadiusScale && props.graphSettings.mark.nodes.style?.radius?.field
        ? nodeRadiusScale(
          props.data.nodes[i][
          props.graphSettings.mark.nodes.style?.radius?.field
          ]
        )
        : props.graphSettings.mark.nodes.style?.radius?.value
          ? props.graphSettings.mark.nodes.style?.radius?.value
          : 0.5;

    const col =
      nodeColorScale && props.graphSettings.mark.nodes.style?.fill?.field
        ? nodeColorScale(
          props.data.nodes[i][
          props.graphSettings.mark.nodes.style?.fill?.field
          ]
        )
        : props.graphSettings.mark.nodes.style?.fill?.color
          ? props.graphSettings.mark.nodes.style?.fill?.color
          : "#ff0000";

    const lab =
      props.graphSettings.mark.labels && props.graphSettings.mark.labels?.field
        ? props.data.nodes[i][props.graphSettings.mark.labels.field]
        : "";

    g.addNode(props.data.nodes[i].id, {
      color: col,
      radius: r,
      text: lab,
      data: props.data.nodes[i],
    });
  }

  for (let i = 0; i < props.data.links.length; i++) {
    const op =
      linkOpacityScale &&
        props.graphSettings.mark.links.style?.fill?.opacity?.field
        ? linkOpacityScale(
          props.data.links[i][
          props.graphSettings.mark.links.style?.fill?.opacity?.field
          ]
        )
        : props.graphSettings.mark.links.style?.fill?.opacity?.value
          ? props.graphSettings.mark.links.style?.fill?.opacity?.value
          : 1;
    const col =
      linkColorScale && props.graphSettings.mark.links.style?.fill?.field
        ? linkColorScale(
          props.data.links[i][
          props.graphSettings.mark.links.style?.fill?.field
          ]
        )
        : props.graphSettings.mark.links.style?.fill?.color
          ? props.graphSettings.mark.links.style?.fill?.color
          : "#000000";

    const animatedDotDuration = animatedDotDurationScale
      ? animatedDotDurationScale(
        props.data.links[i][
        props.graphSettings.mark.links.flowAnimation.duration.field
        ]
      )
      : props.graphSettings.mark.links.flowAnimation?.duration?.value
        ? props.graphSettings.mark.links.flowAnimation.duration.value
        : 0;
    const animatedDotRadius = animatedDotRadiusScale
      ? animatedDotRadiusScale(
        props.data.links[i][
        props.graphSettings.mark.links.flowAnimation.radius.field
        ]
      )
      : props.graphSettings.mark.links.flowAnimation?.radius?.value
        ? props.graphSettings.mark.links.flowAnimation.radius.value
        : 0;
    g.addLink(props.data.links[i].fromId, props.data.links[i].toId, {
      color: col,
      opacity: op,
      animatedDotRadius: animatedDotRadius,
      animatedDotDuration: animatedDotDuration,
      data: props.data.links[i],
    });
  }

  let layout = require("ngraph.forcelayout3d")(g, physicsSettings),
    i;
  for (i = 0; i < 1000; ++i) {
    layout.step();
  }
  let sphere = [],
    lines = [],
    label = [];
  i = 0;
  g.forEachNode((node) => {
    const hoverText = props.graphSettings.mark.nodes.mouseOver?.label
      ? props.graphSettings.mark.nodes.mouseOver.label.value(node.data.data)
      : null;

    const idName =
      typeof props.graphSettings.mark.nodes.id === "function"
        ? props.graphSettings.mark.nodes.id(node.data.data, i)
        : null;

    const className =
      typeof props.graphSettings.mark.nodes.class === "function"
        ? `clickShape clickable ${props.graphSettings.mark.nodes.class(
          node.data.data,
          i
        )}`
        : "clickShape clickable";

    const labelClassName =
      typeof props.graphSettings.mark.labels?.class === "function" &&
        props.graphSettings.mark.labels?.class !== undefined &&
        props.graphSettings.mark.labels?.class !== null
        ? `clickShape clickable ${props.graphSettings.mark.labels.class(
          node.data.data,
          i
        )}`
        : null;

    const labelIdName =
      typeof props.graphSettings.mark.labels?.id === "function" &&
        props.graphSettings.mark.labels?.id !== undefined &&
        props.graphSettings.mark.labels?.id !== null
        ? props.graphSettings.mark.labels.id(node.data.data, i)
        : null;

    sphere.push(
      <Shape
        type={nodeType}
        key={i}
        color={`${node.data.color}`}
        opacity={1}
        depth={`${node.data.radius}`}
        height={`${node.data.radius}`}
        width={`${node.data.radius}`}
        radius={`${node.data.radius}`}
        segments={
          props.graphSettings.mark.nodes.style?.segments
            ? `${props.graphSettings.mark.nodes.style?.segments}`
            : "16"
        }
        position={`${layout.getNodePosition(node.id).x * scale} ${layout.getNodePosition(node.id).y * scale
          } ${layout.getNodePosition(node.id).z * scale}`}
        hover={props.graphSettings.mark.nodes.mouseOver}
        hoverText={hoverText}
        graphID={props.graphID}
        class={className}
        id={idName}
        data={JSON.stringify(node.data.data)}
      />
    );
    label.push(
      <a-text
        key={i}
        class={labelClassName}
        id={labelIdName}
        data={JSON.stringify(node.data.data)}
        color={node.data.color}
        width={labelWidth}
        value={node.data.text}
        opacity={
          props.graphSettings.mark.labels?.style?.opacity
            ? props.graphSettings.mark.labels?.style?.opacity
            : 1
        }
        anchor="align"
        side="double"
        align="left"
        billboard={
          props.graphSettings.mark.labels?.billboarding === false ? false : true
        }
        position={`${layout.getNodePosition(node.id).x * scale +
          node.data.radius / 2 +
          labelPadding
          } ${layout.getNodePosition(node.id).y * scale} ${layout.getNodePosition(node.id).z * scale
          }`}
      />
    );
    i++;
  });
  let animatedSphere = [];
  i = 0;
  g.forEachLink((link) => {
    const linkIdName =
      typeof props.graphSettings.mark.links.id === "function"
        ? props.graphSettings.mark.links.id(link.data.data, i)
        : null;

    const linkClassName =
      typeof props.graphSettings.mark.links.class === "function"
        ? `clickable ${props.graphSettings.mark.links.class(
          link.data.data,
          i
        )} clickLink`
        : "clickable clickLink";

    const animatedDotClassName =
      typeof props.graphSettings.mark.links.flowAnimation?.class ===
        "function" &&
        props.graphSettings.mark.links.flowAnimation?.class !== undefined &&
        props.graphSettings.mark.links.flowAnimation?.class !== null
        ? `clickLink clickable ${props.graphSettings.mark.links.flowAnimation.class(
          link.data.data,
          i
        )}`
        : null;

    const animatedDotIdName =
      typeof props.graphSettings.mark.links.flowAnimation?.id === "function" &&
        props.graphSettings.mark.links.flowAnimation?.id !== undefined &&
        props.graphSettings.mark.links.flowAnimation?.id !== null
        ? props.graphSettings.mark.links.flowAnimation.id(link.data.data, i)
        : null;

    animatedSphere.push(
      <a-sphere
        key={i}
        class={animatedDotClassName}
        id={animatedDotIdName}
        data={JSON.stringify(link.data.data)}
        position={`${layout.getLinkPosition(link.id).from.x * scale} ${layout.getLinkPosition(link.id).from.y * scale
          } ${layout.getLinkPosition(link.id).from.z * scale}`}
        radius={link.data.animatedDotRadius}
        opacity={props.graphSettings.mark.links.flowAnimation?.opacity}
        color={props.graphSettings.mark.links.flowAnimation?.color}
        animation={`property:position; to:${layout.getLinkPosition(link.id).to.x * scale
          } ${layout.getLinkPosition(link.id).to.y * scale} ${layout.getLinkPosition(link.id).to.z * scale
          }; loop: true; dur:${link.data.animatedDotDuration}; easing:linear`}
      />
    );

    lines.push(
      <a-entity
        key={i}
        class={linkClassName}
        id={linkIdName}
        data={JSON.stringify(link.data.data)}
        line={`start: ${layout.getLinkPosition(link.id).from.x * scale} ${layout.getLinkPosition(link.id).from.y * scale
          } ${layout.getLinkPosition(link.id).from.z * scale}; end: ${layout.getLinkPosition(link.id).to.x * scale
          } ${layout.getLinkPosition(link.id).to.y * scale} ${layout.getLinkPosition(link.id).to.z * scale
          }; color: ${link.data.color}; opacity: ${link.data.opacity}`}
      />
    );
    i++;
  });

  return (
    <>
      {sphere}
      {lines}
      {props.graphSettings.mark.labels ? label : null}
      {props.graphSettings.mark.links.flowAnimation ? animatedSphere : null}
    </>
  );
};

export default BarGraph;
