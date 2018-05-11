## PointCloud Component

![PointCloud](../imgs/PointCloud.png)

#### [Example](../examples/PointCloud.js)

#### Parameter required in `graph` variable
```
{
  'type': 'PointCloud',
  'data': {
    'dataFile': "data/PointCloud.ply",
    'fileType': 'ply',
  },
  'style': {
    'origin': [0, 0, 0],
    'scale': 0.01,        //Define the scale of the object which is modeled in the ply or csv file
  },
  'mark': {
    'points':{
      'type':'box',       //Possible values: 'box', 'sphere'
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
 ```

#### DataFile

**Datafile**: `csv` or `ply`

If the file is csv it must have **x**, **y**, **z** as the header.

```
x,y,z
42.546245,1.601554,3.148977637
23.424076,53.847818,9.563725062
33.93911,67.709953,7.260326865
```


#### React Component
```
<PointCloud 
  data = {d.data}
  style = {d.style}
  mark = {d.mark}
/>
```
