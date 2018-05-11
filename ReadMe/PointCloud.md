PointCloud Component

<PointCloud 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
/>


visualization={
  [
    {
      'type': 'PointCloud',
      'data': {
        'dataFile': "data/PointCloud.ply",
        'fileType': 'ply',
      },
      'style': {
        'origin': [0, 0, 0],
        'scale': 0.01,
      },
      'mark': {
        'points':{
          'type':'box',
          'style': {
            'radius': 0.1,
            'opacity':0.4,
            'color': {
              'scale': false,
              'fill': 'green',
            },
          },
        },
      },
    }
  ]
}