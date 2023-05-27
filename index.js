const express = require('express');
const app = express();
const port = 3000;

//companion files
const Vector = require('./vector');

const v1 = new Vector(3,4);

var testVec = v1.getVector();

console.log(`testVec: (${testVec.getX()}, ${testVec.getY()})`);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//this is how you supply resources to index.html that contains the pixijs script. the script works in the client system context, which is why the script needs to query the server, then the server will supply the resource via this route.
app.get('/img' , (req, res) => {
  res.sendFile(__dirname + '/images/sample.png');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
