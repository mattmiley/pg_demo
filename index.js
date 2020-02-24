const express = require('express')
const path = require("path");
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/defects', db.getDefects)
app.get('/buildings', db.getBuildings)
app.post('/defects', db.createDefect)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

//need for static html pages
app.use(express.static(path.join(__dirname, "public")));

//route to home html page
app.get("/map", (req, res) => {
  //var username = req.headers['x-iisnode-auth_user'];
  res.sendFile(path.join(__dirname, "./public/map.html"));
});

//route to js page
app.get("/js/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/js/" + req.url.split("js/")[1]));
});