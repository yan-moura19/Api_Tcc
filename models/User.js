const mongoose = require('mongoose')
const Parceiro = require('../models/Parceiro')
const User = mongoose.model('User',{
    nome: String,
    senha: String,
    imagem: String,
    isParceiro: Boolean,
    preferencias: Array,
    interacoes: Array,
    parceria: Parceiro,
    
})

module.exports = User