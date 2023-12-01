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

   router.get('/perfis-colab/:nome', async (request, response) => {
    const user = await  Usuario.findOne({ nome: 'yan' });
    if (!user) {
      
      return;
    }

    const todasAsInteracoesSaoZero = user.interacoes.every((interacao) => interacao.cliques === 0);
    if(todasAsInteracoesSaoZero){
      const usuarios =  await Usuario.find({ isParceiro: true})
      .sort({ 'parceria.cliques': -1 } )
      return response.status(200).json(usuarios);  
    }

    
    const categoriasMaisClicadasUsuarioAtual = user.interacoes
      .sort((a, b) => b.cliques - a.cliques)
      .slice(0, 2)
      .map((categoria) => categoria.categoria);

      const outrosUsuarios = await Usuario.find({ nome: { $ne: request.params.nome } });
     

      let recomendacoes = [];
      for (const outroUsuario of outrosUsuarios) {
        for (const categoria of outroUsuario.interacoes) {
          const categoriasMaisClicadasOutroUsuario = outroUsuario.interacoes
          .sort((a, b) => b.cliques - a.cliques)
          .slice(0, 3)
          .map((categoria) => categoria.categoria);
          
          if (
            
            categoriasMaisClicadasOutroUsuario.includes(categoria.categoria) &&
            !categoriasMaisClicadasUsuarioAtual.includes(categoria.categoria) &&
            !recomendacoes.includes(categoria.categoria)
          ) {
            recomendacoes.push(categoria.categoria);
          }
        }
      }
      console.log(recomendacoes)

      const usuarios =  await Usuario.find({ isParceiro: true, 'parceria.categoria': { $in: recomendacoes } })
      .sort({ 'parceria.cliques': -1 } )
      return response.status(200).json(usuarios);   
      

      })

router.get('/perfis-pref/:nome', async (request, response) => {
  try {

    let nome = request.params.nome
    
    const user = await Usuario.findOne({nome : 'yan'})
    
    
    if (!user) {
      return response.status(400).json({ error: 'Usuário não encontrado' });
    }
    const preferencias = user.preferencias;
    const navegacao = user.interacoes;
  
    let categoriaMaisClicada = null;
    let buscar = [];
    let maxCliques = -1;
  
    for (const categoria of navegacao) {
      if (categoria.cliques > maxCliques) {
        maxCliques = categoria.cliques;
        categoriaMaisClicada = categoria.categoria;
      }
    }

    buscar = categoriaMaisClicada === preferencias?  [preferencias[0]] : [preferencias[0], categoriaMaisClicada]
    const usuarios = await Usuario.find({ isParceiro: true, 'parceria.categoria': { $in: buscar } })
      .sort({ 'parceria.cliques': -1 });
    response.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Erro durante a busca de usuários' });
  }})


   
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
router.delete('usuario/:nome', async  (req,res )=>{
  try {
    const usuario = await Usuario.deleteOne( req.params.nome)
    if(!usuario){
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (e) {
  }
})
router.put('naveg/', async (req, res)=>{
  let user = req.body.user
  let categoriaClicada = req.body.categoria
  let perfil = req.body.perfil

  const usuario = await Usuario.findOne({ nome: user });
  if(!usuario){
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }else{
    const categoriaNavegacao = usuario.interacoes.find(
      (interacao) => interacao.categoria === categoriaClicada
    );
    if (categoriaNavegacao) {
      categoriaNavegacao.cliques++;
      Usuario.save((err) => {
        if (err) {
          console.error('Erro ao salvar a interação ao usuário:', err);
          return;
        }
      });
  }
  const parceiro = await Usuario.findOne({ nome: perfil });
  parceiro.parceria.cliques++
  parceiro.save((err) => {
    if (err) {
      console.error('Erro ao salvar a interação no parceiro:', err);
      return;
    }
  });

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