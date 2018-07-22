import { ResourceLocation, ResourceManager } from 'minecraft-resource-manager'
import * as THREE from 'three'
import { Object3D } from 'three';

export interface Vec3 extends Array<number> {
    [0]: number
    [1]: number
    [2]: number
}
export enum Direction {
    up = 'up',
    down = 'down',
    north = 'north',
    south = 'south',
    west = 'west',
    east = 'east'
}
export interface Display {
    thirdperson_righthand: Transform
    thirdperson_lefthand: Transform
    firstperson_righthand: Transform
    firstperson_lefthand: Transform
    gui: Transform
    head: Transform
    ground: Transform
    fixed: Transform
}
export interface Element {
    /**
     * Start point of a cube according to the scheme [x, y, z]. Values must be between -16 and 32.
     */
    from: number[]
    /**
     * Stop point of a cube according to the scheme [x, y, z]. Values must be between -16 and 32.
     */
    to: number[]
    /**
     * Defines the rotation of an element.
     */
    rotation?: {
        /**
         * Sets the center of the rotation according to the scheme [x, y, z], defaults to [8, 8, 8].
         */
        origin: number[]
        /**
         * Specifies the direction of rotation, can be "x", "y" or "z".
         */
        axis: 'x' | 'y' | 'z'
        /**
         * Specifies the angle of rotation. Can be 45 through -45 degrees in 22.5 degree increments. Defaults to 0.
         */
        angle: number
        /**
         * Specifies whether or not to scale the faces across the whole block. Can be true or false. Defaults to false.
         */
        rescale: boolean
    }
    /**
     * Defines if shadows are rendered (true - default), not (false).
     */
    shade?: boolean
    faces?: {
        up?: Face
        down?: Face
        north?: Face
        south?: Face
        east?: Face
        west?: Face
    }
}
export interface Face {
    /**
     * Defines the area of the texture to use according to the scheme [x1, y1, x2, y2]. If unset, it defaults to values equal to xyz position of the element. The texture behavior will be inconsistent if UV extends below 0 or above 16. If the numbers of x1 and x2 are swapped (e.g. from 0, 0, 16, 16 to 16, 0, 0, 16), the texture will be flipped. UV is optional, and if not supplied it will automatically generate based on the element's position.
     */
    uv?: number[]

    /**
     * Specifies the texture in form of the texture variable prepended with a #.
     */
    texture: string
    /**
     * Specifies whether a face does not need to be rendered when there is a block touching it in the specified position. The position can be: down, up, north, south, west, or east. It will also determine which side of the block to use the light level from for lighting the face, and if unset, defaults to the side.
     */
    cullface?: Direction

    /**
     * Rotates the texture by the specified number of degrees. Can be 0, 90, 180, or 270. Defaults to 0. Rotation does not affect which part of the texture is used. Instead, it amounts to permutation of the selected texture vertexes (selected implicitly, or explicitly though uv).
     */
    rotation?: 0 | 90 | 180 | 270
    /**
     * Determines whether to tint the texture using a hardcoded tint index. The default is not using the tint, and any number causes it to use tint. Note that only certain blocks have a tint index, all others will be unaffected.
     */
    tintindex?: number
}
export interface Transform {
    /**
     * Specifies the rotation of the model according to the scheme [x, y, z].
     */
    rotation: Vec3
    /**
     *  Specifies the position of the model according to the scheme [x, y, z]. If the value is greater than 80, it is displayed as 80. If the value is less then -80, it is displayed as -80.
     */
    translation: Vec3
    /**
     * Specifies the scale of the model according to the scheme [x, y, z]. If the value is greater than 4, it is displayed as 4.
     */
    scale: Vec3
}

export interface Model {
    /**
     * For Block:
     * 
     * Loads a different model from the given path, starting in assets/minecraft/models. If both "parent" and "elements" are set, the "elements" tag overrides the "elements" tag from the previous model.
     * Can be set to "builtin/generated" to use a model that is created out of the specified icon. Note that only the first layer is supported, and rotation can only be achieved using block states files.
     * 
     * For Item:
     * 
     * Loads a different model from the given path, starting in assets/minecraft/models. If both "parent" and "elements" are set, the "elements" tag overrides the "elements" tag from the previous model.
     * Can be set to "builtin/generated" to use a model that is created out of the specified icon.
     * Can be set to "builtin/entity" to load a model from an entity file. As you can not specify the entity, this does not work for all items (only for chests, ender chests, mob heads, shields and banners).
     * Needs to be set to "builtin/compass" or "builtin/clock" for the compass and the clock.
     */
    parent?: string

