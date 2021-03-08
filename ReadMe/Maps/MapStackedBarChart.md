# MapStackedBarChart Component

![MapStackedBarChart](../../imgs/MapStackedBarChart.png)

## `mark` Object in Graph Props

```
'mark': {
  'mapScale': 20,
  'mapOrigin': [5, 5],
  'rotation': '-90 0 0',
  'map': {
    'data': mapData,
    'projection': 'Mercator',
    'shapeIdentifier': 'id',
    'shapeKey': 'countries',
    'style': {
      'extrusion': 0.0000001,
      'fill': {
        'opacity': 1,
        'color': 'red',
      },
      'stroke': {
        'width': 1,
        'color': 'black',
      },
    },
  },
  'bars': {
    'type': 'box',
    'style': {
      'depth': 0.2,
      'width': 0.2,
      'fill': {
        'opacity': 0.9,
        'color': ['green', 'blue'],
        'field': ['value', 'value1'],
      },
    }
  },
}
```

**Properties for `mark` for Flow Map**

| Property                                | Type              | Description                                                                                                                                                                      |
| --------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mapScale                                | int               | Defines scale of the map. **Required.**                                                                                                                                          |
| mapOrigin                               | array of 2 ints   | Defines the origin for the planes. **Required.** _Format example: [0,0]_                                                                                                         |
| rotation                                | string            | Defines the rotation. **Required.** _Format example: '-90 0 0'_                                                                                                                  |
| map                                     | object            | Defines style of the maps. **Required**                                                                                                                                          |
| map.data                                | TopoJson          | Defines the TopoJson file that would be used to draw the map. **Required.**                                                                                                      |
| map.projection                          | string            | Defines the projection of the map. **Not Required. Default value: Mercator** _Available values: Mercator, Robinson, Gall-Peter, Winkel-Tripel, Equirectangular, Natural Earth1._ |
| map.shapeIdentifier                     | string            | Defines the field in the TopoJson file of the map which can be used to indentify the different TopoJson shapes. **Required.**                                                    |
| map.shapeKey                            | string            | Defines the field in the TopoJson which defines the array of the different TopoJson shapes. **Required.**                                                                        |
| map.style                               | object            | Defines the style for the planes. **Not Required.**                                                                                                                              |
| map.style.extrusion                     | object            | Defines the height of the map. **Not Required. Default value: 0.001.**                                                                                                           |
| map.style.fill                          | object            | Defines the fill for the planes. **Not Required**                                                                                                                                |
| map.style.fill.color                    | string            | Defines the fill color for map. **Not Required. Default value: "#ff0000"**                                                                                                       |
| map.style.fill.opacity                  | float             | Defines the opacity of fill of the map. **Not Required. Default value: 1.**                                                                                                      |
| map.style.stroke                        | object            | Defines the stroke for the planes. **Not Required. If not present the planes are not stroked.**                                                                                  |
| map.style.stroke.width                  | float             | Defines the stroke of the map. **Not Required. Default value: 1.**                                                                                                               |
| map.style.stroke.color                  | string            | Defines the stroke color for map. **Not Required. Default value: "#000000"**                                                                                                     |
| bars                                    | object            | Defines style of the bars. **Required**                                                                                                                                          |
| bars.type                               | string            | Defines type of bar that would be created. **Not Required. Default value: box**. _Available values: box, cylinder._                                                              |
| bars.style                              | object            | Defines the style for the bar. **Required.**                                                                                                                                     |
| bars.style.width                        | float             | Defines the width of the bar. **Not Required. Default value: 0.2.**                                                                                                              |
| bars.style.depth                        | float             | Defines the depth of the bar. **Not Required. Default value: 0.2.**                                                                                                              |
| bars.style.radius                       | float             | Defines the radius of the bar, if the bar is a cylinder. **Not Required. Default value: 0.2.**                                                                                   |
| bars.style.segments                     | int               | Defines the no. of segments in bar, if the bar is a cylinder or cone. **Not Required. Default value: 16.**                                                                       |
| bars.style.height                       | object            | Defines the height of the bar. **Not Required.**                                                                                                                                 |
| bars.style.height.domain                | array             | Defines the domain for height. **Not Required.** _If not present the domain is calculated from the provided data._                                                               |
| bars.style.height.value                 | array of 2 floats | Defines the range for height. **Not Required. Default value: [0,5]**                                                                                                             |
| bars.style.height.startFromZero         | boolean           | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if bars.style.height.domain is not given._                                   |
| bars.style.fill                         | object            | Defines the fill of the bar. **Required.**                                                                                                                                       |
| bars.style.fill.opacity                 | float             | Defines the opacity of the bar. **Not Required. Default value: 1.** _Value must be between 0 and 1._                                                                             |
| bars.style.fill.field                   | array of string   | Defines the field in the data that will be mapped as fill of the bar. **Required**                                                                                               |
| bars.style.fill.color                   | array of string   | Defines the color for fill. **Not Required. Default value: d3.schemeCategory10.**                                                                                                |
| bars.mouseOver                          | Object            | Defines the mouseOver effect on the bars. **Not Required.** _If not present no mouse over effect happens._                                                                       |
| bars.mouseOver.focusedObject            | object            | Defines the style for the mouseOver effect on the bar. **Required.**                                                                                                             |
| bars.mouseOver.focusedObject.opacity    | float             | Defines the opacity of bar when mouse hovers on it. **Required.**                                                                                                                |
| bars.mouseOver.focusedObject.fill       | string            | Defines the color of bar when mouse hovers on it. **Required.**                                                                                                                  |
| bars.mouseOver.nonFocusedObject         | object            | Defines the style for the bar not in focus. **Required.**                                                                                                                        |
| bars.mouseOver.nonFocusedObject.opacity | float             | Defines the opacity of bar which are not in focus when mouse hovers on a particular bar. **Required.**                                                                           |
| bars.mouseOver.label                    | object            | Defines the value and style of the mouse over text. **Not Required.** _If not present the label is not shown._                                                                   |
| bars.mouseOver.label.value              | function          | Returns the value of the text that is to be shown in the label. **Required.** _\n can be used for new line._                                                                     |
| bars.mouseOver.label.align              | string            | Defines the alignment of the text in the label. **Required.** _Available values: center, left or right._                                                                         |
| bars.mouseOver.label.fontColor          | string            | Defines the color of the text in the label. **Required.**                                                                                                                        |
| bars.mouseOver.label.lineHeight         | float             | Defines the line height of the text in the label. **Not Required.**                                                                                                              |
| bars.mouseOver.label.wrapCount          | int               | Defines the wrap count of the text in the label. **Not Required.**                                                                                                               |
| bars.mouseOver.label.backgroundColor    | string            | Defines the color of the background of the label. **Required.**                                                                                                                  |
| bars.mouseOver.label.backgroundOpacity  | string            | Defines the color of the background of the label. **Required.**                                                                                                                  |
| bars.mouseOver.label.position           | string            | Defines the position of the label w.r.t the cursor. **Not Required. Format is "0 0 0".**                                                                                         |
| bars.mouseOver.label.rotation           | string            | Defines the rotation of the label w.r.t the cursor. **Not Required. Format is "90 0 0".**                                                                                        |
| bars.mouseOver.label.width              | float             | Defines the width of the label. **Not Required.**                                                                                                                                |
| bars.mouseOver.label.height             | float             | Defines the height of the label. **Not Required.**                                                                                                                               |

### [Example JS of the Visualization](../../examples/Maps/MapStackedBarChart.js)

## Data

**Datafile**: `csv`

The data file must have **latitude**, **longitude** as the header values.

```
latitude,longitude,value,value1
42.546245,1.601554,3.148977637,3.148977637
23.424076,53.847818,9.563725062,9.563725062
33.93911,67.709953,7.260326865,7.260326865
```
