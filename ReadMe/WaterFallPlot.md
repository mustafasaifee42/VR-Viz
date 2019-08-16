# WaterfallPlot Component

![WaterfallPlot](../imgs/WaterFallPlot.png)

## `mark` Object in Graph Props
```
'mark': {
  'position': {
    'x': {
      'scaleType': 'ordinal',
      'domain': ['-10', '0', '10']
    },
    'y': {
      'scaleType': 'linear',
    },
    'z': {
      'scaleType': 'ordinal',
      'field': 'Alpha'
    }
  },
  'style': {
    'stroke': {
      'color': 'black',
      'width': 2,
    },
    'fill': {
      'color': 'red',
      'opacity': 0.5,
    }
  }
}
```

__Properties for `mark` for Parametric Waterfall Plot__

Property|Type|Description
---|---|---
position|object|Defines the how the position of vertices for contour will be mapped. __Required__
position.x|object|__Required.__
position.x.scaleType|string|Defines the scale type for x position of the points on the mesh. __Required.__ _Available values: linear or ordinal._
position.x.domain|float|Defines the domain for x position. __Not Required.__ _If not present the domain is calculated from the provide data depending on the position.x.scaleType._
position.x.startFromZero|boolean|Defines if the domain starts from 0 or not. __Not Required. Default value: false__ _Only applicable if position.x.domain is not given and position.x.scaleType is `linear`._
position.y|object|__Required.__
position.y.scaleType|string|Defines the scale type for y position of the points on the mesh. __Required.__ _Available values: linear or ordinal._
position.y.domain|float|Defines the domain for y position. __Not Required.__ _If not present the domain is calculated from the provide data depending on the position.y.scaleType._
position.y.startFromZero|boolean|Defines if the domain starts from 0 or not. __Not Required. Default value: false__ _Only applicable if position.y.domain is not given and position.y.scaleType is `linear`._
position.z|object|__Required.__
position.z.scaleType|string|Defines the scale type for x position of the points on the mesh. __Required.__ _Available values: linear or ordinal._
position.z.field|string|Defines the field in the data that will be mapped as x position of the points on the mesh. __Required.__
position.z.domain|float|Defines the domain for x position. __Not Required.__ _If not present the domain is calculated from the provide data depending on the position.z.scaleType._
style|object|Defines the style of the contour. __Required__
style.fill|object|Defines the fill of the surface. __Required.__
style.fill.opacity|float|Defines the opacity of the surface. __Required.__ _Value must be between 0 and 1._
style.fill.color|string|Defines the color for fill. __Required.__
style.stroke|object|Defines the stroke for the mesh. __Not Required. If not present the mesh are not stroked.__ _This can be used to design a mesh to make the mesh more readable._
style.stroke.width|float|Defines the stroke of the mesh.  __Required.__
style.stroke.color|string|Defines the stroke color for  mesh. __Required.__
style.stroke.curveType|string|Defines the type of curver for line. Available vaules: `line` for straight line, `CatmullRomCurve` for curve and `lineSegment` for discontinuos line segments.  __Not Required.__ _Default Value: `line`._ Even if the stroke is curved the fill will remain edgy, therefore it is advisable to use `style.fill.opacity` to `0` if `curveType` is `CatmullRomCurve`. 
style.stroke.resolution|number|Defines how edgy the curve for the flow is. __Not Required. Default value: 20__ _Smaller number is recommended for better performance. Only applicable if `style.stroke.curveType` is `CatmullRomCurve`_

### [Example JS of the Visualization](../examples/WaterfallPlot.js)

## Data

**Datafile**: `csv`

```
Alpha,-10,0,10
10,-0.154623,-0.154975,-0.154623
20,-0.159781,-0.159673,-0.159781
30,-0.16475,-0.177522,-0.16475
```
