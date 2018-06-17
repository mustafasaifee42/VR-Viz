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
              'type': 'TreeMap',
              'data': {
                'dataFile': "data/TreeMap.json",
                'fileType': 'json',
              },
              'style': {
                'origin': [0, 0, 0],
                'dimensions': {
                  'width': 50,
                  'depth': 50,
                  'height': 5,
                }
              },
              'mark': {
                'type': 'box',
                'style': {
                  'paddingInner': 0.5,
                  'paddingOuter': 0.1,
                  'extrusion': {
                    'field': 'size',
                    'startFromZero': true,
                  },
                  'fill': {
                    'scaleType': 'ordinal',
                    'opacity': 1,
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

