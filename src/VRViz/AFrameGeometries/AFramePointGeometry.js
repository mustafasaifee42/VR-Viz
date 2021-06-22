import * as THREE from "three";
import AFRAME from "aframe";

AFRAME.registerPrimitive("a-frame-point-geometry", {
    defaultComponents: {
        aframepointgeometry: {},
    },
    mappings: {
        points: "aframepointgeometry.points",
        color: "aframepointgeometry.color",
        size: "aframepointgeometry.size",
    },
});

AFRAME.registerComponent("aframepointgeometry", {
    schema: {
        points: { type: "string", default: "[]" },
        color: { type: "string", default: "[]" },
        size: { type: "number", default: 0.1 },
    },
    init: function () {
        this.obj = this.el;
        this.model = this.el.object3D;
        const geometry = new THREE.BufferGeometry();

        const positions = JSON.parse(this.data.points);
        const colorData = JSON.parse(this.data.color)
        const colors = [];


        for (let i = 0; i < colorData.length; i++) {
            const color = new THREE.Color(colorData[i]);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        geometry.computeBoundingSphere();

        const material = new THREE.PointsMaterial({ size: this.data.size, vertexColors: true });

        const points = new THREE.Points(geometry, material);
        this.model.add(points);
    },
});
