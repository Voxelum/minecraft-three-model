# Minecraft Threejs Model

This module is a rewrite version of https://github.com/vberlier/json-model-viewer

This module is not as completed as the orignial one. It only provide the threejs model. 

This module is highly depended on the module [minecraft-resource-manager](https://github.com/InfinityStudio/minecraft-resource-manager-js)

Maybe the advantage of this module is that it provides the definitions of common Minecraft model structure. Hope this will save your brain.

## Usage

```(ts)
const manager: ResourceManager;
const loader = new ThreeModelLoader(manager);

loader.load('block/stone')
    .then((threeModel) => {
        // do sth to this three model...
    })

```

