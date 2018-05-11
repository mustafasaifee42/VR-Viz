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
              'type': 'PrismMap',
              'data': {
                'dataFile': "data/prismMapData.csv",
                'fileType': 'csv',
                'fieldDesc': [['id', 'text'], ['value', 'number'], ['colorValue', 'number']]
              },
              'style': {
                'origin': [0, 0, 0],
              },
              'mark': {
                'map':{
                  'data': mapData,
                  'projection': 'Mercator',
                  'shapeIdentifier':'id',
                  'style': {
                    'scale': 20,
                    'position': [5, 5],
                    'rotation': '-45 0 0',
                    'opacity': 0.9,
                    'extrusion':{
                      'scale':true,
                      'scaleType': 'linear',
                      'field': 'value',
                      'value':[0, 5],
                    },
                    'color': {
                      'scale':true,
                      'scaleType': 'ordinal',
                      'field': 'colorValue',
                      'fill': ['green', 'blue', 'red', 'yellow', 'magenta', 'cyan'],
                    },
                  },
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

