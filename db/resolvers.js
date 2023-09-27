const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs")
const resolvers = {
  Query: {
    
  },
  Mutation:{
    crearUsuario: async (root, {input}, ctx ) => {
      const { email, password } = input

      const getUsriario = await Usuario.findOne({email});
      console.log(getUsriario)
      if(getUsriario){
        throw new Error("El usuario ya esta registrado")
      }

      try {
        const salt = await bcryptjs.genSalt(10);
        input.password = await bcryptjs.hash(password, salt);

        console.log(input);

        const nuevoUsuario = await Usuario(input)
        console.log(nuevoUsuario)
        nuevoUsuario.save();
        return "Usuario creado correctamente"

      } catch (error) {
        console.log(error)
      }
    }
  }
};

module.exports = resolvers;
