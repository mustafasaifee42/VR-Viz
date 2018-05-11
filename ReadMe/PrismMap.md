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
      'data': mapData,              //GeoJson object of map
      'projection': 'Mercator',     //Possible value: 'Mercator','Robinson','Gall-Peter','Winkel-Tripel','Equirectangular','Natural Earth1'
      'shapeIdentifier':'id',       //Identifier of shapes in GeoJson map data. This identifier must be present in the data from the datasheet.
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

#### DataFile

**Datafile**: `csv`

The data file must have **latitude**, **longitude** as the header values.

```
id,value,colorValue
004,6.769927552817786,1
024,6.860288838552762,5
008,6.492813386791552,3
```

#### React Component
```
<PrismMap 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
/>
```
