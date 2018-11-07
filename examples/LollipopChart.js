import React, { Component } from 'react';
import './App.css';
import Visualization from './Component/Visualization.js'
import mapData from './mapData/mapData.json'

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
                'decay': 1,
              },
              {
                'type': 'ambient',
                'color': '#fff',
                'intensity': 1,
                'decay': 1,
              }
            ],
            'camera': {
              'position': '10 0 20',
              'rotation': '0 0 0',
            },
          }
        }
        graph={
          [
            {
              'type': 'LollipopChart',
              'data': {
                'dataFile': 'data/population.csv',
                'fileType': 'csv',
                'fieldDesc': [['State', 'text'], ['AgeGroup', 'text'], ['Population', 'number']]
              },
              'style': {
                'origin': [0, 0, 0],
                'dimensions': {
                  'width': 10,
                  'height': 2,
                  'depth': 2,
                },
              },
              'mark': {
                'type': 'box',
                'position': {
                  'x': {
                    'scaleType': 'ordinal',
                    'field': 'State',
                  },
                  'y': {
                    'scaleType': 'linear',
                    'startFromZero': true,
                    'field': 'Population',
                  },
                  'z': {
                    'scaleType': 'ordinal',
                    'field': 'AgeGroup',
                  }
                },
                'style': {
                  'padding': {
                    'x': 0.1,
                    'z': 0.1,
                  },
                  'radius': {
                    'value':0.1,
                  },
                  'fill': {
                    'opacity': 0.8,
                    'scaleType': 'linear',
                    'field': 'Population',
                    'color': ['#b71c1c', '#2196f3'],
                  },
                },
                'droplines': {
                  'style': {
                    'radius':0.01,
                    'fill': {
                      'opacity': 0.8,
                      'scaleType': 'linear',
                      'field': 'Population',
                      'color': ['#b71c1c', '#2196f3'],
                    },
                  }
                },
                'mouseOver': {
                  'focusedObject': {
                    'opacity': 1,
                  },
                  'nonFocusedObject': {
                    'opacity': 0.2,
                  },
                  'label': {
                    'value': (d) => `State:${d.State}\nAge Group:${d.AgeGroup}\nPopulation:${d.Population}`,
                    'align': 'center',
                    'width': 0.5,
                    'height': 0.5,
                    'wrapCount': 30,
                    'lineHeight': 50,
                    'backgroundColor': '#fff',
                    'backgroundOpacity': 0.9,
                    'fontColor': '#333',
                  }
                }
              },
              'axis': {
                'x-axis': {
                  'orient': 'back-bottom',
                  'title': {
                    'text': '',
                    'fontSize': 10,
                    'color': 'white',
                    'opacity': 0.7,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.1,
                    'color': 'white',
                    'opacity': 0.7,
                    'fontSize': 1,
                  },
                  'grid': {
                    'color': 'white',
                    'opacity': 0.7,
                  }
                },
                'y-axis': {
                  'orient': 'back-left',
                  'title': {
                    'text': '',
                    'fontSize': 10,
                    'color': 'white',
                    'opacity': 0.7,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.1,
                    'color': 'white',
                    'opacity': 0.7,
                    'fontSize': 1,
                  },
                  'grid': {
                    'color': 'white',
                    'opacity': 0.7,
                  }
                },
                'z-axis': {
                  'orient': 'bottom-left',
                  'title': {
                    'text': '',
                    'fontSize': 10,
                    'color': 'white',
                    'opacity': 0.7,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.1,
                    'color': 'white',
                    'opacity': 0.7,
                    'fontSize': 1,
                  },
                  'grid': {
                    'color': 'white',
                    'opacity': 0.7,
                  }
                }
              }
            }
          ]
        }
      />
    );
  }
}

export default App;

