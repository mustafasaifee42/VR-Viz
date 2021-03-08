# ParametricCurvePlot Component

![ParametricCurvePlot](../../imgs/ParametricCurvePlot.png)

## `mark` Object in Graph Props

```
'mark': {
  'position': {
    'x': {
      'function': (y) => Math.sin(y),
    },
    'y': {
      'function': (y) => Math.sin(y),
    },
    'z': {
      'function': (y) => Math.cos(y),
    }
  },
  'type': 'line',
  'style': {
    'opacity': 0.4,
    'color': 'red',
  }
}
```

**Properties for `mark` for Parametric Curve Plot**

| Property                 | Type     | Description                                                                                                                                                                                            |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| position                 | object   | Defines the how the position of vertices for contour will be mapped. **Required**                                                                                                                      |
| position.x               | object   | **Required.**                                                                                                                                                                                          |
| position.x.domain        | array    | Defines the domain for x position. **Not Required.** _If not present the domain is calculated from the provided data._                                                                                 |
| position.x.startFromZero | boolean  | Defines if the domain starts from 0 or not. **Not Required. Default value: false**. _Only applicable if `position.x.domain` is not given_                                                              |
| position.x.function      | function | Defines the function for x position. **Required.**                                                                                                                                                     |
| position.y               | object   | **Required.**                                                                                                                                                                                          |
| position.y.domain        | array    | Defines the domain for y position. **Not Required.** _If not present the domain is calculated from the provided data._                                                                                 |
| position.y.startFromZero | boolean  | Defines if the domain starts from 0 or not. **Not Required. Default value: false**. _Only applicable if `position.y.domain` is not given_                                                              |
| position.y.function      | function | Defines the function for y position. **Required.**                                                                                                                                                     |
| position.z.domain        | array    | Defines the domain for z position. **Not Required.** _If not present the domain is calculated from the provided data._                                                                                 |
| position.z.startFromZero | boolean  | Defines if the domain starts from 0 or not. **Not Required. Default value: false**. _Only applicable if `position.z.domain` is not given_                                                              |
| position.z.function      | function | Defines the function for z position. **Required.**                                                                                                                                                     |
| style                    | object   | Defines the style of the contour. **Not Required**                                                                                                                                                     |
| style.opacity            | float    | Defines the opacity of the contour. **Not Required. Default value: 1** _Value must be between 0 and 1._                                                                                                |
| style.color              | string   | Defines the color for contour. **Not Required. Default value: "#ff0000"**                                                                                                                              |
| style.curveType          | string   | Defines the type of curver for line. Available vaules: `line` for straight line, `CatmullRomCurve` for curve and `lineSegment` for discontinuos line segments. **Not Required. Default Value: `line`** |
| style.resolution         | number   | Defines how edgy the curve for the flow is. **Not Required. Default value: 20** _Smaller number is recommended for better performance. Only applicable if `style.curveType` is `CatmullRomCurve`_      |

## `parameter` Object in Graph Props (Required)

```
'parameter': {
  'domain': [0, 6 * Math.PI],
  'steps': 150,
}
```

**Properties for `parameter` for Parametric Curve Plot**

| Property | Type  | Description                                                           |
| -------- | ----- | --------------------------------------------------------------------- |
| domain   | array | Defines the domain for which the curve is plot. **Required.**         |
| steps    | array | Defines the intervals at which the curve is calculated. **Required.** |

### [Example JS of the Visualization](../../examples/Plots/ParametricCurvePlot.js)