    ambientocclusion?: boolean
    /**
     * Holds the different places where item models are displayed.
     */
    display?: Display
    /**
     * Holds the textures of the model. Each texture starts in assets/minecraft/textures or can be another texture variable.
     */
    textures?: {
        /**
         * What texture to load particles from. This texture is used if you are in a nether portal. Note: All breaking particles from non-model blocks are hard-coded.
         */
        particle?: string
        [variant: string]: string | undefined
    }

    /**
     * Contains all the elements of the model. they can only have cubic forms. If both "parent" and "elements" are set, the "elements" tag overrides the "elements" tag from the previous model.
     */
    elements?: Element[]
    /**
     * Determines cases which a different model should be used based on item tags. All cases are evaluated in order from top to bottom and last predicate that mathches will override. However, overrides are ignored if it has been already overriden once, for example this avoids recursion on overriding to the same model.
     */
    overrides?: {
        /**
         * predicate: Holds the cases.
         */
        prediction: { [attribute: string]: number }
        /**
         * The path to the model to use if the case is met, starting in assets/minecraft/models/
         */
        model: string
    }[]
}

export interface ResolvedModel extends Pick<Model, 'display' | 'elements' | 'textures' | 'ambientocclusion' | 'overrides'> {
    ambientocclusion: boolean
    /**
     * Holds the different places where item models are displayed.
     */
    display: Display
    /**
     * Holds the textures of the model. Each texture starts in assets/minecraft/textures or can be another texture variable.
     */
    textures: {
        /**
         * What texture to load particles from. This texture is used if you are in a nether portal. Note: All breaking particles from non-model blocks are hard-coded.
         */
        particle?: string
        [variant: string]: string | undefined
    }

    /**
     * Contains all the elements of the model. they can only have cubic forms. If both "parent" and "elements" are set, the "elements" tag overrides the "elements" tag from the previous model.
     */
    elements: Element[]
}


const DEFAULT_TRANSFORM: Transform = {
    rotation: [0, 0, 0],
    translation: [0, 0, 0],
    scale: [1, 1, 1],
}
export const DEFAULT_DISPLAY: Display = {
    ground: DEFAULT_TRANSFORM,
    gui: DEFAULT_TRANSFORM,
    thirdperson_lefthand: DEFAULT_TRANSFORM,
    thirdperson_righthand: DEFAULT_TRANSFORM,
    firstperson_lefthand: DEFAULT_TRANSFORM,
    firstperson_righthand: DEFAULT_TRANSFORM,
    fixed: DEFAULT_TRANSFORM,
    head: DEFAULT_TRANSFORM,
}
export const BUILTIN_GENERATED: ResolvedModel = {
    display: DEFAULT_DISPLAY,
    ambientocclusion: false,
    textures: {},
    elements: [{
        from: [0, 0, 0],
        to: [16, 16, 16],
        faces: {
            down: { uv: [0, 0, 16, 16], texture: '' }
        }
    }],
    overrides: []
}
const TRANSPARENT_MATERIAL = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, alphaTest: 0.5 })
export class BakedModel extends THREE.Object3D {
    animationLoop: boolean = false
    displayOption: Display = DEFAULT_DISPLAY

    applyDisplay(option: string) {
        const group = this.children[0]

        if (option == 'block') {

            // reset transformations
            group.rotation.set(0, 0, 0)
            group.position.set(0, 0, 0)
            group.scale.set(1, 1, 1)

        } else {
            if (!this.displayOption.hasOwnProperty(option))
                throw new Error('Display option is invalid.')

            const options = (this.displayOption as any)[option]

            const rot = options.rotation
            const pos = options.translation
            const scale = options.scale

            // apply transformations
            group.rotation.set(rot[0] * Math.PI / 180, rot[1] * Math.PI / 180, rot[2] * Math.PI / 180)
            group.position.set(pos[0], pos[1], pos[2])
            group.scale.set(scale[0] == 0 ? 0.00001 : scale[0], scale[1] == 0 ? 0.00001 : scale[1], scale[2] == 0 ? 0.00001 : scale[2])
        }
    }

    getCenter() {
        const group = this.children[0]

        // compute absolute bounding box
        const box = {
            minx: 0, miny: 0, minz: 0,
            maxx: 0, maxy: 0, maxz: 0
        }

        for (let i = 0; i < group.children.length; i++) {

            const pivot = group.children[i]
            const mesh = pivot.children[0] as THREE.Mesh
            const geo = mesh.geometry as THREE.BoxGeometry

            for (let j = 0; j < geo.vertices.length; j++) {

                // convert vertex coordinates to world coordinates
                const vertex = geo.vertices[j].clone()
                const abs = mesh.localToWorld(vertex)

                // update bounding box

                if (abs.x < box.minx) box.minx = abs.x
                if (abs.y < box.miny) box.miny = abs.y
                if (abs.z < box.minz) box.minz = abs.z

                if (abs.x > box.maxx) box.maxx = abs.x
                if (abs.y > box.maxy) box.maxy = abs.y
                if (abs.z > box.maxz) box.maxz = abs.z
            }
        }

        // return the center of the bounding box

        return new THREE.Vector3(
            (box.minx + box.maxx) / 2,
            (box.miny + box.maxy) / 2,
            (box.minz + box.maxz) / 2
        )
    }
}

