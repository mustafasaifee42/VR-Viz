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
                'texture':false,
                'width': 100,
                'height': 100,
              }
            }
          }
        }
        graph={
          [
            {
              'type': 'StackedBarGraph',
              'style': {
                'origin': [0, 0, 0],
                'dimensions': {
                  'width': 10,
                  'height': 10,
                  'depth': 10,
                },
                'axis-box': true,
                'axis-box-color': 'black',
              },
              'data': {
                'dataFile': "data/stackedBarChart.csv",
                'fileType': 'csv',
                'fieldDesc': [['Cars', 'number'], ['Trucks', 'number'], ['Bikes', 'number'], ['Countries', 'text'], ['Quarters', 'text']]
              },
              'mark': {
                'bars':{
                  'type': 'box',
                  'style': {
                    'depth': 0.2,
                    'width': 0.2,
                    'opacity': 0.4,
                    'color': {
                      'scaleType': 'ordinal',
                      'fill': ['green', 'blue', 'red'],
                      'field': ['Cars', 'Trucks', 'Bikes'],
                    },
                  }
                }
              },
              'x': {
                'type': 'ordinal',
                'field': 'Quarters',
                'axis': {
                  'axis': true,
                  'orient': 'bottom-back',
                  'title': {
                    'text': '',
                    'font-size': 10,
                    'color': 'black',
                    'opacity': 1,
                  },
                  'ticks': {
                    'no-of-ticks': 10,
                    'tick-size': 0.1,
                    'tick-color': 'black',
                    'tick-opacity': 1,
                    'grid': true,
                    'grid-color': 'black',
                    'grid-opacity': 1,
                    'font': 'Arial',
                    'font-size': 10,
                  }
                },
              },
              'y': {
                'type': 'linear',
                'field': ['Cars', 'Trucks', 'Bikes'],
                'range': [0, 10],
                'axis': {
                  'axis': true,
                  'orient': 'bottom-back',
                  'title': {
                    'text': '',
                    'font-size': 10,
                    'color': 'black',
                    'opacity': 1,
                  },
                  'ticks': {
                    'no-of-ticks': 10,
                    'tick-size': 0.1,
                    'tick-color': 'black',
                    'tick-opacity': 1,
                    'grid': true,
                    'grid-color': 'black',
                    'grid-opacity': 1,
                    'font-size': 10,
                  }
                },
              },
              'z': {
                'type': 'ordinal',
                'field': 'Countries',
                'axis': {
                  'axis': true,
                  'orient': 'bottom-back',
                  'title': {
                    'text': '',
                    'font-size': 10,
                    'color': 'black',
                    'opacity': 1,
                  },
                  'ticks': {
                    'no-of-ticks': 10,
                    'tick-size': 0.1,
                    'tick-color': 'black',
                    'tick-opacity': 1,
                    'grid': true,
                    'grid-color': 'black',
                    'grid-opacity': 1,
                    'font-size': 10,
                  }
                },
              }
            }
          ]
        }
      />
    );
  }
}

export default App;

