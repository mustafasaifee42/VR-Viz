## ForceDirectedGraph Component

![ForceDirectedGraph](../imgs/ForceDirectedGraph.png)

#### [Example](../examples/ForceDirectedGraph.js)

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
    'labels':{                //If labels are not needed then this object can be skiped
      'field': 'id',
      'style': {
        'opacity': 1,        // Labels takes the color of node it is attached to
        'size': 1,
        'padding': 0.1,
      }
    },
  },
}
```

#### DataFile

**Datafile**: `json`

```
{
  "nodes": [
    {
      "id": "Myriel",
      "group": 1
    },
    {
      "id": "Napoleon",
      "group": 1
    },
  ]
  "links": [
    {
      "fromId": "Napoleon",
      "toId": "Myriel",
      "value": 1
    },
    {
      "fromId": "Mlle_Baptistine",
      "toId": "Myriel",
      "value": 8
    },
  ]
```

#### React Component
```
<ForceDirectedGraph 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
/>
```
