## Bargraph Component

![Bargraph](../imgs/BarGraph.png)

#### Parameter required in `graph` variable
```
{
  'type': 'BarGraph',
  'data': {
    'dataFile': "data/barGraph.csv",
    'fileType': 'csv',
    'fieldDesc': [['Year', 'text'], ['Month', 'text'], ['Tornadoes', 'number'], ['Deaths', 'number']]
  },
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
  'mark': {
    'bars':{
      'type': 'box',    //Possible values: 'box','cylinder','cone'
      'style': {
         /*
         
         if the 'type' is 'cylinder'
         'radius': 0.2,
         'segments': 8,
         
         if the 'type' is 'cone'
         'radiusBottom': 0.2,
         'radiusTop': 0,
         'segments': 8,
         
         */
         
         // if the 'type' is 'box'
        'depth': 0.2,
        'width': 0.2,
        
        'opacity': 0.4,
        'color': {
          'scale': true,
          'scaleType': 'linear',
          'field': 'Deaths',
          'fill': ['red', 'green'],   //If 'scale' is false 'fill' is not an array but a single value
        },
      }
    }
  },
  'x': {
    'type': 'ordinal',
    'field': 'Month',
    'range':[0,10],   //If the 'range' is not mentioned the default range is [0,width of the graph]
    'domain': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],   //If the 'domain' is not mentioned the default domain is created using the data and type
    'axis': {
      'axis': true,
      'orient': 1,    //Possible values: 1, 2, 3, 4
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
    'field': 'Tornadoes',
    'domain':[0,100], //If the 'domain' is not mentioned the default domain is created using the data and type. For 'type' 'linear' the domain is [minimum value of the field in the data, maximum value of the field in the data]
    'range':[0,10],   //If the 'range' is not mentioned the default range is [0,height of the graph]
    'axis': {
      'axis': true,
      'orient': 1,    //Possible values: 1, 2, 3, 4
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
    'field': 'Year',
    'range':[0,10],   //If the 'range' is not mentioned the default range is [0,depth of the graph]
    'axis': {
      'axis': true,
      'orient': 1,    //Possible values: 1, 2, 3, 4
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
Year,Month,Tornadoes,Deaths
1996,January,35,1
1996,February,14,1
1997,January,50,2
1997,February,23,1
1998,January,47,0
1998,February,72,42
1999,January,212,18
1999,February,22,0
```

#### React Component
```
<BarGraph 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
  x = {d.x}
  y = {d.y}
  z = {d.z}
/>
```
