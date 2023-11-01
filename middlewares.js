const jwt = require('jsonwebtoken')

const chequearCredenciales = (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(401).send({message:"No se recibieron las credenciales en esta consulta"})
}
next()
}

const verificarToken = (req, res, next) => {
    const token = req.header("Authorization").split("Bearer ")[1]
    if(!token)       throw { code: 401, message: "Se debe incluir el token en las cabeceras" }
    const validToken = jwt.verify(token, "CryptoKey")
    if(!validToken)  throw { code: 401, message: "Token inválido" }
    next()
}

const reportarConsulta = (req, res, next) => { 
    const url = req.url                 // Obtención de URL de la solicitud.
    
    console.log(                // Se registra en la consola, información sobre la solicitud recibida.
        `
        Hoy ${new Date()}
        se ha recibido una consulta en la ruta ${url}`
    )
    return next()                   // Llama a la función next para permitir que la solicitud continúe su procesamiento.
}


module.exports = { chequearCredenciales, verificarToken, reportarConsulta }