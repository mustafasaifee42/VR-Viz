import React, { Component } from 'react';
import './App.css';
import VRViz from './Component/Visualization.js'
import AFRAME from 'aframe';
import data from './barGraph.json'

class App extends Component {
  render() {
    return (
      <a-scene>
      <VRViz
        graph={[
          {
            axis: {
              'axis-box': {
                color: 'white'
              },
              'x-axis': {
                grid: {
                  color: 'white',
                  opacity: 0.3
                },
                orient: 'back-bottom',
                ticks: {
                  color: 'white',
                  fontSize: 3,
                  noOfTicks: 10,
                  opacity: 0.3,
                  size: 0.01
                },
                title: {
                  color: 'white',
                  fontSize: 3,
                  opacity: 0.3,
                  value: ''
                }
              },
              'y-axis': {
                grid: {
                  color: 'white',
                  opacity: 0.3
                },
                orient: 'back-left',
                ticks: {
                  color: 'white',
                  fontSize: 3,
                  noOfTicks: 10,
                  opacity: 0.3,
                  size: 0.01
                },
                title: {
                  color: 'white',
                  fontSize: 3,
                  opacity: 0.3,
                  value: ''
                }
              },
              'z-axis': {
                grid: {
                  color: 'white',
                  opacity: 0.3
                },
                ticks: {
                  color: 'white',
                  fontSize: 3,
                  noOfTicks: 10,
                  opacity: 0.3,
                  size: 0.01
                },
                title: {
                  color: 'white',
                  fontSize: 3,
                  opacity: 0.3,
                  value: ''
                }
              }
            },
            data: {
              dataFile: 'data/scatterPlot.csv',
              fieldDesc: [
                [
                  'sepal_length',
                  'number'
                ],
                [
                  'sepal_width',
                  'number'
                ],
                [
                  'petal_length',
                  'number'
                ],
                [
                  'petal_width',
                  'number'
                ],
                [
                  'species',
                  'text'
                ]
              ],
              fileType: 'csv'
            },
            mark: {
              droplines: {
                style: {
                  fill: {
                    color: [
                      '#db4877',
                      '#0F9D58',
                      '#4285F4'
                    ],
                    domain: [
                      'setosa',
                      'versicolor',
                      'virginica'
                    ],
                    field: 'species',
                    opacity: 0.4,
                    scaleType: 'ordinal'
                  }
                },
                xy: false,
                xz: false,
                yz: false
              },
              mouseOver: {
                focusedObject: {
                  opacity: 1
                },
                label: {
                  align: 'center',
                  backgroundColor: '#fff',
                  backgroundOpacity: 0.9,
                  fontColor: '#333',
                  height: 0.35,
                  lineHeight: 75,
                  value: function value(d){return"Sepal Length:"+d.sepal_length+"\nSepal Width:"+d.sepal_width+"\nPetal Length:"+d.petal_length+"\nPetal Width:"+d.petal_width+"\nSpecies:"+d.species},
                  width: 1,
                  wrapCount: 50
                },
                nonFocusedObject: {
                  opacity: 0.2
                }
              },
              position: {
                x: {
                  field: 'sepal_length',
                  scaleType: 'linear'
                },
                y: {
                  field: 'sepal_width',
                  scaleType: 'linear'
                },
                z: {
                  field: 'petal_length',
                  scaleType: 'linear'
                }
              },
              projections: {
                style: {
                  fill: {
                    color: [
                      'red',
                      'green',
                      'blue'
                    ],
                    domain: [
                      'setosa',
                      'versicolor',
                      'virginica'
                    ],
                    field: 'species',
                    opacity: 0.4,
                    scaleType: 'ordinal'
                  },
                  radius: {
                    field: 'petal_width',
                    scaleType: 'linear',
                    value: [
                      0,
                      0.2
                    ]
                  }
                },
                xy: false,
                xz: false,
                yz: false
              },
              style: {
                fill: {
                  color: [
                    '#db4877',
                    '#0F9D58',
                    '#4285F4'
                  ],
                  domain: [
                    'setosa',
                    'versicolor',
                    'virginica'
                  ],
                  field: 'species',
                  opacity: 0.9,
                  scaleType: 'ordinal'
                },
                radius: {
                  field: 'petal_width',
                  scaleType: 'linear',
                  startFromZero: true,
                  value: [
                    0,
                    0.5
                  ]
                }
              },
              type: 'sphere'
            },
            style: {
              dimensions: {
                depth: 10,
                height: 10,
                width: 10
              },
              origin: [
                0,
                0,
                0
              ]
            },
            type: 'ScatterPlot'
          }
        ]}
      />
      </a-scene>
    );
  }
}

export default App;

