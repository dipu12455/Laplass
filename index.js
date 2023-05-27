const express = require('express');
const app = express();
const port = 3000;

//companion files
const writer = require('./writer');
const draw = require('./draw');

writer.gmlcodeFilesInit();
draw.draw(); // carry out the draw functions of the app

app.get('/', (req, res) => {
    res.send('Program running...');
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});