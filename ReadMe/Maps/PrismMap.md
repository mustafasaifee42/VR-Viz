# PrismMap Component

![PrismMap](../../imgs/PrismMap.png)

## `mark` Object in Graph Props

```
'mark': {
  'mapScale': 20,
  'mapOrigin': [5, 5],
  'rotation': '-45 0 0',
  'data': mapData,
  'projection': 'Mercator',
  'shapeIdentifier': 'id',
  'shapeKey': 'countries',
  'style': {
    'extrusion': {
      'field': 'value',
      'value': [0, 5],
    },
    'fill': {
      'scaleType': 'ordinal',
      'opacity': 0.9,
      'field': 'colorValue',
      'color': ['green', 'blue', 'red', 'yellow', 'magenta', 'cyan'],
    },
    'stroke': {
      'color': 'black',
    },
  },
}
```

**Properties for `mark` for Prism Map**

| Property                 | Type             | Description                                                                                                                                                                                                                                                                        |
| ------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mapScale                 | int              | Defines scale of the map. **Required.**                                                                                                                                                                                                                                            |
| mapOrigin                | array of 2 ints  | Defines the origin for the planes. **Required.** _Format example: [0,0]_                                                                                                                                                                                                           |
| rotation                 | string           | Defines the rotation. **Required.** _Format example: '-90 0 0'_                                                                                                                                                                                                                    |
| data                     | TopoJson         | Defines the TopoJson file that would be used to draw the map. **Required.**                                                                                                                                                                                                        |
| projection               | string           | Defines the projection of the map. **Not Required. Default value: Mercator.** _Available values: Mercator, Robinson, Gall-Peter, Winkel-Tripel, Equirectangular, Natural Earth1._                                                                                                  |
| shapeIdentifier          | string           | Defines the field in the TopoJson file of the map which can be used to indentify the different TopoJson shapes. The data file must also have a header by the same name so the data can be mapped to the right shape. **Required.**                                                 |
| shapeKey                 | string           | Defines the field in the TopoJson which defines the array of the different TopoJson shapes. **Required.**                                                                                                                                                                          |
| style                    | object           | Defines the style for the planes. **Required.**                                                                                                                                                                                                                                    |
| style.extrusion          | object           | Defines the height of the map. **Required.**                                                                                                                                                                                                                                       |
| style.extrusion.field    | string           | Defines the field in the data that will be mapped as extrusion of the map shapes. **Required.**                                                                                                                                                                                    |
| style.extrusion.domain   | array            | Defines the domain for extrusion. **Not Required.** _If not present the domain is calculated from the provided data depending on the style.extrusion.scaleType_                                                                                                                    |
| style.extrusion.value    | array of 2 float | Defines the height of the map. **Not Required. Default value: [0,5]**                                                                                                                                                                                                              |
| style.fill               | object           | Defines the fill of the map shapes. **Not Required.**                                                                                                                                                                                                                              |
| style.fill.opacity       | float            | Defines the opacity of the map shapes. **Not Required. Default value: 1** _Value must be between 0 and 1._                                                                                                                                                                         |
| style.fill.scaleType     | string           | Defines the scale type for fill of the map shapes. **Not Required. If not present then a constant color that is defined is filled in the map shapes.** _Available values: linear or ordinal._                                                                                      |
| style.fill.field         | string           | Defines the field in the data that will be mapped as fill of the map shapes. **Required if `style.fill.scaleType` is present.**                                                                                                                                                    |
| style.fill.domain        | array            | Defines the domain for fill. **Not Required.** _If not present the domain is calculated from the provided data depending on the style.fill.scaleType_                                                                                                                              |
| style.fill.color         | array or string  | Defines the color for fill. **Not Required if style.fill.scaleType is present, else required. Default value: #ff0000 if style.fill.scaleType is not present else d3.schemeCategory10.** _If style.fill.scaleType is not present the this needs to be a string otherwise an array._ |
| style.fill.startFromZero | boolean          | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if style.fill.color is not given and style.fill.scaleType is `linear`._                                                                                                        |
| style.stroke             | object           | Defines the stroke for the planes. **Not Required. If not present the planes are not stroked.**                                                                                                                                                                                    |
| style.stroke.color       | string           | Defines the stroke color for map. **Not Required. Default value: "#000000".**                                                                                                                                                                                                      |

### [Example JS of the Visualization](../../examples/Maps/PrismMap.js)

## Data

**Datafile**: `csv`

The data file must have **latitude**, **longitude** as the header values.

```
id,value,colorValue
004,6.769927552817786,1
024,6.860288838552762,5
008,6.492813386791552,3
```

## Known Issue

- Holes in the maps don't work (for example Lesotho in South Africa)
