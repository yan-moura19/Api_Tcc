require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const server = express()
const router = require('./routes/usuarioRouter')
const cors = require('cors')

server.use(cors())
server.use(express.json())
server.use('/api', router)

mongoose.set('strictQuery', false);
mongoose.connect(process.env.URL_BD)
        .then(()=>{
            server.listen(process.env.SERVER_PORT)
            console.log("Conectou ao banco! porta 3000")

        })
        .catch((error) => console.log(error))

