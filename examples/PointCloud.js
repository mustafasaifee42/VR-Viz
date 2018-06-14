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
              'type': 'PointCloud',
              'data': {
                'dataFile': "data/PointCloud.ply",
                'fileType': 'ply',
              },
              'style': {
                'origin': [0, 0, 0],
                'objectScale': 0.01,
              },
              'mark': {
                'type': 'box',
                'style': {
                  'radius': 0.1,
                  'fill': {
                    'opacity': 0.4,
                    'color': 'green',
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

