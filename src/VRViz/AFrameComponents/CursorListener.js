import * as AFRAME from "aframe";
import * as d3 from "d3";

AFRAME.registerComponent("cursor-listener", {
  schema: {
    on: { type: "string" },
    target: { type: "selector" },
    text: { type: "string" },
  },

  init: function (_data) {
    this.el.addEventListener("mouseenter", function (_evt) {
      d3.selectAll("#mouseHover")
        .append("a-entity")
        .attr("class", "hover")
        .attr("position", "-2.5 1 0")
        .attr("geometry", "primitive: plane; width: 3; height: auto")
        .attr("material", "color: blue")
        .attr(
          "text",
          "anchor: center; width: 1.5; color: white; value: \n[CENTER ANCHOR]\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam"
        );
    });
    this.el.addEventListener("mouseleave", function (_evt) {
      d3.selectAll(".hover").remove();
    });
  },
});
