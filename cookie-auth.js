var Boom = require('boom')
var Bcrypt = require('bcrypt')
var User = require('./user-db')
var hapicookie = require('hapi-auth-cookie')
module.exports = [{
        method: 'GET',
        path: '/register',
        config: {
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            handler: function(request, reply) {
                reply.view('register')
            }
        }
    },
    {
        method: 'GET',
        path: '/',
        config: {
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            handler: function(request, reply) {
                if (request.auth.isAuthenticated) {
                    return reply.view('profile', { message: 'Welcome to the landing page' });
                }
                reply.view('signin')
            }
        }

    },
    {
        method: 'POST',
        path: '/',
        config: {
            auth: {
                mode: 'try'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            handler: function(request, reply) {
                if (request.auth.isAuthenticated) {
                    return reply.view('profile', { message: 'Welcome to the landing page' + request.payload.username })
                }
                var username = request.payload.username
                var user = User.future.username
                if (!user) {
                    return reply(Boom.notFound('No user register with the given credentials'));
                }
                var password = request.payload.password
                if (password === User.future.password) {
                    console.log('user authentication suceessfull')
                    return reply.view('profile', { message: 'Welcome to the landing page ' + request.payload.username })

                } else {
                    return reply.view('signin')
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/logout',
        config: {
            auth: 'session',
            handler: function(request, reply) {
                return reply.view('/signin')
            }
        }
    }
]