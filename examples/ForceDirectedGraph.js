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
              'type': 'ForceDirectedGraph',
              'data': {
                'dataFile': "data/ForceDirectedGraph.json",
                'fileType':'json',
              },
              'style': {
                'origin': [0, 0, 0],
                'scale': 0.1,
              },
              'mark': {
                'nodes':{
                  'type':'sphere',
                  'style': {
                    'radius': {
                      'scale': false,
                      'value': 0.1,
                    },
                    'opacity': 1,
                    'color': {
                      'scale': true,
                      'scaleType': 'ordinal',
                      'field': 'group',
                      'fill': ['green', 'blue', 'red', 'yellow', 'tomato', 'olive', 'magenta', 'cyan', 'gray', 'maroon'],
                      'domain': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    },
                  },
                },
                'links':{
                  'type': 'line',
                  'style': {
                    'opacity':{
                      'scale': false,
                      'value': 0.3,
                    },
                    'color': {
                      'scale': true,
                      'scaleType': 'ordinal',
                      'field': 'value',
                      'fill': ['green', 'blue', 'red', 'yellow', 'tomato', 'olive', 'magenta', 'cyan', 'gray', 'maroon'],
                      'domain': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    },
                  },
                },
                'labels':{
                  'field': 'id',
                  'style': {
                    'color': 'black',
                    'opacity': 1,
                    'size': 1,
                    'padding': 0.1,
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

