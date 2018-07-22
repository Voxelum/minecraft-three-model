"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var minecraft_resource_manager_1 = require("minecraft-resource-manager");
var THREE = require("three");
var three_1 = require("three");
var Direction;
(function (Direction) {
    Direction["up"] = "up";
    Direction["down"] = "down";
    Direction["north"] = "north";
    Direction["south"] = "south";
    Direction["west"] = "west";
    Direction["east"] = "east";
})(Direction = exports.Direction || (exports.Direction = {}));
var DEFAULT_TRANSFORM = {
    rotation: [0, 0, 0],
    translation: [0, 0, 0],
    scale: [1, 1, 1],
};
exports.DEFAULT_DISPLAY = {
    ground: DEFAULT_TRANSFORM,
    gui: DEFAULT_TRANSFORM,
    thirdperson_lefthand: DEFAULT_TRANSFORM,
    thirdperson_righthand: DEFAULT_TRANSFORM,
    firstperson_lefthand: DEFAULT_TRANSFORM,
    firstperson_righthand: DEFAULT_TRANSFORM,
    fixed: DEFAULT_TRANSFORM,
    head: DEFAULT_TRANSFORM,
};
exports.BUILTIN_GENERATED = {
    display: exports.DEFAULT_DISPLAY,
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
};
var TRANSPARENT_MATERIAL = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, alphaTest: 0.5 });
var BakedModel = /** @class */ (function (_super) {
    __extends(BakedModel, _super);
    function BakedModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.animationLoop = false;
        _this.displayOption = exports.DEFAULT_DISPLAY;
        return _this;
    }
    BakedModel.prototype.applyDisplay = function (option) {
        var group = this.children[0];
        if (option == 'block') {
            // reset transformations
            group.rotation.set(0, 0, 0);
            group.position.set(0, 0, 0);
            group.scale.set(1, 1, 1);
        }
        else {
            if (!this.displayOption.hasOwnProperty(option))
                throw new Error('Display option is invalid.');
            var options = this.displayOption[option];
            var rot = options.rotation;
            var pos = options.translation;
            var scale = options.scale;
            // apply transformations
            group.rotation.set(rot[0] * Math.PI / 180, rot[1] * Math.PI / 180, rot[2] * Math.PI / 180);
            group.position.set(pos[0], pos[1], pos[2]);
            group.scale.set(scale[0] == 0 ? 0.00001 : scale[0], scale[1] == 0 ? 0.00001 : scale[1], scale[2] == 0 ? 0.00001 : scale[2]);
        }
    };
    BakedModel.prototype.getCenter = function () {
        var group = this.children[0];
        // compute absolute bounding box
        var box = {
            minx: 0, miny: 0, minz: 0,
            maxx: 0, maxy: 0, maxz: 0
        };
        for (var i = 0; i < group.children.length; i++) {
            var pivot = group.children[i];
            var mesh = pivot.children[0];
            var geo = mesh.geometry;
            for (var j = 0; j < geo.vertices.length; j++) {
                // convert vertex coordinates to world coordinates
                var vertex = geo.vertices[j].clone();
                var abs = mesh.localToWorld(vertex);
                // update bounding box
                if (abs.x < box.minx)
                    box.minx = abs.x;
                if (abs.y < box.miny)
                    box.miny = abs.y;
                if (abs.z < box.minz)
                    box.minz = abs.z;
                if (abs.x > box.maxx)
                    box.maxx = abs.x;
                if (abs.y > box.maxy)
                    box.maxy = abs.y;
                if (abs.z > box.maxz)
                    box.maxz = abs.z;
            }
        }
        // return the center of the bounding box
        return new THREE.Vector3((box.minx + box.maxx) / 2, (box.miny + box.maxy) / 2, (box.minz + box.maxz) / 2);
    };
    return BakedModel;
}(THREE.Object3D));
exports.BakedModel = BakedModel;
var ThreeModelLoader = /** @class */ (function () {
    function ThreeModelLoader(manager, option) {
        if (option === void 0) { option = {}; }
        this.manager = manager;
        this.option = option;
    }
    ThreeModelLoader.prototype.resolveModel = function (modelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var res, raw, parentModel, o;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.manager.load(minecraft_resource_manager_1.ResourceLocation.ofModelPath(modelPath))];
                    case 1:
                        res = _a.sent();
                        if (!res)
                            return [2 /*return*/, undefined];
                        raw = JSON.parse(res.data);
                        if (!raw.textures)
                            raw.textures = {};
                        if (!raw.parent) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.resolveModel(raw.parent)];
                    case 2:
                        parentModel = _a.sent();
                        if (!parentModel)
                            throw new Error("Missing parent model " + raw.parent + " for " + location.toString());
                        if (!raw.elements)
                            raw.elements = parentModel.elements;
                        if (!raw.ambientocclusion)
                            raw.ambientocclusion = parentModel.ambientocclusion;
                        if (!raw.display)
                            raw.display = parentModel.display;
                        if (!raw.overrides)
                            raw.overrides = parentModel.overrides;
                        if (parentModel.textures)
                            Object.assign(raw.textures, parentModel.textures);
                        _a.label = 3;
                    case 3:
                        raw.ambientocclusion = raw.ambientocclusion || false;
                        raw.overrides = raw.overrides || [];
                        delete raw.parent;
                        o = new three_1.Object3D();
                        o.applyMatrix;
                        return [2 /*return*/, raw];
                }
            });
        });
    };
    ThreeModelLoader.prototype.bakeModel = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var clipUVs, modelOnly, obj, materials, group, materialIndex, materialPathIndex, _loop_1, this_1, _i, _a, variant, _b, _c, element, width, height, length_1, origin, fix, blockGeo, mesh, faces, i, face, midx, uv, map, amount, j, map, rotationOrigin, axis, angle, pivot, pivot;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        clipUVs = this.option ? this.option.clipUVs || false : false;
                        modelOnly = this.option ? this.option.modelOnly || false : false;
                        obj = new BakedModel();
                        materials = [];
                        group = new THREE.Group();
                        group.name = 'wrapper';
                        materialIndex = {};
                        materialPathIndex = {};
                        materials.push(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, alphaTest: 0.5 }));
                        _loop_1 = function (variant) {
                            var find, path, load, loader, texture;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        find = function () {
                                            var path = model.textures[variant];
                                            while (path.startsWith('#')) {
                                                var next = model.textures[path.substring(1, path.length)];
                                                if (!next) {
                                                    materialIndex[variant] = 0; // transparent material
                                                    return undefined;
                                                }
                                                path = next;
                                            }
                                            return path;
                                        };
                                        path = find();
                                        if (!path)
                                            return [2 /*return*/, "continue"];
                                        if (!(materialPathIndex[path] !== undefined)) return [3 /*break*/, 1];
                                        materialIndex[variant] = materialPathIndex[path];
                                        return [3 /*break*/, 3];
                                    case 1: return [4 /*yield*/, this_1.manager.load(minecraft_resource_manager_1.ResourceLocation.ofTexturePath(path), 'base64')];
                                    case 2:
                                        load = _a.sent();
                                        console.log('texture');
                                        console.log(load);
                                        if (!load)
                                            throw new Error("Cannot find texture @" + path);
                                        loader = new THREE.TextureLoader();
                                        texture = loader.load("data:image/png;base64," + load.data);
                                        // sharp pixels and smooth edges
                                        texture.magFilter = THREE.NearestFilter;
                                        texture.minFilter = THREE.LinearFilter;
                                        materialIndex[variant] = materials.length;
                                        materialPathIndex[path] = materials.length;
                                        // map texture to material, keep transparency and fix transparent z-fighting
                                        materials.push(new THREE.MeshLambertMaterial({ map: texture, transparent: true, alphaTest: 0.5 }));
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = Object.keys(model.textures);
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        variant = _a[_i];
                        return [5 /*yield**/, _loop_1(variant)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        for (_b = 0, _c = model.elements; _b < _c.length; _b++) {
                            element = _c[_b];
                            width = element['to'][0] - element['from'][0];
                            height = element['to'][1] - element['from'][1];
                            length_1 = element['to'][2] - element['from'][2];
                            origin = {
                                x: (element['to'][0] + element['from'][0]) / 2 - 8,
                                y: (element['to'][1] + element['from'][1]) / 2 - 8,
                                z: (element['to'][2] + element['from'][2]) / 2 - 8
                            };
                            fix = 0.001;
                            blockGeo = new THREE.BoxGeometry(width + fix, height + fix, length_1 + fix);
                            mesh = new THREE.Mesh(blockGeo, materials);
                            mesh.name = 'element-mesh';
                            blockGeo.faceVertexUvs[0] = [];
                            mesh.position.x = origin.x;
                            mesh.position.y = origin.y;
                            mesh.position.z = origin.z;
                            faces = ['east', 'west', 'up', 'down', 'south', 'north'];
                            for (i = 0; i < 6; i++) {
                                face = element.faces[faces[i]];
                                /**
                                 * bake face start
                                 */
                                if (face) {
                                    midx = materialIndex[face.texture.substring(1, face.texture.length)] // references.indexOf(ref[0] == '#' ? ref.substring(1) : ref)
                                    ;
                                    // todo: could the face's texture be a path?
                                    blockGeo.faces[i * 2].materialIndex = midx;
                                    blockGeo.faces[i * 2 + 1].materialIndex = midx;
                                    uv = face.uv || [0, 0, 16, 16];
                                    // check
                                    if (clipUVs) {
                                        // uv.forEach(function (e, pos) { if (typeof e != 'number') throw new Error('The "uv" property for "' + face + '" face in element "' + index + '" is invalid (got "' + e + '" at index "' + pos + '").') })
                                        uv = uv.map(function (e) {
                                            if (e + 0.00001 < 0)
                                                return 0;
                                            else if (e - 0.00001 > 16)
                                                return 16;
                                            else
                                                return e;
                                        });
                                    }
                                    else {
                                        // uv.forEach(function (e, pos) { if (typeof e != 'number' || e + 0.00001 < 0 || e - 0.00001 > 16) throw new Error('The "uv" property for "' + face + '" face in element "' + index + '" is invalid (got "' + e + '" at index "' + pos + '").') })
                                    }
                                    uv = uv.map(function (e) { return e / 16; });
                                    // fix edges
                                    uv[0] += 0.0005;
                                    uv[1] += 0.0005;
                                    uv[2] -= 0.0005;
                                    uv[3] -= 0.0005;
                                    map = [
                                        new THREE.Vector2(uv[0], 1 - uv[1]),
                                        new THREE.Vector2(uv[0], 1 - uv[3]),
                                        new THREE.Vector2(uv[2], 1 - uv[3]),
                                        new THREE.Vector2(uv[2], 1 - uv[1])
                                    ];
                                    if (face.rotation) {
                                        amount = face.rotation;
                                        // check property
                                        // if (!([0, 90, 180, 270].indexOf(amount) >= 0))
                                        //     throw new Error('The "rotation" property for "' + face + '" face in element "' + index + '" is invalid (got "' + amount + '").')
                                        // rotate map
                                        for (j = 0; j < amount / 90; j++) {
                                            map = [map[1], map[2], map[3], map[0]];
                                        }
                                    }
                                    blockGeo.faceVertexUvs[0][i * 2] = [map[0], map[1], map[3]];
                                    blockGeo.faceVertexUvs[0][i * 2 + 1] = [map[1], map[2], map[3]];
                                }
                                else {
                                    // transparent material
                                    blockGeo.faces[i * 2].materialIndex = 0;
                                    blockGeo.faces[i * 2 + 1].materialIndex = 0;
                                    map = [
                                        new THREE.Vector2(0, 0),
                                        new THREE.Vector2(1, 0),
                                        new THREE.Vector2(1, 1),
                                        new THREE.Vector2(0, 1)
                                    ];
                                    blockGeo.faceVertexUvs[0][i * 2] = [map[0], map[1], map[3]];
                                    blockGeo.faceVertexUvs[0][i * 2 + 1] = [map[1], map[2], map[3]];
                                }
                                /**
                                 * bake face end
                                 */
                            }
                            /**
                             * bake rotation start
                             */
                            if (element.rotation) {
                                rotationOrigin = {
                                    x: element.rotation.origin[0] - 8,
                                    y: element.rotation.origin[1] - 8,
                                    z: element.rotation.origin[2] - 8
                                };
                                axis = element.rotation.axis;
                                angle = element.rotation.angle;
                                pivot = new THREE.Group();
                                pivot.name = 'pivot';
                                pivot.position.x = rotationOrigin.x;
                                pivot.position.y = rotationOrigin.y;
                                pivot.position.z = rotationOrigin.z;
                                pivot.add(mesh);
                                // adjust mesh coordinates
                                mesh.position.x -= rotationOrigin.x;
                                mesh.position.y -= rotationOrigin.y;
                                mesh.position.z -= rotationOrigin.z;
                                // rotate pivot
                                if (axis == 'x')
                                    pivot.rotateX(angle * Math.PI / 180);
                                else if (axis == 'y')
                                    pivot.rotateY(angle * Math.PI / 180);
                                else if (axis == 'z')
                                    pivot.rotateZ(angle * Math.PI / 180);
                                group.add(pivot);
                            }
                            else {
                                pivot = new THREE.Group();
                                pivot.name = 'pivot';
                                pivot.add(mesh);
                                group.add(pivot);
                            }
                            /**
                             * bake rotation end
                             */
                        }
                        obj.add(group);
                        return [2 /*return*/, obj];
                }
            });
        });
    };
    ThreeModelLoader.prototype.load = function (path) {
        var _this = this;
        return this.resolveModel(path)
            .then(function (r) { return r ? _this.bakeModel(r) : Promise.resolve(undefined); });
    };
    return ThreeModelLoader;
}());
exports.ThreeModelLoader = ThreeModelLoader;
//# sourceMappingURL=index.js.map