# VR-Viz [![Sponsored](https://img.shields.io/badge/chilicorn-sponsored-brightgreen.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAMAAADjyg5GAAABqlBMVEUAAAAzmTM3pEn%2FSTGhVSY4ZD43STdOXk5lSGAyhz41iz8xkz2HUCWFFhTFFRUzZDvbIB00Zzoyfj9zlHY0ZzmMfY0ydT0zjj92l3qjeR3dNSkoZp4ykEAzjT8ylUBlgj0yiT0ymECkwKjWqAyjuqcghpUykD%2BUQCKoQyAHb%2BgylkAyl0EynkEzmkA0mUA3mj86oUg7oUo8n0k%2FS%2Bw%2Fo0xBnE5BpU9Br0ZKo1ZLmFZOjEhesGljuzllqW50tH14aS14qm17mX9%2Bx4GAgUCEx02JySqOvpSXvI%2BYvp2orqmpzeGrQh%2Bsr6yssa2ttK6v0bKxMBy01bm4zLu5yry7yb29x77BzMPCxsLEzMXFxsXGx8fI3PLJ08vKysrKy8rL2s3MzczOH8LR0dHW19bX19fZ2dna2trc3Nzd3d3d3t3f39%2FgtZTg4ODi4uLj4%2BPlGxLl5eXm5ubnRzPn5%2Bfo6Ojp6enqfmzq6urr6%2Bvt7e3t7u3uDwvugwbu7u7v6Obv8fDz8%2FP09PT2igP29vb4%2BPj6y376%2Bu%2F7%2Bfv9%2Ff39%2Fv3%2BkAH%2FAwf%2FtwD%2F9wCyh1KfAAAAKXRSTlMABQ4VGykqLjVCTVNgdXuHj5Kaq62vt77ExNPX2%2Bju8vX6%2Bvr7%2FP7%2B%2FiiUMfUAAADTSURBVAjXBcFRTsIwHAfgX%2FtvOyjdYDUsRkFjTIwkPvjiOTyX9%2FAIJt7BF570BopEdHOOstHS%2BX0s439RGwnfuB5gSFOZAgDqjQOBivtGkCc7j%2B2e8XNzefWSu%2BsZUD1QfoTq0y6mZsUSvIkRoGYnHu6Yc63pDCjiSNE2kYLdCUAWVmK4zsxzO%2BQQFxNs5b479NHXopkbWX9U3PAwWAVSY%2FpZf1udQ7rfUpQ1CzurDPpwo16Ff2cMWjuFHX9qCV0Y0Ok4Jvh63IABUNnktl%2B6sgP%2BARIxSrT%2FMhLlAAAAAElFTkSuQmCC)](http://spiceprogram.org/oss-sponsorship) [![npm version](https://badge.fury.io/js/vr-viz.svg)](https://www.npmjs.com/package/vr-viz)

![CoverImg](./imgs/CoverImage.png)

VR-Viz provide a high-level react components to generate 3D visualization in webVR. It combines A-Frame with React (for DOM manipulation) and D3 (for data visualizations) to generate visualization in VR. It provides a JSON syntax for generating visualizations (the concept is inspired from Vega-Lite)

