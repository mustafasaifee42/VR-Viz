# TreeMap Component

![TreeMap](../imgs/TreeMap.png)

__Note: The `height` attribute in the `style` object in the graph component defines the range for the heights of the boxes.__

## `mark` Object in Graph Props
```
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
}
```

__Properties for `mark` for Tree Map__

Property|Type|Description
---|---|---
type|string|Defines type of bar that would be created. __Not Required. Default value: box__. _Available values: box._
class|function|Returns the class (html class) for the boxes as a function of the data. If space in present then the 2 string with space in between will be taken as different classes. Classes cannot begin with a number and nust not contain any special characters expect _. This can be used for animating or creating interactions with the boxes. __Not Required.__
id|function|Returns the id (html id) for the boxes as a function of the data. If space in present then the 2 string with space in between will be taken as different id. ids cannot begin with a number and nust not contain any special characters expect _. No 2 ids must be same as id acts as a unique identifier. This can be used for animating or creating interactions with the boxes. __not Required.__ 
style|object|Defines the style for the planes. __Required.__
style.paddingInner|float|Defines the inner padding for the boxes i.e. the padding between the boxes belonging to the same category. __Required.__
style.paddingOuter|float|Defines the outer padding the boxes i.e. the padding between the boxes belonging to the different category. __Required.__
style.extrusion|object|Defines the height of the boxes. __Required.__
style.extrusion.scaleType|string|Defines the scale type for extrusion of the boxes shapes. __Required.__ _Available values: linear or ordinal._
style.extrusion.field|string|Defines the field in the data that will be mapped as height of the box. __Required.__
style.extrusion.domain|array|Defines the domain for height. __Not Required.__ _If not present the domain is calculated from the provide data depending on the style.extrusion.scaleType_
style.fill|object|Defines the fill of the box. __Required.__
style.fill.opacity|float|Defines the opacity of the box. __Required.__ _Value must be between 0 and 1._
style.fill.scaleType|string|Defines the scale type for fill of the box. __Not Required. If not present then a constant color that is defined is filled in the box.__ _Available values: linear or ordinal._
style.fill.field|string|Defines the field in the data that will be mapped as fill of the box. __Required if `style.fill.scaleType` is present.__
style.fill.domain|array|Defines the domain for fill. __Not Required.__ _If not present the domain is calculated from the provide data depending on the style.fill.scaleType_
style.fill.color|array or string|Defines the color for fill. __Not Required if style.fill.scaleType is present, else required. Default value: d3.schemeCategory10__ _If style.fill.scaleType is not present the this needs to be a string otherwise an array._
style.fill.startFromZero|boolean|Defines if the domain starts from 0 or not. __Not Required. Default value: false__ _Only applicable if style.fill.color is not given and style.fill.scaleType is `linear`._
mouseOver|Object|Defines the mouseOver effect on the bars. __Not Required.__ _If not present no mouse over effect happens._
mouseOver.focusedObject|object|Defines the style for the mouseOver effect on the bar. __Required.__
mouseOver.focusedObject.opacity|float|Defines the opacity of bar when mouse hovers on it. __Required.__
mouseOver.focusedObject.fill|string|Defines the color of bar when mouse hovers on it. __Required.__
mouseOver.nonFocusedObject|object|Defines the style for the bar not in focus. __Required.__
mouseOver.nonFocusedObject.opacity|float|Defines the opacity of bar which are not in focus when mouse hovers on a particular bar. __Required.__
mouseOver.label|object|Defines the value and style of the mouse over text. __Not Required.__ _If not present the label is not shown._
mouseOver.label.value|function|Returns the value of the text that is to be shown in the label. __Required.__ _\n can be used for new line._
mouseOver.label.align|string|Defines the alignment of the text in the label. __Required.__ _Available values: center, left or right._
mouseOver.label.fontColor|string|Defines the color of the text in the label. __Required.__
mouseOver.label.lineHeight|float|Defines the line height of the text in the label. __Not Required.__
mouseOver.label.wrapCount|int|Defines the wrap count of the text in the label. __Not Required.__
mouseOver.label.backgroundColor|string|Defines the color of the background of the label. __Required.__
mouseOver.label.backgroundOpacity|string|Defines the color of the background of the label. __Required.__
mouseOver.label.position|string|Defines the position of the label w.r.t the cursor. __Not Required. Format is "0 0 0".__
mouseOver.label.rotation|string|Defines the rotation of the label w.r.t the cursor. __Not Required. Format is "90 0 0".__
mouseOver.label.width|float|Defines the width of the label. __Not Required.__
mouseOver.label.height|float|Defines the height of the label. __Not Required.__

### [Example JS of the Visualization](../examples/TreeMap.js)

## Data

**Datafile**: `json`

```
{
  "name": "flare",
  "children": [
    {
      "name": "analytics",
      "children": [
        {
          "name": "cluster",
          "children": [
            {
              "name": "AgglomerativeCluster",
              "size": 3938
            },
            {
              "name": "CommunityStructure",
              "size": 3812
            },
            {
              "name": "HierarchicalCluster",
              "size": 6714
            },
            {
              "name": "MergeEdge",
              "size": 743
            }
          ]
        },
        {
          "name": "graph",
          "children": [
            {
              "name": "BetweennessCentrality",
              "size": 3534
            },
            {
              "name": "LinkDistance",
              "size": 5731
            },
            {
              "name": "MaxFlowMinCut",
              "size": 7840
            },
            {
              "name": "ShortestPaths",
              "size": 5914
            },
            {
              "name": "SpanningTree",
              "size": 3416
            }
          ]
        },
        {
          "name": "optimization",
          "children": [
            {
              "name": "AspectRatioBanker",
              "size": 7074
            }
          ]
        }
      ]
    },
  ]
}
```
