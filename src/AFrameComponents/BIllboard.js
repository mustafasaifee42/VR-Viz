import * as AFRAME from "aframe";
import * as THREE from "three";

AFRAME.registerComponent("billboard", {
  schema: {
    default: true,
  },
  init: function () {
    this.target = new THREE.Vector3();
  },
  tick: function () {
    const camera = this.el.sceneEl.camera;
    const object3D = this.el.object3D;
    if (camera && this.data) {
      // Set the camera world position as the target.
      this.target.setFromMatrixPosition(camera.matrixWorld);
      return object3D.lookAt(this.target);
    }
  },
});
