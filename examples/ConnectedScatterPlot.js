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
                'depth': 100,
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
              },
              'mark': {
                'position': {
                  'x': {
                    'scaleType': 'linear',
                    'field': 'Cars',
                  },
                  'y': {
                    'scaleType': 'linear',
                    'field': 'Trucks',
                  },
                  'z': {
                    'scaleType': 'linear',
                    'field': 'Bikes',
                  }
                },
                'points': {
                  'type': 'sphere',
                  'style': {
                    'radius': {
                      'value': 0.05,
                    },
                    'fill': {
                      'opacity': 1,
                      'color': 'red',
                    },
                  },
                },
                'line': {
                  'style': {
                    'stroke': {
                      'color': 'black',
                      'opacity': 1,
                    },
                  },
                },
                'label': {
                  'field': 'Year',
                  'style': {
                    'color': 'black',
                    'fontSize': 2,
                    'opacity': 1,
                  },
                }
              },
              'axis': {
                'axis-box': {
                  'color': 'black',
                },
                'x-axis': {
                  'orient': 'bottom-back',
                  'title': {
                    'text': '',
                    'fontSize': 10,
                    'color': 'black',
                    'opacity': 1,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.1,
                    'color': 'black',
                    'opacity': 1,
                    'fontSize': 10,
                  },
                  'grid': {
                    'color': 'black',
                    'opacity': 1,
                  }
                },
                'y-axis': {
                  'orient': 'bottom-back',
                  'title': {
                    'text': '',
                    'fontSize': 10,
                    'color': 'black',
                    'opacity': 1,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.1,
                    'color': 'black',
                    'opacity': 1,
                    'fontSize': 10,
                  },
                  'grid': {
                    'color': 'black',
                    'opacity': 1,
                  }
                },
                'z-axis': {
                  'orient': 'bottom-back',
                  'title': {
                    'text': '',
                    'fontSize': 10,
                    'color': 'black',
                    'opacity': 1,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.1,
                    'color': 'black',
                    'opacity': 1,
                    'fontSize': 10,
                  },
                  'grid': {
                    'color': 'black',
                    'opacity': 1,
                  }
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

