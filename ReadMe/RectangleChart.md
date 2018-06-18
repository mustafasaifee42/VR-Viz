# Rectangle Chart Component

![RectangleChart](../imgs/RectangleChart.png)

## `mark` Object in Graph Props
```
'mark': {
  'position': {
    'x': {
      'scaleType': 'ordinal',
      'field': 'Year',
    },
  },
  'type': 'box',
  'style': {
    'width': 0.2,
    'depth': {
      'scaleType': 'linear',
      'field': 'Deaths',
    },
    'height': {
      'scaleType': 'linear',
      'field': 'Tornadoes',
    },
    'fill': {
      'opacity': 0.4,
      'scaleType': 'ordinal',
      'field': 'Type',
      'color': ['red', 'green'],
    },
  }
}
```

__Properties for `mark` for Rectangle Chart__

Property|Type|Description
---|---|---
type|string|Defines type of bar that would be created. __Not Required. Default value: box__. _Available values: box._
position|object|Defines the how the position of bars will be mapped. __Required__
position.x|object|__Required.__
position.x.scaleType|float|Defines the scale type for x position of the bar. __Required.__ _Available values: ordinal._
position.x.field|string|Defines the field in the data that will be mapped as x position of the bar. __Required.__
position.x.domain|float|Defines the domain for x position. __Not Required.__ _If not present the domain is calculated from the provide data depending on the position.x.scaleType._
position.x.startFromZero|boolean|Defines if the domain starts from 0 or not. __Not Required. Default value: false__ _Only applicable if position.x.domain is not given and position.x.scaleType is `linear`._
style|object|Defines the style for the bar. __Required.__
style.padding|object|Defines the spacing between the bar. __Required.__ 
style.padding.x|object|Defines the spacing between the bar along x axis. __Required.__ _Value must be between 0 and 1._
style.width|float|Defines the width of the bar. __Required if `type` is `box`.__ 
style.depth|object|Defines the depth of the bar.  __Required if `type` is `box`.__ 
style.depth.scaleType|string|Defines the scale type for depth of the bar. __Required.__ _Available values: linear or ordinal._
style.depth.field|string|Defines the field in the data that will be mapped as depth of the bar. __Required.__
style.depth.domain|array|Defines the domain for depth. __Not Required.__ _If not present the domain is calculated from the provide data depending on the style.depth.scaleType_
style.depth.startFromZero|boolean|Defines if the domain starts from 0 or not. __Not Required. Default value: false__ _Only applicable if style.depth.domain is not given and style.depth.scaleType is `linear`._
style.height|object|Defines the height of the bar. __Required.__
style.height.scaleType|string|Defines the scale type for height of the bar. __Required.__ _Available values: linear or ordinal._
style.height.field|string|Defines the field in the data that will be mapped as height of the bar. __Required.__
style.height.domain|array|Defines the domain for height. __Not Required.__ _If not present the domain is calculated from the provide data depending on the style.height.scaleType_
style.height.startFromZero|boolean|Defines if the domain starts from 0 or not. __Not Required. Default value: false__ _Only applicable if style.height.domain is not given and style.height.scaleType is `linear`._
style.fill|object|Defines the fill of the bar. __Required.__
style.fill.opacity|float|Defines the opacity of the bar. __Required.__ _Value must be between 0 and 1._
style.fill.scaleType|string|Defines the scale type for fill of the bar. __Not Required. If not present then a constant color that is defined is filled in the bar.__ _Available values: linear or ordinal._
style.fill.field|string|Defines the field in the data that will be mapped as fill of the bar. __Required if `style.fill.scaleType` is present.__
style.fill.domain|array|Defines the domain for fill. __Not Required.__ _If not present the domain is calculated from the provide data depending on the style.fill.scaleType_
style.fill.color|array or string|Defines the color for fill. __Not Required if style.fill.scaleType is present, else required. Default value: d3.schemeCategory10__ _If style.fill.scaleType is not present the this needs to be a string otherwise an array._
style.fill.startFromZero|boolean|Defines if the domain starts from 0 or not. __Not Required. Default value: false__ _Only applicable if style.fill.color is not given and style.fill.scaleType is `linear`._

_Note: The width of the bar is calculated depending upon the dimensions of the graph and padding in between the bars._

### [Example JS of the Visualization](../examples/RectangleChart.js)

## Data

**Datafile**: `csv`

```
Year,Tornadoes,Deaths,Type
1996,35,1,1
1997,14,1,2
1998,71,0,1
1999,177,12,2
```
