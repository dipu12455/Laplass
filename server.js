const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/test.txt', (req, res) => {
  res.sendFile(__dirname + '/test.txt');
});

app.get('/pmTriangle', (req, res) => {
  res.sendFile(__dirname + '/pmTriangle.pm');
});

app.get('/pmPentagon', (req, res) => {
  res.sendFile(__dirname + '/pmPentagon.pm');
});

app.get('/pmArrow', (req, res) => {
  res.sendFile(__dirname + '/pmArrow.pm');
});

app.get('/pmSquare', (req, res) => {
  res.sendFile(__dirname + '/pmSquare.pm');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
