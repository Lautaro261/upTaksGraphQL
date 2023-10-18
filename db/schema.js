const { gql } = require("apollo-server");

const typeDefs = gql`
  type Curso {
    titulo: String
  }

  type Tecnologia {
    tecnologia: String
  }

  type Query {
    obtenerCursos: [Curso]
    obtenerTecnologias: [Tecnologia]
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

  type Token {
    token: String
  }

  type Mutation {
    crearUsuario(input: UsuarioInput): String  
    autenticarUsuario(input: AutenticarInput): Token
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