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

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
