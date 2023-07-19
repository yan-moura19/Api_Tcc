const express = require("express")
const Usuario = require("../models/User")
const router = express.Router()

router.get('/usuarios', async (request, response) => {
    const usuarios =  await Usuario.find()
    
    response.status(200).json(usuarios);   
   })

router.post('/usuario', async (req, res) => {
    
    const {
        nome,usuario, senha,
         imagem, preferencias,
         categoria, isParceiro,
          } = req.body;

          let categoriasNavegacao = [
            { categoria: 'Esportes', cliques: 0 },
            { categoria: 'Tecnologia', cliques: 0 },
            { categoria: 'Música', cliques: 0 },
            { categoria: 'Filmes', cliques: 0 },
          ]

          let topCategorias = preferencias

          let newUsuario = {
            nome,
            usuario,
            senha,
            categorias: categoriasNavegacao,
            topCategorias,
            imagem: 'teste',
            isParceiro,
            categoria,
            preferencias

          }
          const userExists = await Usuario.findOne({usuario : usuario})
          if(userExists){
            return res.status(422).json({msg : "Esse nome de usuario já está sendo utilizado"})
    
        }
          
          try{
            await Usuario.create(newUsuario)
            res.status(200).json({msg: "Usuario inserido com sucesso! "})
    
        }catch(e){
            console.log(e)
            res.status(500).json({msg: "Erro ao conectar com o servidor "})
    
        }
   
   
   
   
   
   
        })

module.exports = router