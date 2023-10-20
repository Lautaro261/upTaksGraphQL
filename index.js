const { ApolloServer } = require("apollo-server");

const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const conectarDB = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config(".env")

//conectar a la DB 
conectarDB()

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  context:({req})=>{
    console.log(req.headers['authorization'])
    const token = req.headers['authorization'] || '';
    //console.log('Linea 15',token);
    if(token){
      try {
        const usuario = jwt.verify(token.replace('Bearer ',""), process.env.SECRETO)
        console.log('linea 21',usuario);
        return{
          usuario
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
 });

server.listen().then(({ url }) => {
  console.log(`Server en el puerto ${url}`);
});
