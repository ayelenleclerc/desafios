const socket = io();

//Seleccionamos el div donde cargaremos los productos en tiempo real
const history = document.getElementById("history");

async function makeHtmlTable(products) {
  const respuesta = await fetch("/plantilla/productos.hbs");
  const plantilla = await respuesta.text();
  const template = Handlebars.compile(plantilla);
  const html = template({ products });
  return html;
}

//Mediante el metodo on(), renderizamos los productos cargados.
socket.on("items", (products) => {
  makeHtmlTable(products).then((html) => {
    history.innerHTML = html;
  });
});

//CHAT - MESSAGE ------------------------------------------------------------
const formChat = document.getElementById("form-chat");
const inputEmail = document.getElementById("input-email");
const inputText = document.getElementById("input-text");

formChat.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = inputEmail.value.toUpperCase();
  const message = inputText.value;
  socket.emit("new-user", user);
  socket.emit("new-message", message);
  inputEmail.value = user;
  inputText.value = "";
});

socket.on("chat-message", (data) => {
  const user = data.email;
  const message = data.text;
  socket.on("disc", () => {
    document.getElementById(
      "chat"
    ).innerHTML = `<p style="color: red"><b>User: ${user} disconnect</b></p>`;
  });
  document.getElementById(
    "chat"
  ).innerHTML += `<p style="padding-top: 0.3rem"><b><span style="color: blue">${user}</b></span> 
  <span style="color: brown">[${data.time}]:</span> 
  <span style="color:green"><i>${message}</i></span></p>`;
});

socket.on("message", (data) => {
  const html = data
    .map((user) => {
      let render = `
    <p style="padding-top: 0.5rem"><b><span style="color: blue">${user.email}</b></span> 
    <span style="color: brown">[${user.time}]:</span> 
    <span style="color: green"><i>${user.text}</i></span></p>
    `;
      return render;
    })
    .join("\n");
  document.getElementById("chat").innerHTML = html;
});
