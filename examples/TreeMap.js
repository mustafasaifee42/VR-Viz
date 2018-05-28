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
              'type': 'TreeMap',
              'data': {
                'dataFile': "data/TreeMap.json",
                'fileType': 'json',
              },
              'style': {
                'origin': [0, 0, 0],
                'width': 50,
                'length': 50,
              },
              'mark': {
                'squares': {
                  'style': {
                    'paddingInner': 0.5,
                    'paddingOuter': 0.1,
                    'height': {
                      'field': 'size',
                      'range': [1, 5],
                    },
                    'fill': {
                      'color': ['red', 'blue', 'green', 'yellow', 'cyan', 'magenta'],
                      'opacity': 1,
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

