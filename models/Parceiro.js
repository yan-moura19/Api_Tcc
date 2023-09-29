const mongoose = require('mongoose')

const Parceiro = mongoose.Schema({
    
        categoria: String,
        cliques: Number,
        usuario: String
      
    
})

module.exports = Parceiro