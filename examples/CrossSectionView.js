import React, { Component } from 'react';
import './App.css';
import VRViz from './Component/Visualization.js'

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
              'position': '0 0 10',
              'rotation': '0 0 0',
            },
          }
        }
        graph={
          [
            {
              'type': 'CrossSectionView',
              'style': {
                'position': [0, 0, 0],
                'scale':[1,1,1],
              },
              'material':{
                'type':'phong',
                'fill': {
                  'opacity': 0.4,
                  'color': '#ff0000',
                  'shininess':30,
                  'emissive':'#000000',
                  'specular':'#ffffff',
                },
                'stroke': {
                  'width': 1,
                  'color': '#ffff00',
                  'edgeThresholdAngle':50
                },
                'emphasisMaterial':{
                  'opacity': 0.8,
                  'color': '#ffff00',
                  'meshes':['Adam','Eyelid'],
                },
                'highlightOnClick':{
                  'opacity': 0.8,
                  'color': '#ff0000',
                }
              },
              'object':'data/adamHead/adamHead.gltf'
            }
          ]
        }
      />
    );
  }
}

export default App;