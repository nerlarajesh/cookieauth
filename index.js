var Hapi = require('hapi')
var handlebar = require('handlebars')
var vision = require('vision')
var inert = require('inert')
var hapicookie = require('hapi-auth-cookie')
var server = new Hapi.Server();
server.connection({
    port: 3000,
    host: 'localhost'
})
var User = require('./user-db')
server.register([
    { register: inert },
    { register: vision },
    { register: hapicookie }
], function(err, res) {
    if (err) console.log(err);
    else console.log('Plugins registerd successfully')
})
server.views({
    engines: {
        hbs: handlebar
    },
    path: __dirname + '/views'
})

function callback(err, val, Obj) {
    if (typeof Obj != "undefined") {
        return true;
    } else {
        return false
    }
}

function validate(request, session, callback) {
    var username = session.username
    var user = User.future.username
    if (!user) {
        callback(null, false)
    }
    console.log('User Authenticated');
    callback(err, true, user)
}
server.auth.strategy('session', 'cookie', true, {
    password: 'rajesh',
    cookie: 'mycookie',
    redirectTo: '/',
    isSecure: false,
    validateFunc: validate

})
var routes = require('./cookie-auth')
server.route(routes)
console.log('Routes registered')

console.log('Registered auth strategy:cookie auth')
server.start(function(err) {
    if (err) console.log('Server Error' + err)
    else console.log('Server Started Successfully and running at:  ' + server.info.uri);
})