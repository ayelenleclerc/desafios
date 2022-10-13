class Usuario {
  constructor(nombre, apellido, libros, mascotas) {
    this.nombre = "";
    this.apellido = "";
    this.libros = [];
    this.mascotas = [];
  }
  getFullName() {
    return `${this.nombre} ${this.apellido}`;
  }
  addMascota(mascota) {
    this.mascotas.push(mascota);
  }
  countMascotas() {
    return this.mascotas.length;
  }
  addBook(nombre, autor) {
    this.libros.push({ nombre, autor });
  }
  getBooks() {
    return this.libros.map((libro) => `${libro.nombre} `);
  }
}

const user = new Usuario("Juan", "Perez", [], []);

const user2 = new Usuario("Pedro", "Perez", [], []);

console.log(user.getFullName());
user.addMascota("caballo");
console.log(user.countMascotas());
user.addBook("Harry Potter", "J.K. Rowling");
console.log(user.getBooks());

console.log(user2.getFullName());
user2.addMascota("Firulais");
console.log(user.mascotas);
console.log(user2.countMascotas());
user2.addBook("Harry Potter", "J.K. Rowling");
user2.addBook("El Psicoanalista", "John Katzenbach");
console.log(user2.getBooks());
