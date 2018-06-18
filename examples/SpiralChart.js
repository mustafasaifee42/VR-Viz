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
              'type': 'SpiralChart',
              'data': {
                'dataFile': "data/SpiralPlot.csv",
                'fileType': 'csv',
                'fieldDesc': [['Year', 'date', 'YYYY'], ['GDP1', 'number'], ['GDP2', 'number'], ['GDP3', 'number'], ['GDP4', 'number'], ['GDP5', 'number']]
              },
              'style': {
                'origin': [0, 0, 0],
                'width': 5,
                'height': 10,
              },
              'mark': {
                'vertices': [
                  {
                    'title': 'GDP1',
                    'scaleType': 'linear',
                    'domain': [0, 5],
                  },
                  {
                    'title': 'GDP2',
                    'scaleType': 'linear',
                    'domain': [0, 5],
                  },
                  {
                    'title': 'GDP3',
                    'scaleType': 'linear',
                    'domain': [0, 5],
                  },
                  {
                    'title': 'GDP4',
                    'scaleType': 'linear',
                    'domain': [0, 5],
                  },
                  {
                    'scaleType': 'linear',
                    'title': 'GDP5',
                    'domain': [0, 5],
                  }
                ],
                'style': {
                  'fill': {
                    'opacity': 0.6,
                    'color': '#2196F3',
                  },
                  'stroke': {
                    'width': 1,
                    'color': '#fff',
                  },
                },
              },
              'axis': {
                'fontSize': 10,
                'color': 'black',
                'opacity': 1,
                'ticks': {
                  'noOfTicks': 10,
                  'size': 0.1,
                  'color': 'black',
                  'opacity': 1,
                  'fontSize': 10,
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

