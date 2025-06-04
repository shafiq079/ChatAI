const mongoose = require('mongoose')


async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_URL)
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB