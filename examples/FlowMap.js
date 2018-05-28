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
                'map': {
                  'data': mapData,
                  'projection': 'Mercator',
                  'shapeIdentifier': 'id',
                  'style': {
                    'scale': 20,
                    'position': [5, 5],
                    'rotation': '-90 0 0',
                    'extrusion': {
                      'value': 0.000001,
                    },
                    'fill': {
                      'color': 'red',
                      'opacity': 1,
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
                      'scale': false,
                      'value': 0.4,
                    },
                    'color': {
                      'scale': false,
                      'fill': 'red',
                    },
                  },
                  'height': {
                    'scale': true,
                    'field': 'value',
                    'scale': 1,
                  }
                }
              },
            }
          ]
        }
      />
    );
  }
}

export default App;

