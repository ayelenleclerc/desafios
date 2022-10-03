const express = require("express");

const { Server: HttpServer } = require("http");
const { Server: Socket } = require("socket.io");

const Products = require("./apis/Products.js");
const Messages = require("./apis/Messages.js");

//--------------------------------------------
// instancio servidor, socket y api

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

const productsApi = new Products();
const messagesApi = new Messages("message.json");

//--------------------------------------------
// configuro el socket

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado!");

  // carga inicial de productos
  socket.emit("products", productsApi.getAll());

  // actualizacion de productos
  socket.on("update", (product) => {
    productsApi.save(product);
    io.sockets.emit("products", productsApi.getAll());
  });

  // carga inicial de mensajes
  socket.emit("messages", await messagesApi.getAll());

  // actualizacion de mensajes
  socket.on("newMessage", async (message) => {
    message.fyh = new Date().toLocaleString();
    await messagesApi.save(message);
    io.sockets.emit("mensajes", await messagesApi.getAll());
  });
});

//--------------------------------------------
// agrego middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//--------------------------------------------
// inicio el servidor

const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
  console.log(
    `Servidor http escuchando en el puerto ${connectedServer.address().port}`
  );
});
connectedServer.on("error", (error) =>
  console.log(`Error en servidor ${error}`)
);
