## FlowMap Component

![FlowMap](../imgs/FlowMap.png)

#### Parameter required in `graph` variable
```
{
  'type': 'FlowMap',
  'data': {
    'dataFile': "data/flowMap.csv",
    'fileType': 'csv',
    'fieldDesc': [['source_latitude', 'number'], ['source_longitude', 'number'], ['target_latitude', 'number'], ['target_longitude', 'number'], ['value', 'number']]
  },
  'style': {
    'origin': [0, 0, 0],
  },
  'mark': {
    'map':{
      'data': mapData,              //GeoJson object of map
      'projection': 'Mercator',     //Possible value: 'Mercator','Robinson','Gall-Peter','Winkel-Tripel','Equirectangular','Natural Earth1'
      'shapeIdentifier':'id',       //Identifier of shapes in GeoJson map data
      'style': {
        'scale': 20,
        'position': [5, 5],
        'rotation': '-90 0 0',
        'opacity': 1,
        'extrusion':{
          'value':0.000001,
        },
        'color': {
          'fill': 'red',
        },
      },
    },
    'flowlines':{
      'style': {
        'opacity': {
          'scale':false,
          'value':0.4,
        },
        'color': {
          'scale': false,
          'fill': 'red',
        },
      },
      'height': {
        'scale': true,
        'field': 'value',
        'scale': 1,
      }
    }
  },
}
```

#### DataFile

**Datafile**: `csv`

The data file must have the source and target header values as **source_latitude**,**source_longitude**,**target_latitude**,**target_longitude**.

```
source_latitude,source_longitude,target_latitude,target_longitude,value
42.546245,1.601554,23.424076,53.847818,3.148977637
33.93911,67.709953,17.060816,-61.796428,7.260326865
18.220554,-63.068615,41.153332,20.168331,9.61927466
```

#### React Component
```
<FlowMap 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
/>
```
