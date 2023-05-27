const express = require('express');
const app = express();
const port = 3000;

//companion files
const writer = require('./writer');

writer.gmlcodeFilesInit();
writer.addCode('step', 'y += 0.4;');
writer.addCode('create', '// another line bruv');
writer.addCode('draw', '//...');

app.get('/', (req, res) => {
    res.send('Program running...');
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});