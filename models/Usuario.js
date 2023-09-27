const mongoose = require("mongoose");

const UsuariosSchema = mongoose.Schema({
    nombre:{
        type: String,
        require: true,
        trin: true
    },
    email:{
        type: String,
        require: true,
        trin: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
        trin: true, 
    },
    registro:{
        type: Date,
        default: Date.now(),
    }
}) 

module.exports = mongoose.model("Usuario", UsuariosSchema);