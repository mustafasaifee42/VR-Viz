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
              'type': 'BarGraph',
              'data': {
                'dataFile': "data/data1.csv",
                'fileType': 'csv',
                'fieldDesc': [['x', 'text'], ['z', 'text'], ['height', 'number']]
              },
              'style': {
                'origin': [0, 0, 0],
                'rotation': '0 0 0',
                'dimensions': {
                  'width': 20,
                  'height': 5,
                  'depth': 10,
                },
              },
              'mark': {
                'type': 'cone',
                'position': {
                  'x': {
                    'scaleType': 'ordinal',
                    'field': 'x',
                  },
                  'z': {
                    'scaleType': 'ordinal',
                    'field': 'z',
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
                    'field': 'height',
                  },
                  'fill': {
                    'opacity': 0.8,
                    'scaleType': 'linear',
                    'field': 'height',
                    'color': ['#DB4437', '#0f9d58'],
                  },
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
            },
            {
              'type': 'SurfacePlot',
              'style': {
                'origin': [0, 6, 0],
                'dimensions': {
                  'width': 20,
                  'height': 5,
                  'depth': 10,
                },
              },
              'mark': {
                'type': 'plane',
                'position': {
                  'x': {
                    'scaleType': 'linear',
                    'domain': [0, 2 * Math.PI],
                    'steps': 50,
                  },
                  'y': {
                    'scaleType': 'linear',
                    'function': (x, z) => x * Math.sin(x) - z * Math.cos(z),
                  },
                  'z': {
                    'scaleType': 'linear',
                    'domain': [0, 2 * Math.PI],
                    'steps': 50,
                  }
                },
                'style': {
                  'fill': {
                    'scaleType': 'linear',
                    'function': (x, z) => x * z,
                    'color': ['#DB4437', '#0f9d58'],
                    'opacity': 1,
                  },
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
            },
            {
              'type': 'ScatterPlot',
              'style': {
                'origin': [21, 0, 0],
                'dimensions': {
                  'width': 20,
                  'height': 11,
                  'depth': 10,
                },
              },
              'data': {
                'dataFile': "data/scatterPlot.csv",
                'fileType': 'csv',
                'fieldDesc': [['sepal_length', 'number'], ['sepal_width', 'number'], ['petal_length', 'number'], ['petal_width', 'number'], ['species', 'text']]
              },
              'mark': {
                'position': {
                  'x': {
                    'scaleType': 'linear',
                    'field': 'sepal_length',
                  },
                  'y': {
                    'scaleType': 'linear',
                    'field': 'sepal_width',
                  },
                  'z': {
                    'scaleType': 'linear',
                    'field': 'petal_length',
                  }
                },
                'type': 'sphere',
                'style': {
                  'radius': {
                    'scaleType': 'linear',
                    'field': 'petal_width',
                    'startFromZero': true,
                    'value': [0, 0.2],
                  },
                  'fill': {
                    'scaleType': 'ordinal',
                    'opacity': 0.4,
                    'field': 'species',
                    'domain': ['setosa', 'versicolor', 'virginica'],
                  },
                },
                'droplines': {
                  'xz': true,
                  'yz': false,
                  'xy': false,
                  'style': {
                    'fill': {
                      'scaleType': 'ordinal',
                      'field': 'species',
                      'opacity': 0.4,
                      'domain': ['setosa', 'versicolor', 'virginica'],
                    },
                  }
                },
                'projections': {
                  'xz': false,
                  'yz': true,
                  'xy': true,
                  'style': {
                    'fill': {
                      'scaleType': 'ordinal',
                      'field': 'species',
                      'opacity': 0.4,
                      'domain': ['setosa', 'versicolor', 'virginica'],
                    },
                    'radius': {
                      'scaleType': 'linear',
                      'field': 'petal_width',
                      'value': [0, 0.2],
                    },
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

