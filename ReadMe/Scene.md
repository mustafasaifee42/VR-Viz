## Scene Variable

#### Parameter required in `scene` variable
```
{
  'sky': {
    'style': {
      'color': '#ccc',
      'texture':false,
      'img':'test.jpg',            //only required and applicable if 'texture' is true
    }
  },
  'lights': [                      //multiple light source can be added in the array
    {
      'type': 'directional',       //possible values: 'ambient', 'directional', 'point'
      'color': '#fff',
      'position': '0 1 1',
      'intensity': 1,
      "decay": 1,
    },
    {
      'type': 'ambient',           // 'ambient' light type does not require position parameter
      'color': '#fff',
      'intensity': 1,
      "decay": 1,
    }
  ],
  'camera': {
    'position': '0 0 10',
    'rotation': '0 0 0',
  },
  'floor': {                       //'floor' is not a required parameter
    'style': {
      'color': '#ccc',
      'texture':false,
      'img':'test.jpg',            //only required and applicable if 'texture' is true
      'width': 10,
      'height': 10,
    }
  }
}
```
