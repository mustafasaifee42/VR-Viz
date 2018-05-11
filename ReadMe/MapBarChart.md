## MapBarChart Component

#### Parameter required in `graph` variable
```
{
  'type': 'MapBarChart',
  'data': {
    'dataFile': "data/mapBarChart.csv",
    'fileType': 'csv',
    'fieldDesc': [['latitude', 'number'], ['longitude', 'number'], ['value', 'number']]
  },
  'style': {
    'origin': [0, 0, 0],
  },
  'mark': {
    'map':{
      'data': mapData,
      'projection': 'Mercator',
      'shapeIdentifier':'id',
      'style': {
        'scale': 20,
        'position': [5, 5],
        'rotation': '-90 0 0',
        'opacity': 1,
        'extrusion':{
          'value': 0.0000001,
        },
        'color': {
          'scale':false,
          'fill': 'green',
        },
      },
    },
    'bars':{
      'type': 'box',
      'style': {
        'depth': 0.2,
        'width': 0.2,
        'height': {
          'scale': true,
          'scaleType': 'linear',
          'field': 'value',
          'value': [0,5],
        },
        'opacity': 0.4,
        'color': {
          'scale': true,
          'scaleType': 'linear',
          'field': 'value',
          'fill': ['green', 'blue'],
        },
      }
    },
  },
}
```

#### React Component
```
<MapBarChart 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
/>
```
