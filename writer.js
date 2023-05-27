const fs = require('fs');

//default file names for the three code files
const createFilename = './createEventGMLcode.lpc';
const stepFilename = './stepEventGMLcode.lpc';
const drawFilename = './drawEventGMLcode.lpc';

function gmlcodeFilesInit() { //run before anything else to create fresh code files
    try {
        fs.writeFileSync(createFilename, '// Code to be executed in create event');
        fs.writeFileSync(stepFilename, '//code to be executed in step event');
        fs.writeFileSync(drawFilename, '//code to be executed in draw event');
    } catch (err){
        console.error(err);
    }
}

function addCode(event, gmlcode) { //adds line of code to the step-event code file
  if (event === 'create') targetFile = createFilename;
  if (event === 'step') targetFile = stepFilename;
  if (event === 'draw') targetFile = drawFilename;
  try {
    const existingCode = fs.readFileSync(targetFile, 'utf8');
    const newCode = existingCode + '\n' + gmlcode;
    fs.writeFileSync(targetFile, newCode);
    console.log(`Code appended: ${gmlcode}`);
} catch (err) {
  console.error('error appending data to file: ' ,err);
}
}

module.exports = {
    gmlcodeFilesInit: gmlcodeFilesInit,
    addCode: addCode
};
