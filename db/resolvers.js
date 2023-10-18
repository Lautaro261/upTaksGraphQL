const Usuario = require("../models/Usuario");
const Proyecto = require("../models/Proyectos");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({path: ".env"});


const crearToken =(usuario, secreto, expiresIn)=>{
  const {id, email} = usuario;

  return jwt.sign({id, email}, secreto,{expiresIn});
}

const resolvers = {
  Query: {
    obtenerProyectos: async(root, {}, ctx)=>{
      const proyectos = await Proyecto.find({creador: ctx.usuario.id})
      return proyectos
    }
  },
  Mutation:{
    crearUsuario: async (root, {input}, ctx ) => {
      const { email, password } = input
      //console.log(email, password)
      const getUsriario = await Usuario.findOne({email});
      //console.log(getUsriario)
      if(getUsriario){
        throw new Error("El usuario ya esta registrado")
      }

      try {
        const salt = await bcryptjs.genSalt(10);
        input.password = await bcryptjs.hash(password, salt);

        //console.log(input);

        const nuevoUsuario = await Usuario(input)
        //console.log(nuevoUsuario)
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
      //console.log(getUsriario)
      if(!getUsriario){
        throw new Error("El usuario no existe")
      }
      //2) El password es correcto ?

      const passwordCorrecto = await bcryptjs.compare(password, getUsriario.password);

      if(!passwordCorrecto){
        throw new Error("Password incorrecto")
      }

      //3) Dar acceso a la app
      return { 
        token: crearToken(getUsriario,process.env.SECRETO,"2hr" )
      }
    },
    nuevoProyecto: async(root,{input}, ctx)=>{
       console.log('Linea 67',ctx)
      try {
        console.log(input)
        const proyecto = new Proyecto(input)

        proyecto.creador = ctx.usuario.id

        const resultado = await proyecto.save()
        return resultado;

      } catch (error) {
        console.log(error)
      }
    },
    actualizarProyecto: async(root,{id, input}, ctx)=>{
      try {
        // el proyecto existe ?
        let proyecto = await Proyecto.findById(id)
        if (!proyecto){
          throw new Error('Proyecto no encontrado');
        }
        //el usuario que solicita modificar, es el creador ?
        if(proyecto.creador.toString()!== ctx.usuario.id){
          throw new Error('No tienes las credenciales para editarlo');
        }

        //guardar el proyecto
        proyecto = await Proyecto.findByIdAndUpdate({_id:id}, input, {new: true})
        return proyecto;
      } catch (error) {
        console.log(error)
      }
    },

    eliminarProyecto: async(root,{id}, ctx)=>{
      try {
        // el proyecto existe ?
        let proyecto = await Proyecto.findById(id)
        if (!proyecto){
          throw new Error('Proyecto no encontrado');
        }
        //el usuario que solicita modificar, es el creador ?
        if(proyecto.creador.toString()!== ctx.usuario.id){
          throw new Error('No tienes las credenciales para editarlo');
        }
        //eliminar el proyecto
        await Proyecto.findOneAndDelete({_id:id})
        return "Proyecto eliminado"

      } catch (error) {
        console.log(error)
      }

    }


  }
};

module.exports = resolvers;
