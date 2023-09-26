const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
    type Curso {
        titulo: String
    }

    type Tecnologia{
        tecnologia: String
    }

    type Query {
        obtenerCursos: [Curso]

        obtenerTecnologias: [Tecnologia]
    }
`;

const cursos = [
    {
        titulo: "Javascript Moderno Guía Definitiva",
        tecnologia: "JavaScript ES6"
    },
    {
        titulo: "React - La Guía Completa",
        tecnologia: "React"
    },
    {
        titulo: "Node.js - Bootcamp ",
        tecnologia: "Node.js"
    },
    {
        titulo: "ReactJS Avanzado",
        tecnologia: "React"
    },
]

const resolvers = {
    Query: {
        obtenerCursos: () => cursos,

        obtenerTecnologias: () => cursos
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Server en el puerto ${url}`)
});
