import * as AFRAME from "aframe";
import * as d3 from "d3";

AFRAME.registerComponent("change-color-on-hover", {
  schema: {
    hoverText: { type: "string" },
    prevOpacity: { type: "string" },
    prevColor: { type: "string" },
    focusedObjectOpacity: { type: "string", default: "1" },
    focusedObjectfill: { type: "string", default: "red" },
    nonFocusedObjectOpacity: { type: "string", default: "0.2" },
    labelWidth: { type: "string", default: "auto" },
    labelHeight: { type: "string", default: "auto" },
    lineHeight: { type: "string", default: "auto" },
    labelAlign: { type: "string", default: "center" },
    wrapCount: { type: "string", default: "4" },
    labelBackgroundColor: { type: "string", default: "black" },
    labelFontColor: { type: "string", default: "white" },
    labelPosition: { type: "string", default: "0 -0.5 -0.5" },
    labelRotation: { type: "string", default: "0 0 0" },
    graphID: { type: "string" },
    backgroundOpacity: { type: "string" },
  },

  init: function () {
    var data = this.data;
    var el = this.el; // <a-box>

    el.addEventListener("mouseenter", function () {
      let hvr = document.getElementById("hover");

      let shapes = d3.selectAll(`#${data.graphID}`).selectAll(".shapes");

      if (data.hoverText !== "undefined") {
        hvr.setAttribute("visible", true);
        hvr.setAttribute("text", "value", data.hoverText);
      }

      if (data.nonFocusedObjectOpacity !== "undefined") {
        shapes.attr("opacity", parseFloat(data.nonFocusedObjectOpacity));
      }

      if (data.focusedObjectOpacity !== "undefined") {
        el.setAttribute("opacity", data.focusedObjectOpacity);
      }

      if (data.focusedObjectfill !== "undefined") {
        el.setAttribute("color", data.focusedObjectfill);
      }

      if (data.labelPosition !== "undefined")
        hvr.setAttribute("position", data.labelPosition);
      else hvr.setAttribute("position", "0 -0.3 -1");

      if (data.labelRotation !== "undefined")
        hvr.setAttribute("rotation", data.labelRotation);
      else hvr.setAttribute("rotation", "0 0 0");
      if (data.wrapCount !== "undefined")
        hvr.setAttribute("text", "wrapCount", data.wrapCount);

      if (data.lineHeight !== "undefined")
        hvr.setAttribute("text", "lineHeight", data.lineHeight);

      if (data.labelFontColor !== "undefined")
        hvr.setAttribute("text", "color", data.labelFontColor);

      if (data.labelAlign !== "undefined")
        hvr.setAttribute("text", "align", data.labelAlign);

      if (data.labelWidth !== "undefined")
        hvr.setAttribute("geometry", "width", data.labelWidth);

      if (data.labelHeight !== "undefined")
        hvr.setAttribute("geometry", "height", data.labelHeight);

      if (data.labelBackgroundColor !== "undefined")
        hvr.setAttribute("material", "color", data.labelBackgroundColor);

      if (data.backgroundOpacity !== "undefined")
        hvr.setAttribute("material", "opacity", data.backgroundOpacity);
      else hvr.setAttribute("material", "opacity", 1);
    });

    el.addEventListener("mouseleave", function () {
      let hvr = document.getElementById("hover");
      hvr.setAttribute("visible", false);
      el.setAttribute("opacity", data.prevOpacity);
      el.setAttribute("color", data.prevColor);
      d3.selectAll(`#${data.graphID}`)
        .selectAll(".shapes")
        .attr("opacity", parseFloat(data.prevOpacity));
    });
  },
});
