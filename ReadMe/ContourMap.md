ContourMap Component

<ContourMap 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
  heightThreshold = {heightThreshold}
/>

visualization={
  [
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
  ]
}