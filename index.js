const express = require('express');
const app = express();
const port = 3000;

//companion files
const Vector = require('./vector');

const v1 = new Vector(3,4);

var testVec = v1.getVector();

console.log(`testVec: (${testVec.getX()}, ${testVec.getY()})`);


app.get('/', (req, res) => {
    res.send('Program running...');
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});