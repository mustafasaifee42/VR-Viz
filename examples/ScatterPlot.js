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
              'type': 'ScatterPlot',
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
                'dataFile': "data/scatterPlot.csv",
                'fileType': 'csv',
                'fieldDesc': [['sepal_length', 'number'], ['sepal_width', 'number'], ['petal_length', 'number'], ['petal_width', 'number'], ['species', 'text']]
              },
              'mark': {
                'points':{
                  'type': 'sphere',
                  'style': {
                    'opacity': 0.4,
                    'radius':{
                      'scale': true,
                      'scaleType': 'linear',
                      'field': 'petal_width',
                      'value': [0, 0.2],
                    },
                    'color': {
                      'scale': true,
                      'scaleType': 'ordinal',
                      'field': 'species',
                      'fill': ['red', 'green', 'blue'],
                      'domain': ['setosa', 'versicolor', 'virginica'],
                    },
                  }
                },
                'droplines':{
                  'type': 'line',
                  'xz':true,
                  'yz':false,
                  'xy':false,
                  'style': {
                    'opacity': 0.4,
                    'color': {
                      'scale': true,
                      'scaleType': 'ordinal',
                      'field': 'species',
                      'fill': ['red', 'green', 'blue'],
                      'domain': ['setosa', 'versicolor', 'virginica'],
                    },
                  }
                },
                'projections':{
                  'type': 'circle',
                  'xz':false,
                  'yz':true,
                  'xy':true,
                  'style': {
                    'opacity': 0.4,
                    'color': {
                      'scale': true,
                      'scaleType': 'ordinal',
                      'field': 'species',
                      'fill': ['red', 'green', 'blue'],
                      'domain': ['setosa', 'versicolor', 'virginica'],
                    },
                    'radius':{
                      'scale': true,
                      'scaleType': 'linear',
                      'field': 'petal_width',
                      'value': [0, 0.2],
                    },
                  }
                }
              },
              'x': {
                'type': 'linear',
                'field': 'sepal_length',
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
                'field': 'sepal_width',
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
                'type': 'linear',
                'field': 'petal_length',
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

