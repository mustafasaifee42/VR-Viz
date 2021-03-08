# SpiralChart Component

![SpiralChart](../../imgs/SpiralChart.png)

## `mark` Object in Graph Props

```
'mark': {
  'vertices': [
    {
      'title': 'GDP1',
      'scaleType': 'linear',
      'domain': [0, 5],
    },
    {
      'title': 'GDP2',
      'scaleType': 'linear',
      'domain': [0, 5],
    },
    {
      'title': 'GDP3',
      'scaleType': 'linear',
      'domain': [0, 5],
    },
    {
      'title': 'GDP4',
      'scaleType': 'linear',
      'domain': [0, 5],
    },
    {
      'scaleType': 'linear',
      'title': 'GDP5',
      'domain': [0, 5],
    }
  ],
  'style': {
    'stroke': {
      'width': 10,
      'color': 'black',
    },
  },
}
```

**Properties for `mark` for Parametric Spiral Chart**

| Property                   | Type                      | Description                                                                                                                                                                                                                                                                                                          |
| -------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vertices                   | array of objects          | Defines the how the position of vertices for contour will be mapped. **Required. The keys of the object are `title`,`scaleType`,`domain`,`startFromZero`.**                                                                                                                                                          |
| vertices[i].title          | string                    | Defines the field in the data that will be mapped as vertice position of the spiral. **Required.**                                                                                                                                                                                                                   |
| vertices[i].domain         | array                     | Defines the domain for vertice position of the spiral. **Not Required.** _If not present the domain is calculated from the provided data depending on the vertices[i].scaleType._                                                                                                                                    |
| vertices[i].startFromZero  | boolean                   | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if style.stroke.domain is not given and vertices[i].scaleType is `linear`._                                                                                                                                      |
| style                      | object                    | Defines the style of the contour. **Not Required**                                                                                                                                                                                                                                                                   |
| style.stroke               | object                    | Defines the stroke of the spiral. **Not Required.**                                                                                                                                                                                                                                                                  |
| style.stroke.width         | int                       | Defines the stroke width of the spiral. **Not Required. Default value: 1**                                                                                                                                                                                                                                           |
| style.stroke.scaleType     | string                    | Defines the scale type for color of stroke of the spiral. **Not Required. If not present then a constant stroke that is defined is used.** _Available values: linear or ordinal._                                                                                                                                    |
| style.stroke.field         | string                    | Defines the field in the data that will be mapped as color of stroke of the spiral. **Required if `style.stroke.scaleType` is present.**                                                                                                                                                                             |
| style.stroke.domain        | array                     | Defines the domain for color of stroke. **Not Required.** _If not present the domain is calculated from the provided data depending on the style.stroke.scaleType._                                                                                                                                                  |
| style.stroke.color         | array of string or string | Defines the range for color of stroke. **Not Required if style.fill.scaleType is present, else required. Default value: #ff0000 if style.stroke.scaleType is not present else d3.schemeCategory10.** _If `style.stroke.scaleType` is not present the `style.stroke.value` is string or else its an array of string._ |
| style.stroke.startFromZero | boolean                   | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if style.stroke.domain is not given and style.stroke.scaleType is `linear`._                                                                                                                                     |
| style.fill                 | object                    | Defines the fill of the spiral. **Not Required.**                                                                                                                                                                                                                                                                    |
| style.fill.scaleType       | string                    | Defines the scale type for color of fill of the spiral. **Not Required. If not present then a constant fill that is defined is used.** _Available values: linear or ordinal._                                                                                                                                        |
| style.fill.field           | string                    | Defines the field in the data that will be mapped as color of fill of the spiral. **Required if `style.fill.scaleType` is present.**                                                                                                                                                                                 |
| style.fill.domain          | array                     | Defines the domain for color of fill. **Not Required.** _If not present the domain is calculated from the provided data depending on the style.fill.scaleType._                                                                                                                                                      |
| style.fill.color           | array of string or string | Defines the range for color of fill. **Not Required if style.fill.scaleType is present, else required. Default value: #ff0000 if style.fill.scaleType is not present else d3.schemeCategory10.** _If `style.fill.scaleType` is not present the `style.fill.value` is string or else its an array of string._         |
| style.fill.startFromZero   | boolean                   | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if style.fill.domain is not given and style.fill.scaleType is `linear`._                                                                                                                                         |

## `axis` Object in Graph Props (currently this feature is not available for spiral chart)

Axis object in spiral chart is different from other charts which is shown in the Getting Started.

```
'axis': {
  'fontSize': 10,
  'color': 'black',
  'opacity': 1,
  'ticks': {
    'noOfTicks': 10,
    'size': 0.1,
    'color': 'black',
    'opacity': 1,
    'fontSize': 10,
  }
}
```

### [Example JS of the Visualization](../../examples/Charts/SpiralChart.js)

## Data

**Datafile**: `csv`

```
Year,GDP1,GDP2,GDP3,GDP4,GDP5
2000,5,5,5,5,5
2001,2,2,2,2,2
2002,3,3,3,3,3
2003,4,4,4,4,4
```
