import React, { Component } from 'react';
import './App.css';
import Visualization from './Component/Visualization.js'
import mapData from './mapData/mapData.json'

class App extends Component {
  render() {
    return (
      <Visualization
        scene={
          {
            'sky': {
              'style': {
                'color': '#ccc',
                'texture': false,
              }
            },
            'lights': [
              {
                'type': 'directional',
                'color': '#fff',
                'position': '0 1 1',
                'intensity': 1,
                "decay": 1,
              },
              {
                'type': 'ambient',
                'color': '#fff',
                'intensity': 1,
                "decay": 1,
              }
            ],
            'camera': {
              'position': '0 0 10',
              'rotation': '0 0 0',
            },
            'floor': {
              'style': {
                'color': '#ccc',
                'texture': false,
                'width': 100,
                'height': 100,
              }
            }
          }
        }
        graph={
          [
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
                'surface': {
                  'type': 'plane',
                  'style': {
                    'fill': {
                      'scale': true,
                      'function': (x, z) => x * z,
                      'color': ['green', 'blue'],
                      'opacity': 1,
                    },
                    'stroke': {
                      'width': 1,
                      'color': 'black',
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
          ]
        }
      />
    );
  }
}

export default App;

