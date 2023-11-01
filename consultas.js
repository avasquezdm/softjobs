const { Pool } = require('pg')          // Importa la clase Pool de la librería 'pg' para gestionar conexiones a la base de datos.
const bcrypt = require('bcryptjs')

const obj = {               // configuración de la base de datos.
    host: 'localhost',
    user: 'postgres',
    password: '2412',
    database: 'softjobs',
    allowExitOnIdle: true
}

const pool = new Pool(obj)      // Crea una instancia de Pool con la configuración de la base de datos.

const obtenerDatosUsuario = async (email) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1" // la password no puede ir acá porque vendrá encriptada
    const { rows: [usuario], rowCount } = await pool.query(consulta, values) // desestructuración doble
if (!rowCount || !usuario) // si no hay usuarios o el usuario es nulo
    throw { code:404, message: "No se encontró ningún usuario con ese email"}
    delete usuario.password // por seguridad se elimina la password del usuario
    return usuario 
}

const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1" // la password no puede ir acá porque vendrá encriptada

    const { rows: [usuario], rowCount } = await pool.query(consulta, values) // desestructuración doble

    const { password: passwordEncriptada } = usuario

    const passwordCorrecta = bcrypt.compareSync(password, passwordEncriptada) // esto da True o Falase, que es lo necesario

    if (!passwordCorrecta || !rowCount) {        // si la password es incorrecta o no encontró nada
        throw { code: 401, message: "email o contraseña incorrecta" }
    }
}

const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguage } = usuario    // debe ser tal cual está escrito en la BD

    const passwordEncriptada = bcrypt.hashSync(password)

    const values = [email, passwordEncriptada, rol, lenguage]
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
    await pool.query(consulta, values)      
    // no tiene que retornar nada porque estamos insertando
}

module.exports = { verificarCredenciales, obtenerDatosUsuario, registrarUsuario }      // Exporta las funciones para que puedan ser usadas en otras partes de la aplicación.