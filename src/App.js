import React, { Component } from 'react';
import './App.css';
import VRViz from './Component/Visualization.js'

class App extends Component {
  render() {
    return (
      <VRViz
        scene={
          {
            'sky': {
              'style': {
                'color': '#333',
                'texture': false,
              }
            },
            'lights': [
              {
                'type': 'directional',
                'color': '#fff',
                'position': '0 1 1',
                'intensity': 1,
                'decay': 1,
              },
              {
                'type': 'ambient',
                'color': '#fff',
                'intensity': 1,
                'decay': 1,
              }
            ],
            'camera': {
              'position': '0 0 0',
              'rotation': '0 0 0',
            },
            'parentDiv':{
              'class':'graph',
              'height':1000,
              'width':1000
            }
          }
        }
        graph={
          [
            {
              'type': 'BarGraph',
              'data': {
                'dataFile': 'data.csv',
                'fileType': 'csv',
                'fieldDesc': [['x', 'text'], ['z', 'text'], ['height', 'number']]
              },
              'style': {
                'origin': [0, 0, 0],
                'dimensions': {
                  'width': 20,
                  'height': 5,
                  'depth': 10,
                },
                'pivot': '10 0 5',
              },
              'animateRotation':{
                'initialAngles': [0,0,0],
                'finalAngles': [0,360,0],
                'duration':15000,
              },
              'mark': {
                'type': 'box',
                'position': {
                  'x': {
                    'scaleType': 'ordinal',
                    'field': 'x',
                  },
                  'z': {
                    'scaleType': 'ordinal',
                    'field': 'z',
                  }
                },
                'style': {
                  'padding': {
                    'x': 0.1,
                    'z': 0.1,
                  },
                  'height': {
                    'scaleType': 'linear',
                    'startFromZero': true,
                    'field': 'height',
                  },
                  'fill': {
                    'opacity': 0.8,
                    'scaleType': 'linear',
                    'field': 'height',
                    'color': ['#b71c1c', '#2196f3'],
                  },
                },
              },
              'axis': {
                'x-axis': {
                  'orient': 'back-bottom',
                  'title': {
                    'value': '',
                    'fontSize': 3,
                    'color': 'white',
                    'opacity': 0.7,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.01,
                    'color': 'white',
                    'opacity': 0.7,
                    'fontSize': 3,
                  },
                  'grid': {
                    'color': 'white',
                    'opacity': 0.7,
                  }
                },
                'y-axis': {
                  'orient': 'back-left',
                  'title': {
                    'value': '',
                    'fontSize': 3,
                    'color': 'white',
                    'opacity': 0.7,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.01,
                    'color': 'white',
                    'opacity': 0.7,
                    'fontSize': 3,
                  },
                  'grid': {
                    'color': 'white',
                    'opacity': 0.7,
                  }
                },
                'z-axis': {
                  'orient': 'bottom-left',
                  'title': {
                    'value': '',
                    'fontSize': 3,
                    'color': 'white',
                    'opacity': 0.7,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.01,
                    'color': 'white',
                    'opacity': 0.7,
                    'fontSize': 3,
                  },
                  'grid': {
                    'color': 'white',
                    'opacity': 0.7,
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