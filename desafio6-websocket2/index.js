const express = require("express");
const path = require("path");
const Products = require("./api/Api.js");
const { formatMessage } = require("./utils/utils");

//Instanciamos nuestro servidor con socket
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 8080;
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

//Instanciamos nuestra data
const products = new Products();
const { items } = products;

//Midllewaress
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.post("/", (req, res) => {
  const product = req.body;
  const { title, price, thumbnail } = req.body;
  if (!title || !price || !thumbnail) {
    return;
  }
  products.save(product);
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.status(404).send(`<h1 class="error" >Path not found</h1>`);
});

//Variables
const messages = [];
const users = [];

//Método io() con sus parámetros
io.on("connection", (socket) => {
  console.log(`Nuevo usuario conectado!`);

  io.emit("items", [...items]);

  io.emit("message", [...messages]);

  socket.on("new-user", (email) => {
    const newUser = {
      id: socket.id,
      email: email,
    };
    users.push(newUser);
  });

  socket.on("new-message", async (msg) => {
    const user = users.find((user) => user.id === socket.id);
    const newMessage = formatMessage(socket.id, user.email, msg);
    messages.push(newMessage);
    products.saveMessage(user.email, msg, newMessage.time);

    io.emit("chat-message", newMessage);
  });

  const id = socket.id;
  socket.on("disconnect", () => {
    io.emit("disc", `${id}`);
    console.log(`disconect ${id}`);
  });
});

//Conexión del Servidor
const connectedServer = httpServer.listen(PORT, () => {
  console.log(`Server is UP and listening on the port: ${PORT}`);
});

connectedServer.on("error", (error) => {
  console.log(`error:`, error.message);
});