export class ThreeModelLoader {
    constructor(readonly manager: ResourceManager, readonly option: { clipUVs?: boolean, modelOnly?: boolean } = {}) { }

    async resolveModel(modelPath: string): Promise<ResolvedModel | undefined> {
        const res = await this.manager.load(ResourceLocation.ofModelPath(modelPath))
        if (!res) return undefined
        const raw = JSON.parse(res.data) as Model

        if (!raw.textures) raw.textures = {}

        if (raw.parent) {
            const parentModel = await this.resolveModel(raw.parent)
            if (!parentModel) throw new Error(`Missing parent model ${raw.parent} for ${location.toString()}`)
            if (!raw.elements) raw.elements = parentModel.elements
            if (!raw.ambientocclusion) raw.ambientocclusion = parentModel.ambientocclusion
            if (!raw.display) raw.display = parentModel.display
            if (!raw.overrides) raw.overrides = parentModel.overrides

            if (parentModel.textures) Object.assign(raw.textures, parentModel.textures)
        }

        raw.ambientocclusion = raw.ambientocclusion || false
        raw.overrides = raw.overrides || []

        delete raw.parent

        const o = new Object3D()
        o.applyMatrix

        return raw as ResolvedModel
    }

    async bakeModel(model: ResolvedModel) {
        const clipUVs = this.option ? this.option.clipUVs || false : false
        const modelOnly = this.option ? this.option.modelOnly || false : false

        const obj = new BakedModel()
        const materials: THREE.MeshMaterialType[] = []
        const group = new THREE.Group()
        group.name = 'wrapper'

        const materialIndex: { [variant: string]: number } = {}
        const materialPathIndex: { [texPath: string]: number } = {}
        materials.push(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, alphaTest: 0.5 }))

        /**
         * Build material 
         */

        // dfs search to flat the texture "tree"
        for (const variant of Object.keys(model.textures)) {
            const find = () => {
                let path = model.textures[variant] as string
                while (path.startsWith('#')) {
                    const next = model.textures[path.substring(1, path.length)]
                    if (!next) {
                        materialIndex[variant] = 0 // transparent material
                        return undefined
                    }
                    path = next
                }
                return path
            }

            const path = find()
            if (!path) continue

            if (materialPathIndex[path] !== undefined) { // if we have loaded the material
                materialIndex[variant] = materialPathIndex[path]
            } else {
                const load = await this.manager.load(ResourceLocation.ofTexturePath(path), 'base64')
                console.log('texture')
                console.log(load)
                if (!load) throw new Error(`Cannot find texture @${path}`)

                // build new material 
                const loader = new THREE.TextureLoader()
                const texture = loader.load(`data:image/png;base64,${load.data}`)

                // sharp pixels and smooth edges
                texture.magFilter = THREE.NearestFilter
                texture.minFilter = THREE.LinearFilter

                materialIndex[variant] = materials.length
                materialPathIndex[path] = materials.length

                // map texture to material, keep transparency and fix transparent z-fighting

                materials.push(new THREE.MeshLambertMaterial({ map: texture, transparent: true, alphaTest: 0.5 }))
            }
        }


        for (const element of model.elements) {
            // checkElement(element)
            // get dimensions and origin
            const width = element['to'][0] - element['from'][0]
            const height = element['to'][1] - element['from'][1]
            const length = element['to'][2] - element['from'][2]

            const origin = {
                x: (element['to'][0] + element['from'][0]) / 2 - 8,
                y: (element['to'][1] + element['from'][1]) / 2 - 8,
                z: (element['to'][2] + element['from'][2]) / 2 - 8
            }

            const fix = 0.001
            const blockGeo = new THREE.BoxGeometry(width + fix, height + fix, length + fix)
            const mesh = new THREE.Mesh(blockGeo, materials)
            mesh.name = 'element-mesh'

            blockGeo.faceVertexUvs[0] = []

            mesh.position.x = origin.x
            mesh.position.y = origin.y
            mesh.position.z = origin.z

            const faces = ['east', 'west', 'up', 'down', 'south', 'north']
            for (let i = 0; i < 6; i++) {
                const face = (element.faces as any)[faces[i]] as Required<Face>
                /**
                 * bake face start
                 */
                if (face) {
                    // get material index
                    const midx = materialIndex[face.texture.substring(1, face.texture.length)]  // references.indexOf(ref[0] == '#' ? ref.substring(1) : ref)
                    // todo: could the face's texture be a path?

                    blockGeo.faces[i * 2].materialIndex = midx
                    blockGeo.faces[i * 2 + 1].materialIndex = midx

                    let uv = face.uv || [0, 0, 16, 16]
                    // check
                    if (clipUVs) {
                        // uv.forEach(function (e, pos) { if (typeof e != 'number') throw new Error('The "uv" property for "' + face + '" face in element "' + index + '" is invalid (got "' + e + '" at index "' + pos + '").') })
                        uv = uv.map((e) => {
                            if (e + 0.00001 < 0) return 0
                            else if (e - 0.00001 > 16) return 16
                            else return e
                        })
                    } else {
                        // uv.forEach(function (e, pos) { if (typeof e != 'number' || e + 0.00001 < 0 || e - 0.00001 > 16) throw new Error('The "uv" property for "' + face + '" face in element "' + index + '" is invalid (got "' + e + '" at index "' + pos + '").') })
                    }
                    uv = uv.map(e => e / 16)

                    // fix edges
                    uv[0] += 0.0005
                    uv[1] += 0.0005
                    uv[2] -= 0.0005
                    uv[3] -= 0.0005

                    let map = [
                        new THREE.Vector2(uv[0], 1 - uv[1]),
                        new THREE.Vector2(uv[0], 1 - uv[3]),
                        new THREE.Vector2(uv[2], 1 - uv[3]),
                        new THREE.Vector2(uv[2], 1 - uv[1])
                    ]

                    if (face.rotation) {
                        const amount = face.rotation
                        // check property
                        // if (!([0, 90, 180, 270].indexOf(amount) >= 0))
                        //     throw new Error('The "rotation" property for "' + face + '" face in element "' + index + '" is invalid (got "' + amount + '").')

                        // rotate map
                        for (let j = 0; j < amount / 90; j++) {
                            map = [map[1], map[2], map[3], map[0]]
                        }

                    }

                    blockGeo.faceVertexUvs[0][i * 2] = [map[0], map[1], map[3]]
                    blockGeo.faceVertexUvs[0][i * 2 + 1] = [map[1], map[2], map[3]]
                } else {
                    // transparent material
                    blockGeo.faces[i * 2].materialIndex = 0
                    blockGeo.faces[i * 2 + 1].materialIndex = 0

                    const map = [
                        new THREE.Vector2(0, 0),
                        new THREE.Vector2(1, 0),
                        new THREE.Vector2(1, 1),
                        new THREE.Vector2(0, 1)
                    ]

                    blockGeo.faceVertexUvs[0][i * 2] = [map[0], map[1], map[3]]
                    blockGeo.faceVertexUvs[0][i * 2 + 1] = [map[1], map[2], map[3]]
                }
                /**
                 * bake face end
                 */
            }

            /**
             * bake rotation start
             */
            if (element.rotation) {
                // get origin, axis and angle
                const rotationOrigin = {
                    x: element.rotation.origin[0] - 8,
                    y: element.rotation.origin[1] - 8,
                    z: element.rotation.origin[2] - 8
                }

                const axis = element.rotation.axis
                const angle = element.rotation.angle


                // create pivot
                const pivot = new THREE.Group()
                pivot.name = 'pivot'
                pivot.position.x = rotationOrigin.x
                pivot.position.y = rotationOrigin.y
                pivot.position.z = rotationOrigin.z

                pivot.add(mesh)

                // adjust mesh coordinates
                mesh.position.x -= rotationOrigin.x
                mesh.position.y -= rotationOrigin.y
                mesh.position.z -= rotationOrigin.z

                // rotate pivot
                if (axis == 'x')
                    pivot.rotateX(angle * Math.PI / 180)
                else if (axis == 'y')
                    pivot.rotateY(angle * Math.PI / 180)
                else if (axis == 'z')
                    pivot.rotateZ(angle * Math.PI / 180)

                group.add(pivot)
            } else {
                const pivot = new THREE.Group()
                pivot.name = 'pivot'
                pivot.add(mesh)
                group.add(pivot)
            }
            /**
             * bake rotation end
             */
        }
        obj.add(group)

        return obj
    }

    load(path: string) {
        return this.resolveModel(path)
            .then(r => r ? this.bakeModel(r) : Promise.resolve(undefined))
    }
}
