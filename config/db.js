const mongoose = require('mongoose');
require('dotenv').config({ path: '.env'})

const conectarDB = async ()=>{
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopoLogy: true,
            /* useFindAndModify:false,
            useCreateIndex:true */
        })
        console.log('Base de datos conectada ')
    } catch (error) {
        console.log('Error', {error: error})
        process.exit(1) //metodo para detener la app
    }
}

module.exports = conectarDB