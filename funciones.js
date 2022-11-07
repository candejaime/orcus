exports.login = async function(req, res, email, password) {
    //
    req.session.loggedin = false;
    var errorLogin = false
    const connection = require('./connection');
    const client = connection.connection();
    await client.connect();
    const usuario = await client.query("SELECT email_admi,contraseña_admi FROM usuario_admi WHERE (email_admi= '" + email + "' and contraseña_admi= MD5('" + password + "'));");

    if (usuario.rowCount != 0) {
        req.session.loggedin = true;
        req.session.username = usuario.rows[0].email_admi;
        res.redirect('/');
    } else {
        errorLogin = true;
    }

    await client.end();
    return (req.session.loggedin, req.session.username, errorLogin)

};