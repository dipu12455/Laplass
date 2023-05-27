const fs = require('fs');

const gml_create = 'x = 30; y = 40; z = 0;';
const gml_step = 'x += 0.3; if (keyboard_check(ord(\'R\'))) game_restart();';
const gml_draw = 'draw_text(x,y,\'Hello World! \' + string(z));';

const createFilename = './createEventGMLcode.lpc';
const stepFilename = './stepEventGMLcode.lpc';
const drawFilename = './drawEventGMLcode.lpc';

function generateCode() { //this also works as creating fresh file before every run
    try {
        //write gml file for create event
        fs.writeFileSync(createFilename, gml_create);
        //write gml file for step eventw
        fs.writeFileSync(stepFilename, gml_step);
        //write gml file for draw event
        fs.writeFileSync(drawFilename, gml_draw);
    } catch (err){
        console.error(err);
    }
}

function appendStep(gmlcode) {
  try {
    const existingCode = fs.readFileSync(stepFilename, 'utf8');
    const newCode = existingCode + gmlcode;
    fs.writeFileSync(stepFilename, newCode);
    console.log('Code appended!');
} catch (err) {
  console.error('erro appending data to file: ' ,err);
}
}

module.exports = {
    generateCode: generateCode,
    appendStep: appendStep
};
