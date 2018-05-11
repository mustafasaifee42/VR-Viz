## SurfacePlot Component

#### React Component
```
<SurfacePlot 
  style = {d.style}
  mark = {d.mark}
  x = {d.x}
  y = {d.y}
  z = {d.z}
/>
```

#### Parameter required in graph variable
```
{
  'type': 'SurfacePlot',
  'style': {
    'origin': [0, 0, 0],
    'dimensions': {
      'width': 10,
      'height': 10,
      'depth': 10,
    },
    'axis-box': true,
    'axis-box-color': 'black',
  },
  'mark': {
    'surface':{
      'type': 'plane',
      'style': {
        'opacity': 0.4,
        'color': {
          'scale':true,
          'function':(x, z) => x * z,
          'fill': ['green', 'blue'],
        }
      }
    }
  },
  'x': {
    'domain': [0, 2 * Math.PI],
    'steps': 50,
    'axis': {
      'axis': true,
      'orient': 'bottom-back',
      'title': {
        'text': '',
        'font-size': 10,
        'color': 'black',
        'opacity': 1,
      },
      'ticks': {
        'no-of-ticks': 10,
        'tick-size': 0.1,
        'tick-color': 'black',
        'tick-opacity': 1,
        'grid': true,
        'grid-color': 'black',
        'grid-opacity': 1,
        'font': 'Arial',
        'font-size': 10,
      }
    },
  },
  'y': {
    'function': (x, z) => x * Math.sin(x) - z * Math.cos(z),
    'range': [0, 10],
    'axis': {
      'axis': true,
      'orient': 'bottom-back',
      'title': {
        'text': '',
        'font-size': 10,
        'color': 'black',
        'opacity': 1,
      },
      'ticks': {
        'no-of-ticks': 10,
        'tick-size': 0.1,
        'tick-color': 'black',
        'tick-opacity': 1,
        'grid': true,
        'grid-color': 'black',
        'grid-opacity': 1,
        'font-size': 10,
      }
    },
  },
  'z': {
    'domain': [0, 2 * Math.PI],
    'steps': 50,
    'axis': {
      'axis': true,
      'orient': 'bottom-back',
      'title': {
        'text': '',
        'font-size': 10,
        'color': 'black',
        'opacity': 1,
      },
      'ticks': {
        'no-of-ticks': 10,
        'tick-size': 0.1,
        'tick-color': 'black',
        'tick-opacity': 1,
        'grid': true,
        'grid-color': 'black',
        'grid-opacity': 1,
        'font-size': 10,
      }
    },
  }
}
```
