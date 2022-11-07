const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const funciones = require('./funciones');
const consultas = require('./consultas');

const connection = require('./connection');
const console = require("console");

const PORT = process.env.PORT || 3000;
const app = express();
var email = '';
var errorLogin = false;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(session({
    secret: '656578fthbiut764435s',
    resave: true,
    saveUninitialized: true
}));
app.set("view engine", "jade")
session.loggedin = false;

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'frontend/index'), { data: errorLogin });
});
app.get('/login', (req, res) => {
    res.render(path.join(__dirname, 'frontend/index'), { data: errorLogin });
});

//ALUMNO
app.get('/homealumno', (req, res) => {
    const client = connection.connection();
    client.connect();
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        client.query("SELECT materias.nombre_mate,alumnoXmate.nota_uno,alumnoXmate.nota_dos,alumnoXmate.nota_tres FROM usuario_alumno INNER JOIN alumnoxmate ON usuario_alumno.id_alum=alumnoxmate.id_alum INNER JOIN materias ON materias.id_mate=alumnoXmate.id_mate WHERE(email_alum= '" + email + "' and alumnoxmate.id_mate= materias.id_mate and alumnoxmate.id_alum= usuario_alumno.id_alum) ORDER BY materias.nombre_mate;", (err, datos) => {
            res.render(path.join(__dirname, 'frontend/homeAlumno'), { data: datos.rows })
            client.end()
        })
    } else {}
});

//ADMINISTRADOR
app.get('/homeadmi', (req, res) => {
    const client = connection.connection();
    client.connect();
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        client.query("SELECT id_alum, curso.nombre, dni_id,CONCAT(nombre_alum,' ',apellido_alum), direccion_alum, email_alum, contraseña_alum from usuario_alumno INNER JOIN curso on id_curso=usuario_alumno.curso;", (err, alumno) => {
            res.render(path.join(__dirname, 'frontend/homeAdmi'), { alumnos: alumno.rows })
            client.end()
        })
    } else {}
});

app.get('/Profesores', (req, res) => {
    const client = connection.connection();
    client.connect();
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        client.query("SELECT id_profesor, dni_id, CONCAT(nombre_prof,' ',apellido_prof), direccion_prof, email_prof, contraseña_prof from usuario_profesor;", (err, profesor) => {
            res.render(path.join(__dirname, 'frontend/ListaProfesores'), { profesores: profesor.rows })
            client.end()
        })
    } else {}
});
app.get('/Materias', (req, res) => {
    const client = connection.connection();
    client.connect();
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        client.query("SELECT id_mate, nombre_mate, curso.nombre, CONCAT(nombre_prof,' ',apellido_prof) FROM materias INNER JOIN usuario_profesor on profesor_mate=id_profesor INNER JOIN curso on id_curso=curso_mate;", (err, materia) => {
            res.render(path.join(__dirname, 'frontend/materias'), { materias: materia.rows })
            client.end()
        })
    } else {}
});

app.get('/createAlumno', (req, res) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        res.render(path.join(__dirname, 'frontend/agregarAlumno'))
    } else {}
});
app.get('/createProfesor', (req, res) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        res.render(path.join(__dirname, 'frontend/agregarProfesor'))
    } else {}
});
app.get('/createMateria', (req, res) => {
    const client = connection.connection();
    client.connect();
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        client.query("SELECT id_profesor, dni_id, CONCAT(nombre_prof,' ',apellido_prof), direccion_prof, email_prof, contraseña_prof from usuario_profesor;", (err, profesor) => {
            res.render(path.join(__dirname, 'frontend/agregarMateria'), { profesores: profesor.rows })
            client.end()
        })
    } else {}
});


//PROFESOR 
app.get('/homeprofesor', (req, res) => {
    const client = connection.connection();
    client.connect();
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        client.query("SELECT id_mate, nombre_mate, curso.nombre, profesor_mate FROM materias INNER JOIN usuario_profesor on profesor_mate=id_profesor INNER JOIN curso on id_curso=curso_mate WHERE (email_prof='" + email + "');", (err, materia) => {
            res.render(path.join(__dirname, 'frontend/homeProfesor'), { materias: materia.rows })
            client.end()
        })
    } else {}
});
app.get('/agregarNotas/:id', (req, res) => {
    const client = connection.connection();
    client.connect();
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        client.query("SELECT usuario_alumno.id_alum, curso.nombre, dni_id,CONCAT(nombre_alum,' ',apellido_alum), direccion_alum, email_alum, contraseña_alum from usuario_alumno INNER JOIN curso on id_curso=usuario_alumno.curso INNER JOIN alumnoXmate ON alumnoXmate.id_alum=usuario_alumno.id_alum WHERE (alumnoXmate.id_mate='" + req.params.id + "');", (err, alumnos) => {
            res.render(path.join(__dirname, 'frontend/agregarNotas'), { alumno: alumnos.rows })
            client.end()
        })
    } else {}
});
app.post('/notas', (req, res) => {
    const Data = req.body;
    const client = connection.connection();
    client.connect();
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        for (var i = 0; i < data.length; i++) {
            client.query("update alumnoXmate set nota_uno='" + Data.nota1 + "',nota_dos='" + Data.nota2 + "',nota_tres='" + Data.nota3 + "'  where (id_alum='" + Data.id + "');", (err, alumnos) => {
                client.end()
            })

        }
    } else {}
});


