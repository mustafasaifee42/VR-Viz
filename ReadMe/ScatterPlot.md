## ScatterPlot Component

![ScatterPlot](../imgs/ScatterPlot.png)

#### [Example](../examples/ScatterPlot.js)

#### Parameter required in `graph` variable
```
{
  'type': 'ScatterPlot',
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
    'dataFile': "data/scatterPlot.csv",
    'fileType': 'csv',
    'fieldDesc': [['sepal_length', 'number'], ['sepal_width', 'number'], ['petal_length', 'number'], ['petal_width', 'number'], ['species', 'text']]
  },
  'mark': {
    'points':{
      'type': 'sphere',     //Possible Value: 'sphere','box'
      'style': {
        'opacity': 0.4,
        'radius':{
          'scale': true,
          'scaleType': 'linear',
          'field': 'petal_width',
          'value': [0, 0.2],
        },
        'color': {
          'scale': true,
          'scaleType': 'ordinal',
          'field': 'species',
          'fill': ['red', 'green', 'blue'],
          'domain': ['setosa', 'versicolor', 'virginica'],
        },
      }
    },
    'droplines':{           //Not Compulsary
      'type': 'line',
      'xz':true,
      'yz':false,
      'xy':false,
      'style': {
        'opacity': 0.4,
        'color': {
          'scale': true,
          'scaleType': 'ordinal',
          'field': 'species',
          'fill': ['red', 'green', 'blue'],
          'domain': ['setosa', 'versicolor', 'virginica'],
        },
      }
    },
    'projections':{         //Not Compulsary
      'type': 'circle',
      'xz':false,
      'yz':true,
      'xy':true,
      'style': {
        'opacity': 0.4,
        'color': {
          'scale': true,
          'scaleType': 'ordinal',
          'field': 'species',
          'fill': ['red', 'green', 'blue'],
          'domain': ['setosa', 'versicolor', 'virginica'],
        },
        'radius':{
          'scale': true,
          'scaleType': 'linear',
          'field': 'petal_width',
          'value': [0, 0.2],
        },
      }
    }
  },
  'x': {
    'type': 'linear',
    'field': 'sepal_length',
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
    'field': 'sepal_width',
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
    'type': 'linear',
    'field': 'petal_length',
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
sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
4.7,3.2,1.3,0.2,setosa
4.6,3.1,1.5,0.2,setosa
5.0,3.6,1.4,0.2,setosa
5.4,3.9,1.7,0.4,setosa
4.6,3.4,1.4,0.3,setosa
```

#### React Component
```
<ScatterPlot 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
  x = {d.x}
  y = {d.y}
  z = {d.z}
/>
```
