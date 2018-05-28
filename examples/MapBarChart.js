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
              'type': 'MapBarChart',
              'data': {
                'dataFile': "data/mapBarChart.csv",
                'fileType': 'csv',
                'fieldDesc': [['latitude', 'number'], ['longitude', 'number'], ['value', 'number']]
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
                      'value': 0.0000001,
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
                'bars': {
                  'type': 'box',
                  'style': {
                    'depth': 0.2,
                    'width': 0.2,
                    'height': {
                      'scale': true,
                      'scaleType': 'linear',
                      'field': 'value',
                      'value': [0, 5],
                    },
                    'fill': {
                      'scale': true,
                      'scaleType': 'linear',
                      'opacity': 0.9,
                      'field': 'value',
                      'color': ['green', 'blue'],
                    },
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

