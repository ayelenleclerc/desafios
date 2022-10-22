const express = require("express");
const path = require("path");
const Product = require("./model/Products.js");
const Message = require("./model/Message.js");
const { formatMessage } = require("./utils/utils");
const dbConfig = require("./db/config.js");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 8080;
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

//Instanciamos nuestra data
const productsDB = new Product("product", dbConfig.mariaDB);
const messagesDB = new Message("message", dbConfig.sqlite);

//Midllewaress
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "public"));

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
const users = [];

//Método io() con sus parámetros
io.on("connection", async (socket) => {
  console.log(`Nuevo usuario conectado!`);

  const products = productsDB.getAll();
  socket.emit("products", products);

  socket.on("newProduct", async (newProduct) => {
    productsDB.save(newProduct);
    const updateProducts = productsDB.getAll();
    io.emit("products", updateProducts);
  });

  socket.on("new-user", (email) => {
    const newUser = {
      id: socket.id,
      email: email,
    };
    users.push(newUser);

    const messages = messagesDB.getMessages();
    socket.emit("messages", messages);

    socket.on("new-message", async (msj) => {
      messagesDB.addMessage({
        email: msj.user,
        message: msj.message,
        date: formatMessage,
      });
      const messagesLog = messagesDB.getMessages();
      io.emit("messages", { messagesLog });
    });
  });
  //Conexión del Servidor
  const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server is UP and listening on the port: ${PORT}`);
  });

  connectedServer.on("error", (error) => {
    console.log(`error:`, error.message);
  });
});
