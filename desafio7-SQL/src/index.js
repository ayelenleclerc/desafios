const express = require("express"); // como siempre importar libreria de express
const { Server: HttpServer } = require("http"); //los dos puntos son para cambiarle el nombre al servidor
const { Server: SocketServer } = require("socket.io"); //importamos libreria de websocket
const Products = require("./model/Products");
const Messages = require("./model/Message");
const dbConfig = require("./db/config");

const PORT = process.env.PORT || 8080; // definimos puerto
const app = express(); //definimos constante para nuestro servidor
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer); //estos dos ultimos pasos se hacen para imprementar express y socket al tiempo.
const productsDB = new Products("products", dbConfig.mariaDB); //mi clase de productos
const messagesDB = new Messages("messages", dbConfig.sqlite);

//Middlewares
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Variable
const users = [];

//Socket
io.on("connection", async (socket) => {
  console.log(`New User conected!`);
  console.log(`User ID: ${socket.id}`);

  //socket.emit('server-message', "Mensaje desde el servidor")
  const products = await productsDB.getAll();
  socket.emit("products", products);

  socket.on("newProduct", async (newProduct) => {
    await productsDB.save(newProduct);
    const updateProducts = await productsDB.getAll();
    io.emit("products", updateProducts);
  });

  /* io.emit("message", [...messages]); */

  socket.on("new-user", (username) => {
    const newUser = {
      id: socket.id,
      username: username,
    };
    users.push(newUser);
  });

  /*     socket.on("new-message", async (msj) => {
        const user = users.find((user) => user.id === socket.id);
        const newMessage = formatMessage(socket.id, user.username, msj);
        messages.push(newMessage);
        io.emit("chat-message", newMessage);
       })
 */

  const messages = await messagesDB.getMessages();
  socket.emit("messages", messages);
  /* console.log(messages) */
  socket.on("new-message", async (msj) => {
    await messagesDB.addMessage({
      email: msj.user,
      message: msj.message,
      date: new Date().toLocaleDateString(),
    });
    const messagesLog = await messagesDB.getMessages();
    io.emit("messages", { messagesLog });
  });
});

//Conexión del Servidor
const connectedServer = httpServer.listen(PORT, () => {
  console.log(`🚀Server active and runing on port: ${PORT}`);
});

connectedServer.on("error", (error) => {
  console.log(`error:`, error.message);
});
