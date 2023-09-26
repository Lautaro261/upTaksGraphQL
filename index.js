const { ApolloServer } = require("apollo-server");

const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const conectarDB = require("./config/db");

//conectar a la DB 
conectarDB()

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server en el puerto ${url}`);
});
