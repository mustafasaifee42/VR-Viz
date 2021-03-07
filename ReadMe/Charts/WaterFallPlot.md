# WaterfallPlot Component

![WaterfallPlot](../../imgs/WaterFallPlot.png)

## `mark` Object in Graph Props

```
'mark': {
  'position': {
    'x': {
      'scaleType': 'ordinal',
      'domain': ['-10', '0', '10']
    },
    'y': {
      'scaleType': 'linear',
    },
    'z': {
      'scaleType': 'ordinal',
      'field': 'Alpha'
    }
  },
  'style': {
    'stroke': {
      'color': 'black',
      'width': 2,
    },
    'fill': {
      'color': 'red',
      'opacity': 0.5,
    }
  }
}
```

**Properties for `mark` for Parametric Waterfall Plot**

| Property                 | Type    | Description                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| position                 | object  | Defines the how the position of vertices for contour will be mapped. **Required**                                                                                                                                                                                                                                                                                   |
| position.x               | object  | **Required.**                                                                                                                                                                                                                                                                                                                                                       |
| position.x.scaleType     | string  | Defines the scale type for x position of the points on the mesh. **Required.** _Available values: linear or ordinal._                                                                                                                                                                                                                                               |
| position.x.domain        | float   | Defines the domain for x position. **Not Required.** _If not present the domain is calculated from the provide data depending on the position.x.scaleType._                                                                                                                                                                                                         |
| position.x.startFromZero | boolean | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if position.x.domain is not given and position.x.scaleType is `linear`._                                                                                                                                                                                        |
| position.y               | object  | **Required.**                                                                                                                                                                                                                                                                                                                                                       |
| position.y.scaleType     | string  | Defines the scale type for y position of the points on the mesh. **Required.** _Available values: linear or ordinal._                                                                                                                                                                                                                                               |
| position.y.domain        | float   | Defines the domain for y position. **Not Required.** _If not present the domain is calculated from the provide data depending on the position.y.scaleType._                                                                                                                                                                                                         |
| position.y.startFromZero | boolean | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if position.y.domain is not given and position.y.scaleType is `linear`._                                                                                                                                                                                        |
| position.z               | object  | **Required.**                                                                                                                                                                                                                                                                                                                                                       |
| position.z.scaleType     | string  | Defines the scale type for x position of the points on the mesh. **Required.** _Available values: linear or ordinal._                                                                                                                                                                                                                                               |
| position.z.field         | string  | Defines the field in the data that will be mapped as x position of the points on the mesh. **Required.**                                                                                                                                                                                                                                                            |
| position.z.domain        | float   | Defines the domain for x position. **Not Required.** _If not present the domain is calculated from the provide data depending on the position.z.scaleType._                                                                                                                                                                                                         |
| style                    | object  | Defines the style of the contour. **Required**                                                                                                                                                                                                                                                                                                                      |
| style.fill               | object  | Defines the fill of the surface. **Required.**                                                                                                                                                                                                                                                                                                                      |
| style.fill.opacity       | float   | Defines the opacity of the surface. **Required.** _Value must be between 0 and 1._                                                                                                                                                                                                                                                                                  |
| style.fill.color         | string  | Defines the color for fill. **Required.**                                                                                                                                                                                                                                                                                                                           |
| style.stroke             | object  | Defines the stroke for the mesh. **Not Required. If not present the mesh are not stroked.** _This can be used to design a mesh to make the mesh more readable._                                                                                                                                                                                                     |
| style.stroke.width       | float   | Defines the stroke of the mesh. **Required.**                                                                                                                                                                                                                                                                                                                       |
| style.stroke.color       | string  | Defines the stroke color for mesh. **Required.**                                                                                                                                                                                                                                                                                                                    |
| style.stroke.curveType   | string  | Defines the type of curver for line. Available vaules: `line` for straight line, `CatmullRomCurve` for curve and `lineSegment` for discontinuos line segments. **Not Required.** _Default Value: `line`._ Even if the stroke is curved the fill will remain edgy, therefore it is advisable to use `style.fill.opacity` to `0` if `curveType` is `CatmullRomCurve`. |
| style.stroke.resolution  | number  | Defines how edgy the curve for the flow is. **Not Required. Default value: 20** _Smaller number is recommended for better performance. Only applicable if `style.stroke.curveType` is `CatmullRomCurve`_                                                                                                                                                            |

### [Example JS of the Visualization](../examples/Charts/WaterfallPlot.js)

## Data

**Datafile**: `csv`

```
Alpha,-10,0,10
10,-0.154623,-0.154975,-0.154623
20,-0.159781,-0.159673,-0.159781
30,-0.16475,-0.177522,-0.16475
```
