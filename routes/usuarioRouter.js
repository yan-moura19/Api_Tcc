const express = require("express")

const router = express.Router()

router.get('/usuarios', (request, response) => {
    response.json("getUsuarios");   
   })


module.exports = router