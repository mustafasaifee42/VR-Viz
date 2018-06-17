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
