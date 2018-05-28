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
              'type': 'ParametricSurfacePlot',
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
                      'scale': false,
                      'opacity': 0.4,
                      'color': 'red',
                    },
                    'stroke': {
                      'width': 1,
                      'color': 'black',
                    },
                  }
                }
              },
              'x': {
                'function': (u, v) => Math.cos(u) * (3 + Math.cos(v)),
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
                'function': (u, v) => Math.sin(v),
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
                'function': (u, v) => Math.sin(u) * (3 + Math.cos(v)),
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
              'parameter': {
                'parameter1': {
                  'domain': [0, 2 * Math.PI],
                  'steps': 50,
                },
                'parameter2': {
                  'domain': [0, 2 * Math.PI],
                  'steps': 50,
                }
              }
            }
          ]
        }
      />
    );
  }
}

export default App;

