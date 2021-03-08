# ForceDirectedGraph Component

![ForceDirectedGraph](../../imgs/ForceDirectedGraph.png)

## `mark` Object in Graph Props

```
'mark': {
  'nodes': {
    'type': 'sphere',
    'style': {
      'radius': {
        'value': 0.1,
      },
      'fill': {
        'scaleType': 'ordinal',
        'opacity': 1,
        'field': 'group',
        'color': ['green', 'blue', 'red', 'yellow', 'tomato', 'olive', 'magenta', 'cyan', 'gray', 'maroon'],
        'domain': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
  },
  'links': {
    'type': 'line',
    'style': {
      'fill': {
        'scaleType': 'ordinal',
        'opacity': {
          'value': 0.3,
        },
        'field': 'value',
        'color': ['green', 'blue', 'red', 'yellow', 'tomato', 'olive', 'magenta', 'cyan', 'gray', 'maroon'],
        'domain': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
  },
  'labels': {
    'field': 'id',
    'style': {
      'color': 'black',
      'opacity': 1,
      'fontSize': 1,
      'padding': 0.1,
    }
  },
}
```

**Properties for `mark` for Connected Scatter Plot**

| Property                                   | Type                      | Description                                                                                                                                                                                                                                                                                    |
| ------------------------------------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nodes                                      | object                    | Defines the style and shape of the noda. **Required.**                                                                                                                                                                                                                                         |
| nodes.type                                 | string                    | Defines type of nodes that would be created. **Not Required. Default value: sphere**. _Available values: sphere, box._                                                                                                                                                                         |
| nodes.style                                | object                    | Defines the style of the node. **Not Required.**                                                                                                                                                                                                                                               |
| nodes.style.fill                           | object                    | Defines the fill of the node. **Not Required.**                                                                                                                                                                                                                                                |
| nodes.style.fill.opacity                   | float                     | Defines the opacity of the node. **Not Required. Default value: 1** _Value must be between 0 and 1._                                                                                                                                                                                           |
| nodes.style.fill.scaleType                 | string                    | Defines the scale type for fill of the node. **Not Required. If not present then a constant color that is defined is filled in the node.** _Available values: linear or ordinal._                                                                                                              |
| nodes.style.fill.field                     | string                    | Defines the field in the data that will be mapped as fill of the node. **Required if `nodes.style.fill.scaleType` is present.**                                                                                                                                                                |
| nodes.style.fill.domain                    | array                     | Defines the domain for fill. **Not Required.** _If not present the domain is calculated from the provided data depending on the nodes.style.fill.scaleType_                                                                                                                                    |
| nodes.style.fill.color                     | array or string           | Defines the color for fill. **Not Required if style.fill.scaleType is present, else required. Default value: #ff0000 if nodes.style.fill.scaleType is not present else d3.schemeCategory10.** _If nodes.style.fill.scaleType is not present the this needs to be a string otherwise an array._ |
| nodes.style.fill.startFromZero             | boolean                   | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if nodes.style.fill.color is not given and nodes.style.fill.scaleType is `linear`._                                                                                                        |
| nodes.style.radius                         | object                    | Defines the radius of the points. **Not Required5**                                                                                                                                                                                                                                            |
| nodes.style.radius.scaleType               | string                    | Defines the scale type for radius of the points. **Not Required. If not present then a constant radius that is defined is used.** _Available values: linear or ordinal._                                                                                                                       |
| nodes.style.radius.field                   | string                    | Defines the field in the data that will be mapped as radius of the points. **Required if `nodes.style.radius.scaleType` is present.**                                                                                                                                                          |
| nodes.style.radius.domain                  | array                     | Defines the domain for radius. **Not Required.** _If not present the domain is calculated from the provided data depending on the nodes.style.radius.scaleType_                                                                                                                                |
| nodes.style.radius.value                   | array of float or float   | Defines the range for radius. **Not Required. Default value: 0.** _If `nodes.style.radius.scaleType` is not present the `nodes.style.radius.value` is float or else its an array of float._                                                                                                    |
| nodes.style.radius.startFromZero           | boolean                   | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if nodes.style.radius.domain is not given and nodes.style.radius.scaleType is `linear`._                                                                                                   |
| nodes.mouseOver                            | Object                    | Defines the mouseOver effect on the bars. **Not Required.** _If not present no mouse over effect happens._                                                                                                                                                                                     |
| nodes.mouseOver.focusedObject              | object                    | Defines the style for the mouseOver effect on the bar. **Required.**                                                                                                                                                                                                                           |
| nodes.mouseOver.focusedObject.opacity      | float                     | Defines the opacity of bar when mouse hovers on it. **Required.**                                                                                                                                                                                                                              |
| nodes.mouseOver.focusedObject.fill         | string                    | Defines the color of bar when mouse hovers on it. **Required.**                                                                                                                                                                                                                                |
| nodes.mouseOver.nonFocusedObject           | object                    | Defines the style for the bar not in focus. **Required.**                                                                                                                                                                                                                                      |
| nodes.mouseOver.nonFocusedObject.opacity   | float                     | Defines the opacity of bar which are not in focus when mouse hovers on a particular bar. **Required.**                                                                                                                                                                                         |
| nodes.mouseOver.label                      | object                    | Defines the value and style of the mouse over text. **Not Required.** _If not present the label is not shown._                                                                                                                                                                                 |
| nodes.mouseOver.label.value                | function                  | Returns the value of the text that is to be shown in the label. **Required.** _\n can be used for new line._                                                                                                                                                                                   |
| nodes.mouseOver.label.align                | string                    | Defines the alignment of the text in the label. **Required.** _Available values: center, left or right._                                                                                                                                                                                       |
| nodes.mouseOver.label.fontColor            | string                    | Defines the color of the text in the label. **Required.**                                                                                                                                                                                                                                      |
| nodes.mouseOver.label.lineHeight           | float                     | Defines the line height of the text in the label. **Not Required.**                                                                                                                                                                                                                            |
| nodes.mouseOver.label.wrapCount            | int                       | Defines the wrap count of the text in the label. **Not Required.**                                                                                                                                                                                                                             |
| nodes.mouseOver.label.backgroundColor      | string                    | Defines the color of the background of the label. **Required.**                                                                                                                                                                                                                                |
| nodes.mouseOver.label.backgroundOpacity    | string                    | Defines the color of the background of the label. **Required.**                                                                                                                                                                                                                                |
| nodes.mouseOver.label.position             | string                    | Defines the position of the label w.r.t the cursor. **Not Required. Format is "0 0 0".**                                                                                                                                                                                                       |
| nodes.mouseOver.label.rotation             | string                    | Defines the rotation of the label w.r.t the cursor. **Not Required. Format is "90 0 0".**                                                                                                                                                                                                      |
| nodes.mouseOver.label.width                | float                     | Defines the width of the label. **Not Required.**                                                                                                                                                                                                                                              |
| nodes.mouseOver.label.height               | float                     | Defines the height of the label. **Not Required.**                                                                                                                                                                                                                                             |
| links                                      | object                    | Defines the style and shape of the link. **Required.**                                                                                                                                                                                                                                         |
| links.type                                 | string                    | Defines type of nodes that would be created. **Not Required. Default value: line**. _Available values: line._                                                                                                                                                                                  |
| links.style                                | object                    | Defines the style of the link. **Not Required.**                                                                                                                                                                                                                                               |
| links.style.fill                           | object                    | Defines the fill of the link. **Not Required.**                                                                                                                                                                                                                                                |
| links.style.fill.scaleType                 | string                    | Defines the scale type for fill of the link. **Not Required. If not present then a constant color that is defined is filled in the link.** _Available values: linear or ordinal._                                                                                                              |
| links.style.fill.field                     | string                    | Defines the field in the data that will be mapped as fill of the link. **Required if `links.style.fill.scaleType` is present.**                                                                                                                                                                |
| links.style.fill.domain                    | array                     | Defines the domain for fill. **Not Required.** _If not present the domain is calculated from the provided data depending on the links.style.fill.scaleType_                                                                                                                                    |
| links.style.fill.color                     | array of string or string | Defines the color for fill. **Not Required if style.fill.scaleType is present, else required. Default value: #000000 if links.style.fill.scaleType is not present else d3.schemeCategory10.** _If links.style.fill.scaleType is not present the this needs to be a string otherwise an array._ |
| links.style.fill.startFromZero             | boolean                   | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if links.style.fill.color is not given and links.style.fill.scaleType is `linear`._                                                                                                        |
| links.style.fill.opacity                   | object                    | Defines the opacity of the link. **Not Required. Default value: 1**                                                                                                                                                                                                                            |
| links.style.fill.opacity.scaleType         | string                    | Defines the scale type for opacity of the link. **Not Required. If not present then a constant color that is defined is filled in the link.** _Available values: linear or ordinal._                                                                                                           |
| links.style.fill.opacity.value             | array of number or number | Defines the value of the duration of animation. **Not Required. Default value: 1** _If links.style.fill.opacity.scaleType is not present the this needs to be a number otherwise an array._                                                                                                    |
| links.style.fill.opacity.field             | string                    | Defines the field in the data that will be mapped as opacity of the link. **Required if `links.style.fill.opacity.scaleType` is present.**                                                                                                                                                     |
| links.style.fill.opacity.domain            | array                     | Defines the domain for opacity. **Not Required.** _If not present the domain is calculated from the provided data depending on the links.style.fill.opacity.scaleType_                                                                                                                         |
| links.style.fill.opacity.startFromZero     | boolean                   | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if links.style.fill.opacity.color is not given and links.style.fill.opacity.scaleType is `linear`._                                                                                        |
| links.flowAnimation                        | object                    | Defines the flow animation on the link. **Not Required.**                                                                                                                                                                                                                                      |
| links.flowAnimation.opacity                | number                    | Defines the opacity of the dot in the flow animation. **Required.** _.Values must be between 0 and 1._                                                                                                                                                                                         |
| links.flowAnimation.color                  | string                    | Defines the color of the dot in the flow animation. **Required.**                                                                                                                                                                                                                              |
| links.flowAnimation.duration               | object                    | Defines the speed of animation of the dot. **Required.**                                                                                                                                                                                                                                       |
| links.flowAnimation.duration.scaleType     | string                    | Defines the scale type for duration. **Not Required. If not present then a constant duration that is defined is used.** _Available values: linear._                                                                                                                                            |
| links.flowAnimation.duration.value         | array of number or number | Defines the value of the duration of animation. **Required** _If links.flowAnimation.duration.scaleType is not present the this needs to be a number otherwise an array._                                                                                                                      |
| links.flowAnimation.duration.field         | string                    | Defines the field in the data that will be mapped as opacity of the link. **Required if `links.flowAnimation.duration.scaleType` is present.**                                                                                                                                                 |
| links.flowAnimation.duration.domain        | array                     | Defines the domain for opacity. **Not Required.** _If not present the domain is calculated from the provided data depending on the links.flowAnimation.duration.scaleType_                                                                                                                     |
| links.flowAnimation.duration.startFromZero | boolean                   | Defines if the domain starts from 0 or not. **Not Required. Default value: false**                                                                                                                                                                                                             |
| links.flowAnimation.radius                 | object                    | Defines the radius of the animating dot. **Required.**                                                                                                                                                                                                                                         |
| links.flowAnimation.radius.scaleType       | string                    | Defines the scale type for radius. **Not Required. If not present then a constant radius that is defined is used.** _Available values: linear._                                                                                                                                                |
| links.flowAnimation.radius.value           | array of number or number | Defines the value of the radius. **Required** _If links.flowAnimation.radius.scaleType is not present the this needs to be a number otherwise an array._                                                                                                                                       |
| links.flowAnimation.radius.field           | string                    | Defines the field in the data that will be mapped as opacity of the link. **Required if `links.flowAnimation.radius.scaleType` is present.**                                                                                                                                                   |
| links.flowAnimation.radius.domain          | array                     | Defines the domain for opacity. **Not Required.** _If not present the domain is calculated from the provided data depending on the links.flowAnimation.radius.scaleType_                                                                                                                       |
| links.flowAnimation.radius.startFromZero   | boolean                   | Defines if the domain starts from 0 or not. **Not Required. Default value: false**                                                                                                                                                                                                             |
| labels                                     | object                    | Defines the style of the label. **Not Required.** _If not present the labels are not shown close to the nodes._                                                                                                                                                                                |
| label.field                                | string                    | Defines the field in the data that will be used as the text for the labels. **Required.**                                                                                                                                                                                                      |
| tabel.billboarding                         | bool                      | Defines if the text always face the camera. **Not Required. Default value:false.**                                                                                                                                                                                                             |
| label.style                                | object                    | Defines the style of the label. **Not Required.**                                                                                                                                                                                                                                              |
| label.style.color                          | string                    | Defines the color for label. **Not Required. Default value: "#000000**                                                                                                                                                                                                                         |
| label.style.opacity                        | float                     | Defines the opacity for label. **Not Required. Default value: 1.** _Value must be between 0 and 1._                                                                                                                                                                                            |
| label.style.fontSize                       | float                     | Defines the size of label. **Not Required. Default value: 1.**                                                                                                                                                                                                                                 |
| label.style.padding                        | float                     | Defines the distance between the label and node. **Not Required. Default vaoue: 0.1**                                                                                                                                                                                                          |

### [Example JS of the Visualization](../../examples/Diagrams/ForceDirectedGraph.js)

## Data

**Datafile**: `json`

```
{
  "nodes": [
    {
      "id": "Myriel",
      "group": 1
    },
    {
      "id": "Napoleon",
      "group": 1
    },
  ]
  "links": [
    {
      "fromId": "Napoleon",
      "toId": "Myriel",
      "value": 1
    },
    {
      "fromId": "Mlle_Baptistine",
      "toId": "Myriel",
      "value": 8
    },
  ]
```
