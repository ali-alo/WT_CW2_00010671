const express = require('express')
const app = express()

// attach the pug as a template engine
app.set('view engine', 'pug')

app.use('/static', express.static('./public'))

app.get("/", (req, res) => {
  res.render('index');
});

app.listen(3000, () => console.log("App is running on port 3000"))