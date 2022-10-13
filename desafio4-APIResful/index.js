const express = require("express");
const apiRoutes = require("./routers/app.routers");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/api", apiRoutes);

app.use("*", (req, res) => {
  res.status(404).send("<h1> Page does not exist</h1>");
});

const connectedServer = app.listen(PORT, () => {
  console.log(`Server up and listening on the port: ${PORT}`);
});

connectedServer.on("error", (error) => {
  console.log(`error:`, error.message);
});
