const Usuario = require("../models/Usuario");
const Proyecto = require("../models/Proyectos");
const Tarea =require("../models/Tareas");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({path: ".env"});


const crearToken =(usuario, secreto, expiresIn)=>{
  const {id, email, nombre} = usuario;

  return jwt.sign({id, email, nombre}, secreto,{expiresIn});
}

const resolvers = {
  Query: {
    obtenerProyectos: async(root, {}, ctx)=>{
      try {
       // console.log(ctx.usuario)
        const proyectos = await Proyecto.find({creador: ctx.usuario.id})
        const proyectosConFechaFormateada = proyectos.map((proyecto) => ({
          id: proyecto.id,
          nombre: proyecto.nombre,
          creado: proyecto.creado.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
        }));
        return proyectosConFechaFormateada;
      } catch (error) {
        console.log(error)
      }
      
    },
    obtenerTareas: async(root, {input}, ctx)=>{
      try {
        const tareas = await Tarea.find({creador: ctx.usuario.id}).where("proyecto").equals(input.proyecto);
        return tareas;
      } catch (error) {
        console.log(error)
      }
    },

    saludo: async(root,{}, ctx)=>{
      try {
        
        return "si se pudo conectar"

      } catch (error) {
        console.log(error)
      }

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
        token: crearToken(getUsriario ,process.env.SECRETO,"4hr" )
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

    },

    nuevaTarea: async (root, {input}, ctx)=>{

      try {
        const tarea = new Tarea(input)
        tarea.creador = ctx.usuario.id
        const resultado = await Tarea.save()
        return resultado
      } catch (error) {
        console.log(error)
      }
    },

    actualizarTarea: async(root, {id, input, estado}, ctx)=>{
      try {
        // tarea existe ? 
        let tarea = await Tarea.findById(id)
        if (!tarea){
          throw new Error('Tarea no encontrado');
        }
        // el usuario es el propietario? 
        if(tarea.creador.toString()!== ctx.usuario.id){
          throw new Error('No tienes las credenciales para editarlo');
        }
        //modificar tarea
        tarea = await Tarea.findOneAndUpdate({_id:id}, input, {new: true})
        return tarea 
      } catch (error) {
        console.log(error)
      }
    },
    eliminarTarea: async(root,{id}, ctx)=>{
      try {
        // el proyecto existe ?
        let tarea = await Tarea.findById(id)
        if (!tarea){
          throw new Error('Tarea no encontrado');
        }
        //el usuario que solicita modificar, es el creador ?
        if(tarea.creador.toString()!== ctx.usuario.id){
          throw new Error('No tienes las credenciales para editarlo');
        }
        //eliminar el proyecto
        await Tarea.findOneAndDelete({_id:id})
        return "Tarea eliminado"

      } catch (error) {
        console.log(error)
      }

    },
  


  }
};

module.exports = resolvers;
