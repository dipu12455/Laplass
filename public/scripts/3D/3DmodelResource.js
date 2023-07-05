import { getMeshFromObj } from "./modules/LPModels3D.js";

//use this file to load 3D models resources from the server, models can be referred to by the following exported variables

export const mesh = await getMeshFromObj('/mesh1'); //this function uses the classes described above it, don't move it anywhere else