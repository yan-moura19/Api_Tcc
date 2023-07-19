const mongoose = require('mongoose')

const User = mongoose.model('User',{
    nome: String,
    usuario: String,
    senha: String,
    categorias: Array,
    topCategorias: Array,
    imagem: String,
    isParceiro: Boolean,
    preferencias: Array,
    
})

module.exports = User