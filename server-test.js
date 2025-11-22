const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log("GET / endpoint hit");
  res.send("Hello from test server");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
});
