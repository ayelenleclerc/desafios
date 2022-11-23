export default {
  PORT: process.env.PORT || 8080,
  mongoLocal: {
    client: "mongodb",
    cnxStr: "mongodb://localhost:27017/ecommerce",
  },
  mongoRemote: {
    client: "mongodb",
    cnxStr:
      "mongodb+srv://Ayelenleclerc:Yuskia13@backend.xrrgkdz.mongodb.net/ecommerce?retryWrites=true&w=majority",
  },
  sqlite3: {
    client: "sqlite3",
    connection: {
      filename: `./DB/ecommerce.sqlite`,
    },
    useNullAsDefault: true,
  },
  mariaDB: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      database: "ecommerce",
    },
  },
  fileSystem: {
    path: "./DB",
  },
};
