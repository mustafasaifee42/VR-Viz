# VR-Viz

![VR-Viz](/imgs/vr-viz.png)

A-Frame based React component for data visualization in VR and AR.

VR-Viz provides a higher-level react components for data visualization in webVR. VR-Viz is a collection of reusable visualization React components. VR-Viz combines A-Frame with React (for DOM manipulation) and D3 (for data visualizations) to generate visualization in VR. 

### Catalogue of different 3D Visualizations
To see a catalogue of different 3D visualizations [click here](https://vr-3d-viz.herokuapp.com/).

### Goal
The goal is to create a library of reusable React components that can be used to make reusable charts, visualizations, or dashboards in VR or custom visualization or data stories in VR. 

### How?
Under the hood, VR-Viz uses D3 for the data manipulation and generating layouts for certain visualization types and React for DOM manipulation and to add A-Frame entities and geometry to the 3D scene.

### Supported Visualization
* [3D Bar Graph](/ReadMe/BarGraph.md)
* [3D Stacked Bar Graph](/ReadMe/StackedBarGraph.md)
* [3D Scatter Plot / 3D Bubble Chat](/ReadMe/ScatterPlot.md)
* [3D Connected Scatter Plot](/ReadMe/ConnectedScatterPlot.md)
* [3D Contour Plot](/ReadMe/ContourPlot.md)
* [3D Parametric Curve Plot](/ReadMe/ParametricCurvePlot.md)
* [3D Surface Plot](/ReadMe/SurfacePlot.md)
* [3D Parametric Surface Plot](/ReadMe/ParametricSurfacePlot.md)
* [3D Force Directed Graph](/ReadMe/ForceDirectedGraph.md)
* [3D Prism Map](/ReadMe/PrismMap.md)
* [3D Map Bar Graph](/ReadMe/MapBarChart.md)
* [3D Map Stacked Bar Graph](/ReadMe/MapStackedBarChart.md)
* [3D Flow Map](/ReadMe/FlowMap.md)
* [3D Contour Map](/ReadMe/ContourMap.md)
* [3D Point Cloud](/ReadMe/PointCloud.md)
* [3D TreeMap](/ReadMe/TreeMap.md)
* [Waterfall Plot](/ReadMe/WaterFallPlot.md)
* [3D Mesh Plot](/ReadMe/MeshPlot.md)
* [3D Time Series](/ReadMe/TimeSeries.md)

###### To-Do
* ~~3D TreeMap~~
* ~~Waterfall Plot~~
* ~~3D Parametric Curve Plot~~
* ~~3D Parametric Surface Plot~~
* ~~3D Mesh Plot~~
* ~~3D Map Stacked Bar Graph~~
* ~~3D Rectangle Chart~~
* ~~3D Time Series~~
* Interactivity
* Animation

### Start using VR-Viz 
#### Setting Up the Visualization Scene
Successful setup of a visualization scene requires 2 steps:
1. Setting the 3D environment
2. Setting up the graph 

##### Setting the 3D environment
The environment in VR is composed of four main elements:
* Skybox or sky
* Floor or ground (not mandatory)
* Camera and camera position
* Lights

Scene is setup in the `scene` parameter of the `visualization` component. To learn the parameters required to setup a scene [click here](/ReadMe/Scene.md).

##### Setting up the graph 
Once the scene is created, one or multiple graphs can be placed in that scene. Graphs are defined in the `graph` parameter of the `visualization` component. All the graphs components that can be used and the paramteres required to plot them can be [seen here](/ReadMe).

Example of the visualization component:
```
<Visualization
  scene = {
    {
      'sky': {
        'style': {
          'color': '#ccc',
          'texture':false,
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
          'width': 10,
          'height': 10,
        }
      }
    }
  }
  graph={
    [
      {
        'type': 'ContourMap',
        'data': {
          'dataFile': "data/contourMapData.csv",
          'fileType': 'text',
        },
        'style': {
          'origin': [0, 0, 0],
        },
        'mark': {
          'style': {
            'opacity': 0.4,
            'color': {
              'scale': true,
              'fill': ['green', 'blue'],
            },
            'scale':{
              'ground':0.1,
              'height':0.1,
            }
          },
        },
        'heightThreshold':100,
      }
    ]
  }
/>
```

As can be seen in the example above the `graph` parameter is an array and multiple different kind of graph objects can be used in th same scene by changing the position.

#### Installation

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

This project uses yarn. Install it as described here [https://yarnpkg.com/lang/en/](https://yarnpkg.com/lang/en/) if you haven't already.

To install this project, simply clone the repo and run yarn

#### Local Development
In the project directory, you can run:
```
yarn start
```
Runs the app in the development mode.

### Known Issues
* Grid in the axes doesnt work right now
* Titles of the axes doesnt work right now
