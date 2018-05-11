## Scene Variable

#### Parameter required in `scene` variable
```
{
  'sky': {
    'style': {
      'color': '#ccc',
      'texture':false,
    }
  },
  'lights': [
    {
      'type': 'directional',
      'color': '#fff',
      'position': '0 1 1',
      'intensity': 1,
      "decay": 1,
    },
    {
      'type': 'ambient',
      'color': '#fff',
      'intensity': 1,
      "decay": 1,
    }
  ],
  'camera': {
    'position': '0 0 10',
    'rotation': '0 0 0',
  },
  'floor': {
    'style': {
      'color': '#ccc',
      'texture':false,
      'width': 10,
      'height': 10,
    }
  }
}
```
