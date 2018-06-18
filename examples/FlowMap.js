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
          }
        }
        graph={
          [
            {
              'type': 'FlowMap',
              'data': {
                'dataFile': "data/flowMap.csv",
                'fileType': 'csv',
                'fieldDesc': [['source_latitude', 'number'], ['source_longitude', 'number'], ['target_latitude', 'number'], ['target_longitude', 'number'], ['value', 'number']]
              },
              'style': {
                'origin': [0, 0, 0],
              },
              'mark': {
                'mapScale': 20,
                'mapOrigin': [5, 5],
                'rotation': '-90 0 0',
                'map': {
                  'data': mapData,
                  'projection': 'Mercator',
                  'shapeIdentifier': 'id',
                  'style': {
                    'extrusion': {
                      'value': 0.000001,
                    },
                    'fill': {
                      'color': 'red',
                      'opacity': 0,
                    },
                    'stroke': {
                      'width': 1,
                      'color': 'black',
                    },
                  },
                },
                'flowlines': {
                  'style': {
                    'opacity': {
                      'value': 0.4,
                    },
                    'stroke': {
                      'color': 'red',
                    },
                  },
                  'height': {
                    'field': 'value',
                    'scaleFactor': 1,
                  }
                },
                'nodes': {
                  'source': {
                    'type': 'sphere',
                    'style': {
                      'radius': {
                        'value': 0.1,
                      },
                      'fill': {
                        'color': 'blue',
                        'opacity': 1,
                      },
                    }
                  },
                  'target': {
                    'type': 'sphere',
                    'style': {
                      'radius': {
                        'value': 0.1,
                      },
                      'fill': {
                        'color': 'green',
                        'opacity': 1,
                      },
                    }
                  }
                },
              },
            }
          ]
        }
      />
    );
  }
}

export default App;

