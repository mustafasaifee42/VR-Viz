## StackedBargraph Component

#### Parameter required in `graph` variable
```
{
  'type': 'StackedBarGraph',
  'style': {
    'origin': [0, 0, 0],
    'dimensions': {
      'width': 10,
      'height': 10,
      'depth': 10,
    },
    'axis-box': true,
    'axis-box-color': 'black',
  },
  'data': {
    'dataFile': "data/stackedBarChart.csv",
    'fileType': 'csv',
    'fieldDesc': [['Cars', 'number'], ['Trucks', 'number'], ['Bikes', 'number'], ['Countries', 'text'], ['Quarters', 'text']]
  },
  'mark': {
    'bars':{
      'type': 'box',          //Possible values:'box', 'cylinder'
      'style': {
        'depth': 0.2,
        'width': 0.2,
        'opacity': 0.4,
        'color': {
          'scaleType': 'ordinal',
          'fill': ['green', 'blue', 'red'],
          'field': ['Cars', 'Trucks', 'Bikes'],
        },
      }
    }
  },
  'x': {
    'type': 'ordinal',
    'field': 'Quarters',
    'axis': {
      'axis': true,
      'orient': 1,
      'title': {
        'text': '',
        'font-size': 10,
        'color': 'black',
        'opacity': 1,
      },
      'ticks': {
        'no-of-ticks': 10,
        'tick-size': 0.1,
        'tick-color': 'black',
        'tick-opacity': 1,
        'grid': true,
        'grid-color': 'black',
        'grid-opacity': 1,
        'font': 'Arial',
        'font-size': 10,
      }
    },
  },
  'y': {
    'type': 'linear',
    'field': ['Cars', 'Trucks', 'Bikes'],
    'range': [0, 10],
    'axis': {
      'axis': true,
      'orient': 1,
      'title': {
        'text': '',
        'font-size': 10,
        'color': 'black',
        'opacity': 1,
      },
      'ticks': {
        'no-of-ticks': 10,
        'tick-size': 0.1,
        'tick-color': 'black',
        'tick-opacity': 1,
        'grid': true,
        'grid-color': 'black',
        'grid-opacity': 1,
        'font-size': 10,
      }
    },
  },
  'z': {
    'type': 'ordinal',
    'field': 'Countries',
    'axis': {
      'axis': true,
      'orient': 1,
      'title': {
        'text': '',
        'font-size': 10,
        'color': 'black',
        'opacity': 1,
      },
      'ticks': {
        'no-of-ticks': 10,
        'tick-size': 0.1,
        'tick-color': 'black',
        'tick-opacity': 1,
        'grid': true,
        'grid-color': 'black',
        'grid-opacity': 1,
        'font-size': 10,
      }
    },
  }
}
```

#### DataFile

**Datafile**: `csv`

```
Countries,Quarters,Cars,Trucks,Bikes
USA,First,119,143,10
Canada,First,104,30,10
Europe,First,58,83,10
Mexico,First,134,88,10
Asia,First,119,60,10
Africa,First,22,16,10
USA,Second,127,96,10
Canada,Second,31,25,10
Europe,Second,32,87,10
Mexico,Second,161,105,10
Asia,Second,141,118,10
Africa,Second,34,26,10
USA,Third,64,74,10
Canada,Third,139,87,10
Europe,Third,59,103,10
Mexico,Third,80,162,10
Asia,Third,111,128,10
Africa,Third,29,14,10
USA,Fourth,153,127,10
Canada,Fourth,70,56,10
Europe,Fourth,56,30,10
Mexico,Fourth,103,144,10
Asia,Fourth,144,169,10
Africa,Fourth,45,33,10
```

#### React Component
```
<StackedBarGraph 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
  x = {d.x}
  y = {d.y}
  z = {d.z}
/>
```
