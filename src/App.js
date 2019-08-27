import React, { Component } from 'react';
import './App.css';
import VRViz from './Component/Visualization.js'
import mapData from './mapData/mapData.json'
import sfMapData from './mapData/sfMapData.json'

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
              'position': '0 0 0',
              'rotation': '0 0 0',
            },
          }
        }
        graph={
          [
            {
              'type': 'MapContourLines',
              'style': {
                'origin': [0, 0, 0],
              },
              'data': {
                'dataFile': "data/mapContourLines.csv",
                'fileType': 'csv',
                'fieldDesc': [['geojson', 'jsonObject'], ['objectid', 'number'], ['isoline_ty', 'text'], ['shape_len', 'text'], ['elevation', 'number']]
              },
              'style': {
                'origin': [0, 0, 0],
              },
              'mark': {
                'mapScale': 2500,
                'mapOrigin': [4978.205, 1862.288],
                'rotation': '-90 0 0',
                'map': {
                  'data': sfMapData,
                  'projection': 'Mercator',
                  'shapeIdentifier': 'id',
                  'shapeKey': 'neighbourhood',
                  'style': {
                    'extrusion': {
                      'value': 0.0000001,
                    },
                    'fill': {
                      'opacity': 1,
                      'color': 'red',
                    },
                    'stroke': {
                      'width': 1,
                      'color': 'black',
                    },
                  },
                },
                'isoLines': {
                  'elevation': {
                    'field': 'elevation',
                    'value': [0, 2],
                  },
                  'style': {
                    'stroke': {
                      'width': 1,
                      'scaleType': 'linear',
                      'field': 'elevation',
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

