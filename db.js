const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000
        })
        console.log(`Conectado ao Mongodb: ${conn.connection.host}`)
        console.log(`URI: ${process.env.MONGODB_URI}`)
    }catch(error){
        console.error(`Erro na conexão com MongoDB: ${error.message}`);
    }
}

module.exports = connectDB