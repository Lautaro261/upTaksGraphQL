const { gql } = require("apollo-server");

const typeDefs = gql`

  type Proyecto{
    nombre: String
    id: ID
  }

  type Query {
    obtenerProyectos:[Proyecto]
  }

  type Token {
    token: String
  }

  input UsuarioInput {
    nombre: String  
    email: String!
    password: String!
  }

  input AutenticarInput {
    email: String!
    password: String!
  }

  input ProyectoInput{
    nombre: String!

  }

  type Mutation {
    crearUsuario(input: UsuarioInput): String  
    autenticarUsuario(input: AutenticarInput): Token
    nuevoProyecto(input:ProyectoInput): Proyecto
    actualizarProyecto(id: ID!, input:ProyectoInput):Proyecto
    eliminarProyecto(id: ID!): String
  }
`;

module.exports = typeDefs;


/* 
input UsuarioInput {
    nombre: String  campo no obligatorio 
    email: String!  campo obligatorio
    password: String!
  }
*/