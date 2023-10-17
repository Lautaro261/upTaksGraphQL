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
    },

    autenticarUsuario: async (root, {input}) =>{
      const { email, password } = input;
      //1) Exite el usuario?
      
      const getUsriario = await Usuario.findOne({email});
      console.log(getUsriario)
      if(!getUsriario){
        throw new Error("El usuario no existe")
      }
      //2) El password es correcto ?

      const passwordCorrecto = await bcryptjs.compare(password, getUsriario.password);

      if(!passwordCorrecto){
        
      }

      //3) Dar acceso a la app
    }
  }
};

module.exports = resolvers;
