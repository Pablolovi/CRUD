// Importar express
const express = require('express');

// Crea una instancia de la aplicación
const app = express();
const port = 3000;

// Usa middleware para interpretar JSON y datos de formulario
app.use(express.json());  // Asegura que puedas manejar solicitudes con JSON
app.use(express.urlencoded({ extended: true }));

// Datos de ejemplo: Lista de personajes de Street Fighter
let usuarios = [
    {id: 1, nombre: 'Ryu', edad: 32, lugarProcedencia: 'Japón'},
    {id: 2, nombre: 'Chun-li', edad: 29, lugarProcedencia: 'China'},
    {id: 3, nombre: 'Guile', edad: 35, lugarProcedencia: 'Estados Unidos'},
    {id: 4, nombre: 'Dhalsim', edad: 45, lugarProcedencia: 'India'},
    {id: 5, nombre: 'Blanka', edad: 32, lugarProcedencia: 'Brasil'},
];

// Ruta GET para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

// Ruta POST para crear un nuevo usuario (CORREGIDA)
app.post('/usuarios', (req, res) => {
    const { nombre, edad, lugarProcedencia } = req.body;  // TOMAR LOS DATOS DEL BODY

    // VALIDACIÓN DE LOS DATOS (se corrigió para aceptar datos correctamente)
    if (!nombre || !edad || !lugarProcedencia) {
        return res.status(400).json({ mensaje: 'Faltan datos requeridos: nombre, edad y lugar de procedencia' });
    }

    // Crear nuevo usuario (Si los datos son correctos)
    const nuevoUsuario = {
        id: usuarios.length + 1,  // Asignar un nuevo ID
        nombre,
        edad,
        lugarProcedencia
    };

    // Agregarlo a la lista de usuarios
    usuarios.push(nuevoUsuario);

    // Responder con el nuevo usuario creado
    res.status(201).json(nuevoUsuario);  // Código 201 para indicar que el recurso fue creado correctamente
});

// Ruta GET para obtener al usuario por su nombre
app.get('/usuarios/:nombre', (req, res) => {
    const { nombre } = req.params;
    const usuario = usuarios.find(u => u.nombre.toLowerCase() === nombre.toLowerCase());

    // Si el usuario no existe, devuelve un error 404
    if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Devuelve el usuario encontrado
    res.json(usuario);
});

// Ruta PUT para actualizar un usuario por nombre
app.put('/usuarios/:nombre', (req, res) => {
    const { nombre } = req.params;
    const { edad, lugarProcedencia } = req.body;

    // Buscar el índice del usuario
    const usuarioIndex = usuarios.findIndex(u => u.nombre.toLowerCase() === nombre.toLowerCase());

    // Si el usuario no existe, devuelve un error 404
    if (usuarioIndex === -1) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualizar datos del usuario
    if (!edad || !lugarProcedencia) {
        return res.status(400).json({ mensaje: 'Faltan datos requeridos: edad y lugar de procedencia' });
    }

    usuarios[usuarioIndex].edad = edad;
    usuarios[usuarioIndex].lugarProcedencia = lugarProcedencia;

    // Devolver el usuario actualizado
    res.json(usuarios[usuarioIndex]);
});

// Ruta DELETE para eliminar un usuario por nombre
app.delete('/usuarios/:nombre', (req, res) => {
    const { nombre } = req.params;

    // Filtrar los usuarios que no coincidan con el nombre
    const usuarioIndex = usuarios.findIndex(u => u.nombre.toLowerCase() === nombre.toLowerCase());

    // Si el usuario no existe, devuelve un error 404
    if (usuarioIndex === -1) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuarios = usuarios.filter(u => u.nombre.toLowerCase() !== nombre.toLowerCase());

    // Mensaje de éxito al eliminar el usuario
    res.json({ mensaje: `Usuario ${nombre} eliminado correctamente` });
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
