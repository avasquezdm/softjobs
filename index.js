const express = require('express')      // Importa la librería 'express' para crear una aplicación web.
const app = express()                   // Crea una instancia de la aplicación Express.
const PORT = 3000                       // Define el número de puerto en el que se ejecutará el servidor.
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { verificarCredenciales, obtenerDatosUsuario, registrarUsuario } = require('./consultas')   // Importa las funciones {} desde el archivo 'consultas.js'.
const { chequearCredenciales, verificarToken, reportarConsulta } = require('./middlewares')  

app.use(cors())
app.use(express.json())
app.listen(PORT, console.log(`Servidor arriba en puerto ${PORT}`))  // Inicia servidor y muestra mensaje consola.

app.get("/usuarios", verificarToken, reportarConsulta, async (req, res) => {
    
    try {
        const token = req.header("Authorization").split("Bearer ")[1] // se hace un split porque solo queremos el token. El índice 1 es lo que viene después.
        const { email } = jwt.decode(token)
        const usuario = await obtenerDatosUsuario(email)
        res.json(usuario)
        
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post("/usuarios", reportarConsulta, async (req, res) => {
    try {
        const usuario = req.body        // son hartos datos
        await registrarUsuario(usuario)
        res.send("Usuario registrado con éxito")
        
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post("/login", chequearCredenciales, reportarConsulta, async (req, res) => {
    try {
        const { email, password } = req.body // se capturan los datos enviados desde el Front
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, "CryptoKey") // se guarda el email en el token
        res.send(token)         // se envía el token al Front

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

