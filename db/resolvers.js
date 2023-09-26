const cursos = [
  {
    titulo: "Javascript Moderno Guía Definitiva",
    tecnologia: "JavaScript ES6",
  },
  {
    titulo: "React - La Guía Completa",
    tecnologia: "React",
  },
  {
    titulo: "Node.js - Bootcamp ",
    tecnologia: "Node.js",
  },
  {
    titulo: "ReactJS Avanzado",
    tecnologia: "React",
  },
];

const resolvers = {
  Query: {
    obtenerCursos: () => cursos,

    obtenerTecnologias: () => cursos,
  },
};

module.exports = resolvers;
