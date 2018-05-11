## PrismMap Component

#### Parameter required in `graph` variable
```
{
  'type': 'PrismMap',
  'data': {
    'dataFile': "data/prismMapData.csv",
    'fileType': 'csv',
    'fieldDesc': [['id', 'text'], ['value', 'number'], ['colorValue', 'number']]
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
          'scale':true,
          'scaleType': 'linear',
          'field': 'value',
          'value':[0, 5],
        },
        'color': {
          'scale':true,
          'scaleType': 'ordinal',
          'field': 'colorValue',
          'fill': ['green', 'blue', 'red', 'yellow', 'magenta', 'cyan'],
        },
      },
    },
  },
}
```

#### React Component
```
<PrismMap 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
/>
```
