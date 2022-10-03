const socket = io.connect();

//------------------------------------------------------------------------------------

const formAgregarProducto = document.getElementById("formAgregarProducto");
formAgregarProducto.addEventListener("submit", (e) => {
  e.preventDefault();
  const product = {
    title: formAgregarProducto[0].value,
    price: formAgregarProducto[1].value,
    thumbnail: formAgregarProducto[2].value,
  };
  socket.emit("update", product);
  formAgregarProducto.reset();
});

socket.on("products", (products) => {
  makeHtmlTable(products).then((html) => {
    document.getElementById("products").innerHTML = html;
  });
});

function makeHtmlTable(products) {
  return fetch("plantillas/productos.hbs")
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      const html = template({ products });
      return html;
    });
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById("inputUsername");
const inputMensaje = document.getElementById("inputMensaje");
const btnEnviar = document.getElementById("btnEnviar");

const formPublicarMensaje = document.getElementById("formPublicarMensaje");
formPublicarMensaje.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = { autor: inputUsername.value, texto: inputMensaje.value };
  socket.emit("newMessage", message);
  formPublicarMensaje.reset();
  inputMensaje.focus();
});

socket.on("messages", (message) => {
  console.log(message);
  const html = makeHtmlList(message);
  document.getElementById("messages").innerHTML = html;
});

function makeHtmlList(messages) {
  return messages
    .map((message) => {
      return `
            <div>
                <b style="color:blue;">${message.autor}</b>
                [<span style="color:brown;">${message.fyh}</span>] :
                <i style="color:green;">${message.texto}</i>
            </div>
        `;
    })
    .join(" ");
}

inputUsername.addEventListener("input", () => {
  const hayEmail = inputUsername.value.length;
  const hayTexto = inputMensaje.value.length;
  inputMensaje.disabled = !hayEmail;
  btnEnviar.disabled = !hayEmail || !hayTexto;
});

inputMensaje.addEventListener("input", () => {
  const hayTexto = inputMensaje.value.length;
  btnEnviar.disabled = !hayTexto;
});
