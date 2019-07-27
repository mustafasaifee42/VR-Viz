import AFRAME from 'aframe';

AFRAME.registerComponent("click-rotation", {
  schema: {
    enabled: {type: 'boolean', default: true},
    speed: {type: 'number', default: 1}
  },

  init: function() {
    this.obj = this.el;
    this.ifMouseDown = false;
    this.x_cord = 0;
    this.y_cord = 0;
    document.addEventListener('mousedown',(event) => {
      if(this.data.enabled) {
        this.x_cord = event.clientX;
        this.y_cord = event.clientY;
      }
    });
    this.el.addEventListener("mousedown", (event) => {
      if(this.data.enabled) {      
        this.ifMouseDown = true;
        document.getElementById('head').setAttribute('look-controls','enabled: false')
      }
    });
    document.addEventListener('mouseup',(event) => {
      if(this.data.enabled) {
        this.ifMouseDown = false;
        document.getElementById('head').setAttribute('look-controls','enabled: true')
      }
    });
    document.addEventListener('mousemove',(event) => {
      if(this.ifMouseDown && this.data.enabled)
      {
        var temp_x = event.clientX-this.x_cord;
        var temp_y = event.clientY-this.y_cord;
        if(Math.abs(temp_y)<Math.abs(temp_x))
        {
          this.el.object3D.rotateY(temp_x*this.data.speed/50);
        }
        else
        {
          this.el.object3D.rotateX(temp_y*this.data.speed/50);
        }
        this.x_cord = event.clientX;
        this.y_cord = event.clientY;
      }
    });
  }
});