//LOGIN
app.post("/login", (req, res) => {
    const userData = req.body;
    email = userData.email;
    if (userData.email && userData.password) {
        req.session.loggedin, req.session.username, errorLogin = funciones.login(req, res, userData.email, userData.password);
    } else {

    }
});

//CREAR
app.post('/createAlumno', (req, res) => {
    const alumData = req.body;
    const client = connection.connection();
    client.connect();
    if (req.session.loggedin) {
        client.query("insert into usuario_alumno(dni_id,nombre_alum,apellido_alum,curso,direccion_alum,email_alum,contraseña_alum,avatar) values ('" + alumData.dni + "','" + alumData.nombre + "','" + alumData.apellido + "','" + alumData.curso + "','" + alumData.direccion + "','" + alumData.email + "',MD5('" + alumData.dni + "'),19);", (err, alumno) => {
            res.redirect('/homeadmi');
            client.end()
        })
    } else {}

});
app.post('/createMateria', (req, res) => {
    const mateData = req.body;
    const client = connection.connection();
    client.connect();
    if (req.session.loggedin) {
        client.query("insert into materias(nombre_mate,profesor_mate,curso_mate) values ('" + mateData.nombre + "','" + mateData.profesor + "','" + mateData.curso + "');", (err, materia) => {
            res.redirect('/Materias');
            client.end()
        })
    } else {}
});
app.post("/createProfesor", (req, res) => {
    const profData = req.body;
    const client = connection.connection();
    client.connect();
    if (req.session.loggedin) {
        client.query("insert into usuario_profesor(dni_id,nombre_prof,apellido_prof,direccion_prof,email_prof,contraseña_prof,avatar) values ('" + profData.dni + "','" + profData.nombre + "','" + profData.apellido + "','" + profData.direccion + "','" + profData.email + "',MD5('" + profData.dni + "'),19);", (err, profesor) => {
            res.redirect('/Profesores');
            client.end()
        })
    } else {}

});
app.get('/editarAlumno/:id', (req, res) => {
        var id = req.params.id;
        const client = connection.connection();
        client.connect();
        console.log(req.session.loggedin)
        if (req.session.loggedin) {
            client.query("SELECT id_alum, curso.nombre, dni_id, nombre_alum, apellido_alum, direccion_alum, email_alum, contraseña_alum from usuario_alumno INNER JOIN curso on id_curso=usuario_alumno.curso where id_alum='" + req.params.id + "';", (err, alumno) => {
                res.render(path.join(__dirname, 'frontend/modificar_alumno'), { alumnos: alumno.rows })
                client.end()
            })
        } else {}
    })
    //EDITAR
app.get('/editarAlumno/:id', (req, res) => {
    var id = req.params.id;
    const client = connection.connection();
    client.connect();
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        client.query("SELECT id_alum, curso.nombre, dni_id, nombre_alum, apellido_alum, direccion_alum, email_alum, contraseña_alum from usuario_alumno INNER JOIN curso on id_curso=usuario_alumno.curso where (id_alum='" + req.params.id + "');", (err, alumno) => {
            res.render(path.join(__dirname, 'frontend/modificar_alumno'), { alumnos: alumno.rows })
            client.end()
        })
    } else {}
})
app.post('/editarAlumno', (req, res) => {
    const alumData = req.body;
    const client = connection.connection();
    client.connect();
    if (req.session.loggedin) {
        client.query("update usuario_alumno set dni_id='" + alumData.dni + "',nombre_alum = '" + alumData.nombre + "',apellido_alum = '" + alumData.apellido + "',direccion_alum = '" + alumData.direccion + "' ,email_alum = '" + alumData.email + "'  where (id_alum='" + alumData.id + "');", (err, alumno) => {
            res.redirect('/homeadmi');
            client.end()
        })
    } else {}

});


//ELIMINAR
app.get('/deleteAlumno/:id', (req, res) => {
    const client = connection.connection();
    client.connect();
    if (req.session.loggedin) {
        client.query("DELETE FROM usuario_alumno WHERE (id_alum= '" + req.params.id + "');", (err, prof) => {
            console.log(req.params.id)
            res.redirect('/homeadmi');
            client.end()
        })
    } else {}
})
app.get('/deleteProfesor/:id', (req, res) => {
    const client = connection.connection();
    client.connect();
    if (req.session.loggedin) {
        client.query("DELETE FROM usuario_profesor WHERE (id_profesor= '" + req.params.id + "');", (err, mate) => {
            console.log(req.params.id)
            res.redirect('/Profesores');
            client.end()
        })
    } else {}
})
app.get('/deleteMateria/:id', (req, res) => {
    const client = connection.connection();
    client.connect();
    if (req.session.loggedin) {
        client.query("DELETE FROM materias WHERE (id_mate= '" + req.params.id + "');", (err, alumno) => {
            console.log(req.params.id)
            res.redirect('/Materias');
            client.end()
        })
    } else {}
})

app.listen(PORT, () => {
    console.log('Exaple app listening at http://localhost:$(PORT)');
});