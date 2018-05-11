## ContourMap Component

![ContourMap](../imgs/ContourMap.png)

#### [Example](../examples/ContourMap.js)

#### Parameter required in `graph` variable
```
{
  'type': 'ContourMap',
  'data': {
    'dataFile': "data/contourMapData.csv",
    'fileType': 'text',
  },
  'style': {
    'origin': [0, 0, 0],
  },
  'mark': {
    'style': {
      'opacity': 0.4,
      'color': {
        'scale': true,
        'fill': ['green', 'blue'],
      },
      'scale':{
        'ground':0.1,
        'height':0.1,
      }
    },
  },
  'heightThreshold':100,
}
```

#### DataFile

**Datafile**: `text`

The data file is without header. Rows corresponding to grid lines running east to west and columns to grid lines running south to north.

```
100,100,101,101,101
101,101,102,102,102
102,102,103,103,103
102,102,103,103,103
102,102,103,103,103
```

#### React Component
```
<ContourMap 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
  heightThreshold = {heightThreshold}
/>
```
