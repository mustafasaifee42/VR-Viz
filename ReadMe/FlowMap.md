FlowMap Component

<FlowMap 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
/>


visualization={
  [
    {
      'type': 'FlowMap',
      'data': {
        'dataFile': "data/flowMap.csv",
        'fileType': 'csv',
        'fieldDesc': [['source_latitude', 'number'], ['source_longitude', 'number'], ['target_latitude', 'number'], ['target_longitude', 'number'], ['value', 'number']]
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
              'value':0.000001,
            },
            'color': {
              'fill': 'red',
            },
          },
        },
        'flowlines':{
          'style': {
            'opacity': {
              'scale':false,
              'value':0.4,
            },
            'color': {
              'scale': false,
              'fill': 'red',
            },
          },
          'height': {
            'scale': true,
            'field': 'value',
            'scale': 1,
          }
        }
      },
    }
  ]
}