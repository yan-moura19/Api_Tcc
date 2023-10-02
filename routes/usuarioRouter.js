const express = require("express")
const Usuario = require("../models/User")
const router = express.Router()

router.get('/usuarios', async (request, response) => {
    const usuarios =  await Usuario.find()
    response.status(200).json(usuarios);   
   })
router.get('/perfis', async (request, response) => {
    const usuarios =  await Usuario.find({ isParceiro: true })
    response.status(200).json(usuarios);   
   })
   router.post('/Auth/login', async (request, res) => {
    try {
      
      const username = request.body.usuario;
      const senha = request.body.senha;
      
      
      
      const usuario = await Usuario.findOne({ usuario: username });
  
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
      if(usuario.senha != senha){
        return res.status(404).json({ error: 'Senha inválida.' });
      }
      user = {
        nome: usuario.nome,
        logado: true,
      }
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar usuário.' });
    } 
   })
router.get('/perfis-pref', async (request, response) => {
  const user = await Usuario.findById(req.params.id)
  const preferencias = user.topCategorias
  const usuarios =  await Usuario.find({ isParceiro: true, 'categorias': { $in: preferencias } }  )
  response.status(200).json(usuarios);   
   })
router.patch('usuario/:id', async  (req,res )=>{
  try{
  const usuarioId = req.params.id;
  const updates =req.body;

  const usuarioAtualizado = await Usuario.findByIdAndUpdate(usuarioId, updates, { new: true })
  if(!usuarioAtualizado){
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  }catch{
    res.status(400).json({ error: error.message });
  }
})
router.delete('usuario/:id', async  (req,res )=>{
  try {
    const usuario = await Usuario.findByIdAndRemove(req.params.id)
    if(!usuario){
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (e) {
  }
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
          let newUsuario;
          
          if(isParceiro){
          let parceria = {
            categoria: categoria,
            cliques: 0,
            usuario: usuario
          }
          newUsuario = {
            nome,
            senha,
            imagem: imagem,
            preferencias,
            isParceiro,
            interacoes: categoriasNavegacao,
            parceria: parceria
          }
        }else{
          newUsuario = {
            nome,
            senha,
            imagem: imagem,
            preferencias,
            isParceiro,
            interacoes: categoriasNavegacao,
            
          }
        }
        
        
          const userExists = await Usuario.findOne({nome : nome})
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