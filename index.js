const express = require('express');
const app = express();
const port = 3000;

//companion files
const writer = require('./writer');

writer.generateCode();
writer.appendStep('y += 0.4;');

app.get('/', (req, res) => {
    res.send('Program running...');
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});