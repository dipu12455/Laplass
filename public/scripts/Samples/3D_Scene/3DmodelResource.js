import { getMeshFromObj } from "../../Engine/modules/3D/Models3D.js";

//use this file to load 3D models resources from the server, models can be referred to by the following exported variables

export const variable1 = await getMeshFromObj('/mesh1', true); //this function uses the classes described above it, don't move it anywhere else