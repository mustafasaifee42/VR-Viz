# ContourMap Component

![ContourMap](../../imgs/ContourMap.png)

## `mark` Object in Graph Props

```
'mark': {
  'heightThreshold': 100,
  'style': {
    'fill': {
      'scaleType': 'linear',
      'opacity': 0.4,
      'color': ['green', 'blue'],
    },
    'stroke': {
      'width': 1,
      'color': 'black',
    }
  },
}
```

**Properties for `mark` for Contour Map**

| Property             | Type            | Description                                                                                                                                                                                                                                                                        |
| -------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| heightThreshold      | float           | Defines what height will be mapped to 0. **Not Required. Default value: 0.**                                                                                                                                                                                                       |
| style                | object          | Defines the style for the planes. **Not Required.**                                                                                                                                                                                                                                |
| style.fill           | object          | Defines the fill for the planes. **Not Required.**                                                                                                                                                                                                                                 |
| style.fill.opacity   | float           | Defines the opacity of the planes. **Not Required. Default value: 1** _Value must be between 0 and 1._                                                                                                                                                                             |
| style.fill.scaleType | string          | Defines the scale type for fill of the planes. **Not Required. If not present then a constant color that is defined is filled in the planes.** _Available values: linear._                                                                                                         |
| style.fill.color     | array or string | Defines the color for fill. **Not Required if style.fill.scaleType is present, else required. Default value: #ff0000 if style.fill.scaleType is not present else d3.schemeCategory10.** _If style.fill.scaleType is not present the this needs to be a string otherwise an array._ |
| style.stroke         | object          | Defines the stroke for the planes. **Not Required. If not present the planes are not stroked.**                                                                                                                                                                                    |
| style.stroke.width   | float           | Defines the stroke of the planes. **Not Required. Default value: 1**                                                                                                                                                                                                               |
| style.stroke.color   | string          | Defines the stroke color for plane. **Not Required. Default value: "#000000"**                                                                                                                                                                                                     |

### [Example JS of the Visualization](../../examples/Diagrams/ContourMap.js)

## Data

**Datafile**: `text`

The data file is without header. Rows corresponding to grid lines running east to west and columns to grid lines running south to north.

```
100,100,101,101,101
101,101,102,102,102
102,102,103,103,103
102,102,103,103,103
102,102,103,103,103
```
