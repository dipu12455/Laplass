import { getMeshFromObj } from "../../LPEngine/modules/3D/LPModels3D.js";

//use this file to load 3D models resources from the server, models can be referred to by the following exported variables

export const mesh = await getMeshFromObj('/mesh1', true); //this function uses the classes described above it, don't move it anywhere else