# ContourPlot Component

![ContourPlot](../../imgs/ContourPlot.png)

## `mark` Object in Graph Props

```

'mark': {
  'type': 'line',
  'position': {
    'x': {
      'function': (y) => Math.sin(y),
    },
    'y': {
      'domain': [0, 6 * Math.PI],
      'steps': 150,
    },
    'z': {
      'function': (y) => Math.cos(y),
    }
  },
  'style': {
    'opacity': 1,
    'color': 'red',
  }
},
```

**Properties for `mark` for Contour Plot**

| Property                 | Type     | Description                                                                                                                                                                                           |
| ------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                     | string   | Defines type of contour that would be created. **Required. Default value: line**. _Available values: line._                                                                                           |
| position                 | object   | Defines the how the position of vertices for contour will be mapped. **Required**                                                                                                                     |
| position.x               | object   | **Required.**                                                                                                                                                                                         |
| position.x.domain        | array    | Defines the domain for x position. **Not Required.** _If not present the domain is calculated from the provide data depending on the position.x.scaleType._                                           |
| position.x.startFromZero | boolean  | Defines if the domain starts from 0 or not. **Not Required. Default value: false**. _Only applicable if position.x.domain is not given_                                                               |
| position.x.function      | function | Defines the function for x position. **Required.**                                                                                                                                                    |
| position.y               | object   | **Required.**                                                                                                                                                                                         |
| position.y.domain        | array    | Defines the domain for which the contour is plot. **Required.**                                                                                                                                       |
| position.y.startFromZero | boolean  | Defines if the domain starts from 0 or not. **Not Required. Default value: false**. _Only applicable if position.y.domain is not given_                                                               |
| position.y.steps         | array    | Defines the intervals at which the curve is calculated. **Required.**                                                                                                                                 |
| position.z               | object   | **Required.**                                                                                                                                                                                         |
| position.z.domain        | array    | Defines the domain for z position. **Not Required.** _If not present the domain is calculated from the provide data depending on the position.z.scaleType._                                           |
| position.z.startFromZero | boolean  | Defines if the domain starts from 0 or not. **Not Required. Default value: false**. _Only applicable if position.z.domain is not given_                                                               |
| position.z.function      | function | Defines the function for z position. **Required.**                                                                                                                                                    |
| style                    | object   | Defines the style of the contour. **Not Required**                                                                                                                                                    |
| style.opacity            | float    | Defines the opacity of the contour. **Not Required. Default value: 1** _Value must be between 0 and 1._                                                                                               |
| style.curveType          | string   | Defines the type of curver for line. Available vaules: `line` for straight line, `CatmullRomCurve` for curve and `lineSegment` for discontinuos line segments. **Not Required.Default Value: `line`** |
| style.resolution         | number   | Defines how edgy the curve for the flow is. **Not Required. Default value: 20** _Smaller number is recommended for better performance. Only applicable if `style.curveType` is `CatmullRomCurve`_     |
| style.color              | string   | Defines the color for contour. **Not Required. Default value: "#ff0000"**                                                                                                                             |

### [Example JS of the Visualization](../examples/Plots/ContourPlot.js)