**Interactive examples can be seen and explored [here](https://vr-viz.netlify.com).** _Known issues: Doesnt work in chrome, works in safari, firefox and edge_

**Boilerplate for using VR-Viz can be found [here](https://github.com/mustafasaifee42/vr-viz-boilerplate).**

## If using NPM

Package link: [https://www.npmjs.com/package/vr-viz](https://www.npmjs.com/package/vr-viz)

**Installation**

`npm install --save vr-viz`

**How To Use**

First import this component where you want to use it

`import VRViz from "vr-viz"`

Then just renders it

## Local Development Using this Repo

To run this project using this repo, simply clone the repo and run yarn

```
git clone https://github.com/mustafasaifee42/VR-Viz.git
cd vr-viz
yarn
```

In the project directory, you can run:

```
yarn start
```

Runs the app in the development mode.

## VRViz Component

The react component used to generate visualizations is `VRViz` with 2 props:

- **scene**
- **graph**

**scene** defines the property of the A-Frame scene that will be generated in which the visualization will be placed. This is not a mandatory prop in the component. If the developers feels the need to design the scene before and then place the visualization in the designed scene he/she can do that. This provide flexibility to design a customized scene with textures and objects in it and also let the developers add other A-Frame component (to add interactivity or animation) to scene.

_Known Issues_

- Perfomance issue when trying to drag the graph in computer with a mouse.
- Mouse over effect does not work.

**graph** is the prop where the visualization is defined. Different visualization requires the developer to define different parameter. This is a mandatory prop in the component. The prop must be defined as an array which gives flexibility to add multiple visualizations in the same scene to either design a dashboard in VR (just by changing the position of their origin) or overlap multiple visualization on each other.

## Example of Visualization Component

```
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
      'floor': {
        'style': {
          'color': '#ccc',
          'texture': false,
          'width': 100,
          'depth': 100,
        }
      },
      'parentDiv':{
        'class':'graph',
        'height':1000,
        'width':1000
      },
      'reloadPageOnExitVR':true
    }
  }
  graph={
    [
      {
        'type': 'TreeMap',
        'data': {
          'dataFile': "data/TreeMap.json",
          'fileType': 'json',
        },
        'style': {
          'origin': [0, 0, 0],
          'dimensions': {
            'width': 50,
            'depth': 50,
            'height': 5,
          }
        },
        'mark': {
          'type': box,
          'style': {
            'paddingInner': 0.5,
            'paddingOuter': 0.1,
            'extrusion': {
              'field': 'size',
              'startFromZero': true,
            },
            'fill': {
              'scaleType': 'ordinal',
              'opacity': 1,
            },
          },
        },
      }
    ]
  }
/>
```

### Scene Object

Scene object help the developer to define the characteristics of the scene where the visualization will be placed. As mentioned above the scene object is not mandatory. Different keys in this object help us to define the scene.

**Example**

```
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
  },
  'parentDiv':{
    'class':'graph',
    'height':1000,
    'width':1000
  },
  'reloadPageOnExitVR':true
}
```

6 main features / properties of the scene objects are:

- sky
- lights
- camera
- floor
- 3D-objects _(optional)_
- parentDiv _(optional)_
- reloadPageOnExitVR _(optional)_

#### sky

Sky has property called `style` in which the visual properties of sky is defined.

**Style Properties for Sky**

| Property | Type   | Description                                                                                      |
| -------- | ------ | ------------------------------------------------------------------------------------------------ |
| color    | string | Color of the skybox. **Not Required if `texture` is true.**                                      |
| texture  | bool   | If there is texture present in the skybox or not. **Default value is false.**                    |
| img      | string | Path to the texture / image that is shown on the skybox. **Not required if `texture` is false.** |

#### lights

Light property is defined as array which can have multiple lights. Proposed light system is a combination of an ambient light source and directional light source. Each element of array i.e. light is defined using the properties mentioned below.

**Properties for Light**

| Property  | Type   | Description                                                                                                                                                                                                     |
| --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type      | string | Type of light. **Required. Available values: `ambient`, `directional`, `point`.**                                                                                                                               |
| color     | string | Color of the light. **Required**                                                                                                                                                                                |
| intensity | float  | Intesity of the light. **Required**                                                                                                                                                                             |
| decay     | float  | Decay value of the light. **Required**                                                                                                                                                                          |
| position  | string | Position of light source. **Not required if `type` is ambient. Format is "0 0 0".** Note that for `type` **directional** only the vector matters i.e. position="-100 100 0" and position="-1 1 0" are the same. |

#### camera

**Properties for Camera**

| Property | Type   | Description                                                                                                                                                                   |
| -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| position | string | Position of the camera. **Required. Format is "0 0 0".**                                                                                                                      |
| rotation | string | Rotation of the camera. **Required. Format is "90 0 0".** Note that the values are in degree and the numbers represent ratation along x-axis, y-axis and z-axis respectively. |

#### floor

Floor has property called `style` in which the visual properties of floor is defined.

**Style Properties for Floor**

| Property | Type   | Description                                                                                     |
| -------- | ------ | ----------------------------------------------------------------------------------------------- |
| color    | string | Color of the floor. **Not Required if `texture` is true.**                                      |
| width    | float  | Width of the floor. **Required**                                                                |
| depth    | float  | Depth of the floor. **Required**                                                                |
| texture  | bool   | If there is texture present in the floor or not. **Not Required. Default value is false.**      |
| img      | string | Path to the texture / image that is shown on the floor. **Not Required if `texture` is false.** |
| repeat   | bool   | **Not Required if `texture` is false.**                                                         |

#### 3D-objects

3D-objects property is defined as array which can have multiple 3D objects. Each element of array i.e. 3D object is defined using the properties mentioned below.

**Properties for 3D-objects**

| Property   | Type   | Description                                                                                                                                                                 |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| objectFile | string | Path of the 3D object. **Required**                                                                                                                                         |
| id         | string | ID of the 3D object which is later used to identify this object. _There should not be any space or special character except and must not start with a number_. **Required** |

#### parentDiv _(optional)_

parentDiv defines the class and size of the div in which a-scene is embedded.

**Properties for parentDiv**

| Property | Type   | Description                                                                                                       |
| -------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| class    | string | Defines the class name of the div in which a-scene is embedded. **Default value is aframeBox.**                   |
| height   | int    | Defines the height of the div in which a-scene is embedded. **Default value is height of the window or browser.** |
| width    | int    | Defines the height of the div in which a-scene is embedded. **Default value is width of the window or browser.**  |

#### reloadPageOnExitVR _(optional)_

Defines if the user wants to reload the page when exiting VR mode. Is useful when there are multiple `a-scene` in the same page. **Not Required. Default value: false. Format:''reloadPageOnExitVR':true**

### Graph Object

Graph object help the developer to define the visualization. Although different visualizations requires the developer to define different parameters, there are some features which are same for most or all visualization type. This is a mandatory prop in the component. The prop must be defined as an array which gives flexibility to add multiple visualizations in the same scene to either design a dashboard in VR (just by changing the position of their origin) or overlap multiple visualization on each other.

Main features / properties of the graph objects are:

- type
- data
- style **Not Required**
- mark
- axis **Not Required**
- title **Not Required**
- rotationOnDrag **Not Requred**
- animateRotation **Not Required**

#### type

type is used to define what kind of visualization is needed. The availabe values for type are :

_Charts_

- `BarGraph` for 3D Bar Graph
- `StackedBarGraph` for 3D Stacked Bar Graph
- `LollipopChart` for 3D Lollipop Chart
- `RectangleChart` for 3D Rectangle Chart
- `ScatterPlot` for 3D Scatter Plot / 3D Bubble Chat
- `ConnectedScatterPlot` for 3D Connected Scatter Plot
- `MeshPlot` for 3D Mesh Plot
- `WaterFallPlot` for Waterfall Plot
- `TimeSeries` for 3D Time Series
- `SpiralPlot` for 3D Spiral Plot

_Maps_

- `PrismMap` for 3D Prism Map
- `MapBarGraph` for 3D Map Bar Graph
- `MapStackedBarGraph` for 3D Map Stacked Bar Graph
- `MapTimeBars` for Time Series on Map
- `IsolineMap` for 3D Map with Iso Line
- `FlowMap` for 3D Flow Map

_Diagrams_

- `CrossSectionView` for 3D Cross Sectional View or 3D Models
- `ContourMap` for 3D Contour Map
- `PointCloud` for 3D Point Cloud
- `ForceDirectedGraph` for 3D Force Directed Graph
- `TreeMap` for 3D TreeMap

_Plots_

- `ContourPlot` for 3D Contour Plot
- `ParametricCurvePlot` for 3D Parametric Curve Plot
- `SurfacePlot` for 3D Surface Plot
- `ParametricSurfacePlot` for 3D Parametric Surface Plot

**Supported Visualizations**

_Charts_

- [3D Bar Graph](/ReadMe/CHarts/BarGraph.md)
- [3D Stacked Bar Graph](/ReadMe/Charts/StackedBarGraph.md)
- [3D Lollipop Chart](/ReadMe/Charts/LollipopChart.md)
- [3D Rectangle Chart](/ReadMe/Charts/RectangleChart.md)
- [3D Scatter Plot / 3D Bubble Chat](/ReadMe/Charts/ScatterPlot.md)
- [3D Connected Scatter Plot](/ReadMe/Charts/ConnectedScatterPlot.md)
- [3D Mesh Plot](/ReadMe/Charts/MeshPlot.md)
- [Waterfall Plot](/ReadMe/Charts/WaterFallPlot.md)
- [3D Time Series](/ReadMe/Charts/TimeSeries.md)
- [3D Spiral Plot](/ReadMe/Charts/SpiralPlot.md)

_Maps_

- [3D Prism Map](/ReadMe/Maps/PrismMap.md)
- [3D Map Bar Graph](/ReadMe/Maps/MapBarChart.md)
- [3D Map Stacked Bar Graph](/ReadMe/Maps/MapStackedBarChart.md)
- [MapTimeBars](/ReadMe/Maps/MapTimeBars.md)
- [IsolineMap](/ReadMe/Maps/MapWithIsoLines.md)
- [3D Flow Map](/ReadMe/Maps/FlowMap.md)

_Diagrams_

- [3D Cross Sectional View](/ReadMe/Diagrams/CrossSectionalView.md)
- [3D Contour Map](/ReadMe/Diagrams/ContourMap.md)
- [3D Point Cloud](/ReadMe/Diagrams/PointCloud.md)
- [3D Force Directed Graph](/ReadMe/Diagrams/ForceDirectedGraph.md)
- [3D TreeMap](/ReadMe/Diagrams/TreeMap.md)

_Plots_

- [3D Contour Plot](/ReadMe/Plots/ContourPlot.md)
- [3D Parametric Curve Plot](/ReadMe/Plots/ParametricCurvePlot.md)
- [3D Surface Plot](/ReadMe/Plots/SurfacePlot.md)
- [3D Parametric Surface Plot](/ReadMe/Plots/ParametricSurfacePlot.md)

#### data

**Properties for Data**

| Property | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dataFile | string | Path to location where the data file is located. **Required for most visualization type except for _curve plot_, _surface plot_, _parametric curve plot_ and _parametric surface plot_.**                                                                                                                                                                                                               |
| fileType | string | Type of value. **Available values: `csv`, `json`, `ply`, `text`. If the value of fileType is not mentioned the dataFile is taken as a json variable.** `csv` fletype must have header; `text` is used for csv without header.                                                                                                                                                                           |
| desc     | array  | Description of the header. **Required only if the `fileType` is csv.** _Example: [['Year', 'date','YYYY'], ['geoJson', 'jsonObject'], ['Tornadoes', 'text'], ['Deaths', 'number']]_. If the data type for a particular header is date or time then the format is also required. Available formats can be seen [here](http://momentjs.com/docs/#/parsing/). _Moment.js is used to parse dates and time._ |

#### style

**Properties for Style**

| Property  | Type             | Description                                                                                                                                                                                                 |
| --------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| origin    | array of numbers | Defines the position where the origin of the graph is placed. **Not Required. Default value: [0,0,0].** _Example: [0,0,0]_                                                                                  |
| rotation  | string           | Defines the rotation of the chart. **Not Required. Default value: '0 0 0'** _Format example: '-90 0 0'_                                                                                                     |
| dimension | object           | Defines the dimension of the graph. Keys in the object are `width`, `depth` and `height`. The value for all these keys are float type. **Not Required. Default value: {width: 10, height: 10, depth: 10}.** |
| xPivot    | number           | Defines the pivot point on x axis around which the graph can be rotated using `animateRotation` or on mouse drag. **Not required. Default value is the center point of the grsph**                          |
| yPivot    | number           | Defines the pivot point on y axis around which the graph can be rotated using `animateRotation` or on mouse drag. **Not required. Default value is the center point of the grsph**                          |
| zPivot    | number           | Defines the pivot point on z axis around which the graph can be rotated using `animateRotation` or on mouse drag. **Not required. Default value is the center point of the grsph**                          |

#### mark

`mark` is used to define the style and encoding for graphics in different visualizations. Different visualizations have different `mark` properties and key. These are discussed further in the documentation of individual visualizations.

#### axis

`axis` is used to define and draw the x, y and z axis. This object is not compulsory. If this object is not present none of the axes are drawn.

**Example**

```
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
      'rotation': '-90 0 0',
      'align':'center'
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
      'rotation': '-90 0 0',
      'align':'center'
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
      'rotation': '-90 0 0',
      'align':'center'
    },
    'grid': {
      'color': 'black',
      'opacity': 1,
    }
  }
}
```

`axis` has the 2 main type of objects

- axis-box
- x-axis, y-axis, z-axis

Note: For **spiral chart** the `axis` prop is not defined like below. To see the `axis` prop in spiral chart read the documentation of spiral chart [here](/ReadMe/SpiralPlot.md).

**axis-box**
Defines if the axis-box is drawn or not and the color and opacity of the axis box. **Not Required. If the object is not present then the axis-box is not drawn.** The dimensions of the axis box is taken from the `dimension` object in `style`

**Properties for axis-box**

| Property | Type   | Description                                                                        |
| -------- | ------ | ---------------------------------------------------------------------------------- |
| color    | string | Defines the color of the axis box. **Required**                                    |
| opacity  | float  | Defines the opacity of the axis box. **Reqruied**. _Value must be between 0 and 1_ |

**x-axis, y-axis, z-axis**
Defines if the different axes are drawn or not. **Not Required. If an object is not present then that axis is not drawn.**

**Properties for x-axis, y-axis, z-axis**

| Property           | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| orient             | string | Defines where the ticks are displayed. **Not Required. Default value for x-axis: front-top. Default value for x-axis: front-left. Default value for x-axis: bottom-left.**. _Available values for x-axis: front-top, back-bottom, back-top or front-bottom. Available values for y-axis: front-left, back-left, front-right or back-right. Available values for z-axis: bottom-left, top-left, top-right or bottom-right._ |
| title              | object | Defined the style of title for the axis. **Not Required.**                                                                                                                                                                                                                                                                                                                                                                 |
| title.text         | string | Defined the text for title for the axis. **Not Required. Default value: x-axis, y-axis or z-axis depending on the axis.**                                                                                                                                                                                                                                                                                                  |
| title.fontSize     | int    | Defined the font size for title for the axis. **Not Required. Default value: 12.**                                                                                                                                                                                                                                                                                                                                         |
| title.color        | string | Defined the color for title for the axis. **Not Required. Default value: "#000000".**                                                                                                                                                                                                                                                                                                                                      |
| title.opacity      | float  | Defined the opacity for title for the axis. **Not Required. Default value: 1.** _Value must be between 0 and 1. Currently this feature is not available._                                                                                                                                                                                                                                                                  |
| title.billboarding | bool   | Defines if the text always face the camera. **Not Required. Default value: false.** _If the value is change to true `title.rotation` is ignored._                                                                                                                                                                                                                                                                          |
| tick               | object | Defined the ticks for the axis. **Required.**                                                                                                                                                                                                                                                                                                                                                                              |
| tick.noOfTicks     | int    | Defined the no. of tick for the axis. **Required.** _No. of ticks are only applicable for `linear` scale._                                                                                                                                                                                                                                                                                                                 |
| tick.size          | float  | Defined the font size for ticks for the axis. **Required.**                                                                                                                                                                                                                                                                                                                                                                |
| tick.fontSize      | int    | Defined the font size for text for tick for the axis. **Required.**                                                                                                                                                                                                                                                                                                                                                        |
| tick.color         | string | Defined the color for ticks and text for tick for the axis. **Required.**                                                                                                                                                                                                                                                                                                                                                  |
| tick.opacity       | float  | Defined the opacity for title for the axis. **Required.** _Value must be between 0 and 1._                                                                                                                                                                                                                                                                                                                                 |
| tick.rotation      | string | Defines the alignment of the text for ticks. **Not Required. Default value for x-axis: "-90 0 0". Default value for y-axis: "0 0 0". Default value for z-axis: "-90 0 0". Format is "0 0 0"**.                                                                                                                                                                                                                             |
| tick.align         | string | Defines the alignment of the text for ticks. **Not Required. Default value for x-axis: center. Default value for y-axis: right. Default value for z-axis: right.** _Available values: left, center, right._                                                                                                                                                                                                                |
| tick.billboarding  | bool   | Defines if the text always face the camera. **Not Required. Default value:false.** _If the value is change to true `tick.rotation` is ignored._                                                                                                                                                                                                                                                                            |
| grid               | object | Defined the style of grid for the axis. **Not Required.**                                                                                                                                                                                                                                                                                                                                                                  |
| grid.color         | string | Defined the color for grid for the axis. **Required.**                                                                                                                                                                                                                                                                                                                                                                     |
| grid.opacity       | float  | Defined the opacity for grid for the axis. **Required.** _Value must be between 0 and 1._                                                                                                                                                                                                                                                                                                                                  |

#### title **Not Required**

This defines the title of the graph

**Properties for title**

| Property           | Type     | Description                                                                                                                                      |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| title              | object   | Defines the value and style of the graph title. **Not Required.** _If not present the label is not shown._                                       |
| title.value        | function | Returns the value of the text that is to be shown in the label. **Not Required. Default value: Visualization** _\n can be used for new line._    |
| title.align        | string   | Defines the alignment of the text in the graph title. **Not Required. Default value: center** _Available values: center, left or right._         |
| title.color        | string   | Defines the color of the text in the graph title. **Not Required. Default value: "#000000".**                                                    |
| title.lineHeight   | float    | Defines the line height of the text in the graph title. **Not Required. Default value: 14.**                                                     |
| title.wrapCount    | int      | Defines the wrap count of the text in the graph title. **Not Required. Default value: 80.**                                                      |
| title.position     | string   | Defines the position of the graph title. **Required. Format is "0 0 0".**                                                                        |
| title.rotation     | string   | Defines the rotation of the graph title. **Not Required. Format is "90 0 0".**                                                                   |
| title.fontSize     | float    | Defines the fontSize of the graph title. **Not Required. Default value: 12.**                                                                    |
| title.billboarding | bool     | Defines if the text always face the camera. **Not Required. Default value:false.** _If the value is change to true `title.rotation` is ignored._ |

### rotationOnDrag **Not Required**

This is use to define weather the visualization rotates on drag. _Type: `boolean`._ **Default value: `false`.**

#### animateRotation **Not Required**

This is use to define the rotation animation of the graph for viewing it in different perspective. _If animateRotation is present the roation of graph on mouse drag is ignored._

**Properties for animateRotation**

| Property      | Type   | Description                                                                                                       |
| ------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| initialAngles | string | Defines the starting angel (in degrees) of the rotation animation for the graph. **Required.** _Example: "0 0 0"_ |
| finalAngles   | string | Defines the ending angel (in degrees) of the rotation animation for the graph. **Required.** _Example: "0 360 0"_ |
| duration      | int    | Defines the timeperiod of the animation. The value is in millisecond. **Required.**                               |

## To Do

- Add Legends
- Add collaboration using [A-Frame Networked](https://haydenlee.io/networked-aframe/)
- Add vase plot and map vase plot

## Known Issues

- Doesnt work on chrome
- Multiple a-frame screens cannot be embedded in the same page [(https://github.com/aframevr/aframe/issues/916)](https://github.com/aframevr/aframe/issues/916)
- Ticks in Spiral chart is not working
- Holes in the maps don't work (for example Lesotho in South Africa)
- While using multiple graphs there is a possibility that rotation on drag might not rotate the graph from there center point in that case user might have to add the pivot points manually in json specification.
- ~~Grid in the axes doesnt work right now~~
- ~~Titles of the axes doesnt work right now~~
