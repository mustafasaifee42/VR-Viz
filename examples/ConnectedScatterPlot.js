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
              'type': 'ConnectedScatterPlot',
              'data': {
                'dataFile': "data/ConnectedScatterPlot.csv",
                'fileType': 'csv',
                'fieldDesc': [['Year', 'text'], ['Cars', 'number'], ['Trucks', 'number'], ['Bikes', 'number']]
              },
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
                'points': {
                  'type': 'sphere',
                  'style': {
                    'radius': {
                      'scale': false,
                      'value': 0.05,
                    },
                    'opacity': 1,
                    'fill': {
                      'scale': false,
                      'color': 'red',
                    },
                  },
                },
                'line': {
                  'style': {
                    'opacity': 1,
                    'stroke': {
                      'scale': false,
                      'color': 'black',
                    },
                  },
                },
                'label': {
                  'field': 'Year',
                  'style': {
                    'color': 'black',
                    'size': 2,
                  }
                }
              },
              'x': {
                'type': 'linear',
                'field': 'Cars',
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
                'type': 'linear',
                'field': 'Trucks',
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
                'type': 'linear',
                'field': 'Bikes',
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

