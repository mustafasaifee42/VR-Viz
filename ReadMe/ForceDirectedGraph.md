## ForceDirectedGraph Component

#### Parameter required in `graph` variable
```
{
  'type': 'ForceDirectedGraph',
  'data': {
    'dataFile': "data/ForceDirectedGraph.json",
    'fileType':'json',
  },
  'style': {
    'origin': [0, 0, 0],
    'scale': 0.1,
  },
  'mark': {
    'nodes':{
      'type':'sphere',
      'style': {
        'radius': {
          'scale': false,
          'value': 0.1,
        },
        'opacity': 1,
        'color': {
          'scale': true,
          'scaleType': 'ordinal',
          'field': 'group',
          'fill': ['green', 'blue', 'red', 'yellow', 'tomato', 'olive', 'magenta', 'cyan', 'gray', 'maroon'],
          'domain': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
      },
    },
    'links':{
      'type': 'line',
      'style': {
        'opacity':{
          'scale': false,
          'value': 0.3,
        },
        'color': {
          'scale': true,
          'scaleType': 'ordinal',
          'field': 'value',
          'fill': ['green', 'blue', 'red', 'yellow', 'tomato', 'olive', 'magenta', 'cyan', 'gray', 'maroon'],
          'domain': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
      },
    },
    'labels':{
      'field': 'id',
      'style': {
        'color': 'black',
        'opacity': 1,
        'size': 1,
        'padding': 0.1,
      }
    },
  },
}
```

#### React Component
```
<ForceDirectedGraph 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
/>
```
