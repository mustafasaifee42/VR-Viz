# CrossSectionView Component

![CrossSectionView](../../imgs/CrossSectionView.PNG)

## Object in Graph Props

```
'mark':{
  'material':{
    'type':'phong',
    'fill': {
      'opacity': 0.4,
      'color': '#ff0000',
      'shininess':30,
      'emissive':'#000000',
      'specular':'#ffffff',
    },
    'stroke': {
      'width': 1,
      'color': '#ffff00',
      'edgeThresholdAngle':50
    },
    'emphasisMaterial':{
      'opacity': 0.8,
      'color': '#ffff00',
      'meshes':['Adam','Eyelid'],
    },
    'highlightOnClick':{
      'opacity': 0.8,
      'color': '#ff0000',
    }
  },
  'object':'data/Duck.gltf'
}
```

**Properties for `mark` for Cross Section View**

| Property                           | Type            | Description                                                                                                                                                                                                                                                                                                         |
| ---------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| object                             | string          | Defines link to the gltf file. **Required**                                                                                                                                                                                                                                                                         |
| material                           | object          | Defines the material to be shown on the 3D model. **Required**                                                                                                                                                                                                                                                      |
| material.type                      | string          | Defines the type of material that used on the meshes of the model. If type is not mentioned than the material from the gltf file is used. **Not Required.** _Available values: normal, lambert or phong._                                                                                                           |
| material.fill                      | object          | **Required if `material.type` is present.**                                                                                                                                                                                                                                                                         |
| material.fill.color                | string          | Defines color of the meshes. **Not Required. Default value: #ff0000** _Only applicable if material.type is lambert or phong_                                                                                                                                                                                        |
| material.fill.opacity              | number          | Defines opacity of the meshes. **Not Required. Default value: 1**                                                                                                                                                                                                                                                   |
| material.fill.shininess            | number          | Defines shininess of the meshes. **Not Required. Default value: 30** _Only applicable if material.type is phong_                                                                                                                                                                                                    |
| material.fill.emmisive             | string          | Defines emmisive color of the meshes. **Not Required. Default value: #000000** _Only applicable if material.type is phong_                                                                                                                                                                                          |
| material.fill.specular             | string          | Defines specular of the meshes. **Not Required. Default value: #ffffff** _Only applicable if material.type is phong_                                                                                                                                                                                                |
| material.stroke                    | object          | Defines the stroke setting for the meshes **Not Required.** _If not present stroke will not be shown._                                                                                                                                                                                                              |
| material.stroke.width              | number          | Defines the stroke width for the meshes **Not Required. Default value: 1**                                                                                                                                                                                                                                          |
| material.stroke.color              | string          | Defines the stroke color for the meshes **Not Required. Default value: #000000**                                                                                                                                                                                                                                    |
| material.stroke.edgeThresholdAngle | number          | An edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value **Not Required. Default value: 20**                                                                                                                                                           |
| material.emphasisMaterial          | object          | Defines the emphasis setting for the meshes. This is used to highlight certain part of the model. **Not Required.**                                                                                                                                                                                                 |
| material.emphasisMaterial.opacity  | number          | Defines the opacity for the meshes which are emphasized **Not Required. Default value: 1**                                                                                                                                                                                                                          |
| material.emphasisMaterial.color    | string          | Defines the color for the meshes which are emphasized **Not Required. Default value: #ffff00** _Only applicable if material.type is lambert or phong_                                                                                                                                                               |
| material.emphasisMaterial.meshes   | array of string | Defines the names of all the meshes that need to be emphasized. It also emphasizes the meshes whose names containes a substring defined here. _For example if the array is `['box']` it will emphasize all the meshes named box and all the meshes whose name contains box like `box-1`, `box-2` etc._ **Required** |
| material.highlightOnClick          | object          | Defines the display setting for the meshes when it is clicked **Not Required.**                                                                                                                                                                                                                                     |
| material.highlightOnClick.opacity  | number          | Defines the opacity for the meshes when it is clicked **Not Required. Default value: 1**                                                                                                                                                                                                                            |
| material.highlightOnClick.color    | string          | Defines the color for the meshes when it is clicked **Not Required. Default value: #ffff00** _Only applicable if material.type is lambert or phong_                                                                                                                                                                 |

### [Example JS of the Visualization](../examples/Diagrams/CrossSectionView.js)

#### Data

**Datafile**: `gltf`
