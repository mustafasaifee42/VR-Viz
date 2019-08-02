import React, { Component } from 'react';
import './App.css';
import VRViz from './Component/Visualization.js'
import mapData from './mapData/mapData.json'

class App extends Component {
  render() {
    return (
      <VRViz
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
              'position': '0 5 10',
              'rotation': '0 0 0',
              'nearClipping': 0.5,
              'fov': 80,
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
              'type': 'BarGraph',
              'data': {
                'dataFile': "data/barGraph.csv",
                'fileType': 'csv',
                'fieldDesc': [['Year', 'text'], ['Month', 'text'], ['Tornadoes', 'number'], ['Deaths', 'number']]
              },
              'style': {
                'origin': [0, 0, 0],
                'dimensions': {
                  'width': 10,
                  'height': 10,
                  'depth': 10,
                },
              },
              'mark': {
                'type': 'cone',
                'position': {
                  'x': {
                    'scaleType': 'ordinal',
                    'field': 'Month',
                    'domain': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                  },
                  'z': {
                    'scaleType': 'ordinal',
                    'field': 'Year',
                  }
                },
                'style': {
                  'padding': {
                    'x': 0.1,
                    'z': 0.1,
                  },
                  'height': {
                    'scaleType': 'linear',
                    'startFromZero': true,
                    'field': 'Tornadoes',
                  },
                  'fill': {
                    'opacity': 0.4,
                    'scaleType': 'linear',
                    'field': 'Deaths',
                    'color': ['red', 'green'],
                  },
                },
                'mouseOver': {
                  'focusedObject': {
                    'opacity': 1,
                    'fill': '#333',
                  },
                  'nonFocusedObject': {
                    'opacity': 0,
                  },
                  'label': {
                    'value': (d) => `Year:${d.Year}\nMonth:${d.Month}\nDeaths:${d.Deaths}\nTornadoes:${d.Tornadoes}\n`,
                    'align': 'center',
                    'fontSize': 1,
                    'backgroundColor': '#333',
                    'backgroundOpacity': 1,
                    'fontColor': '#fff',
                  }
                }
              },
              'axis': {
                'axis-box': {
                  'color': 'black',
                },
                'x-axis': {
                  'orient': 'bottom-back',
                  'title': {
                    'text': '',
                    'fontSize': 10,
                    'color': 'black',
                    'opacity': 1,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.1,
                    'color': 'black',
                    'opacity': 1,
                    'fontSize': 10,
                  },
                  'grid': {
                    'color': 'black',
                    'opacity': 1,
                  }
                },
                'y-axis': {
                  'orient': 'bottom-back',
                  'title': {
                    'text': '',
                    'fontSize': 10,
                    'color': 'black',
                    'opacity': 1,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.1,
                    'color': 'black',
                    'opacity': 1,
                    'fontSize': 10,
                  },
                  'grid': {
                    'color': 'black',
                    'opacity': 1,
                  }
                },
                'z-axis': {
                  'orient': 'bottom-back',
                  'title': {
                    'text': '',
                    'fontSize': 10,
                    'color': 'black',
                    'opacity': 1,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.1,
                    'color': 'black',
                    'opacity': 1,
                    'fontSize': 10,
                  },
                  'grid': {
                    'color': 'black',
                    'opacity': 1,
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

