## PointCloud Component

![PointCloud](../../imgs/PointCloud.png)

**Note: The `style` object in the graph component has an additional attribute called `objectScale` which is required. It defines the scale on which the point cloud is plotted.**

## `mark` Object in Graph Props

```
'mark': {
  'type': 'box',
  'style': {
    'radius': 0.1,
    'fill': {
      'opacity': 0.4,
      'color': 'green',
    },
  },
}
```

**Properties for `mark` for Stacked Bar Chart**

| Property                 | Type            | Description                                                                                                                                                                                                                               |
| ------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                     | string          | Defines type of point that would be created. **Not Required. Default value: sphere**. _Available values: box, sphere._                                                                                                                    |
| style                    | object          | Defines the style for the points. **Not Required.**                                                                                                                                                                                       |
| style.radius             | float           | Defines the radius of the points. **Not Required.**                                                                                                                                                                                       |
| style.fill               | object          | Defines the fill of the points. **Not Required.**                                                                                                                                                                                         |
| style.fill.opacity       | float           | Defines the opacity of the points. **Not Required. Default value: 1** _Value must be between 0 and 1._                                                                                                                                    |
| style.fill.scaleType     | string          | Defines the scale type for fill of the points. **Not Required.** _Available values: linear, ordinal. Only applicable if file used to plot the point cloud is csv._                                                                        |
| style.fill.field         | array of string | Defines the field in the data that will be mapped as fill of the bar. **Required if `style.fill.scaleType` is present.** _Only applicable if file used to plot the point cloud is csv._                                                   |
| style.fill.color         | array           | Defines the color for fill. **Not Required. Default value: #ff0000 if style.fill.scaleType is not present else d3.schemeCategory10.** _If style.fill.scaleType is not present the this needs to be a string otherwise an array._          |
| style.fill.startFromZero | boolean         | Defines if the domain starts from 0 or not. **Not Required. Default value: false** _Only applicable if style.fill.domain is not given and style.fill.scaleType is `linear`. Only applicable if file used to plot the point cloud is csv._ |

### [Example JS of the Visualization](../../examples/Diagrams/PointCloud.js)

## Data

**Datafile**: `csv` or `ply`

If the file is csv it must have **x**, **y**, **z** as the header.

```
x,y,z
42.546245,1.601554,3.148977637
23.424076,53.847818,9.563725062
33.93911,67.709953,7.260326865
```
