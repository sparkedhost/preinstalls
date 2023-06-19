// Define all the modules that we will be using in this file.
const { Server, Version } = require('rjweb-server')
require('dotenv').config();

const server = new Server({
  port: process.env.SERVER_PORT,
  compression: 'gzip',
  proxy: {
    enabled: true,
    credentials: {
      authenticate: false
    }
  }
})

// Export Server for Route Files
module.exports.server = server

// Define Routes for the web server
server.path('/', (path) => path //*1
  .http('GET', '/', (http) => http
    .onRequest((ctr) => {
      ctr.headers.set('Content-Type', 'text/html')

      ctr.print('Hello world!')
      ctr.printPart('<a href="/homepage">go to home page</a>')
    })
  )
  .loadCJS('./routes', {
    fileBasedRouting: true
  }) // This will load all Routes from the Routes folder and add the prefix / + the file name without .js (*1) to them
  .path('/homepage', (path) => path
    .static('./static', {
      hideHTML: true, // This will automatically hide the .html extension from pages, so /index.html -> /, /blog.html -> /blog
      addTypes: true // This will automatically add Content-Types for Javascript, etc
    })
  )
)

server.path('/api', (path) => path
  .validate((ctr, end) => { // This will validate routes that are defined below
    if (!ctr.queries.has('auth')) return end(ctr.status(422).print('Auth Query (?auth=) is missing!'))
    if (ctr.queries.get('auth') !== '123') return end(ctr.status(401).print('Auth Query (?auth=) is not 123'))

    // end() function was not called so will continue with routes
  })
  .http('GET', '/', (http) => http
    .onRequest((ctr) => { // This will be available on /api since it combines every prefix to the top
      ctr.print('Welcome to the API!')
    })
  )
  .path('/user', (path) => path
    .validate((ctr, end) => { // Requires Additional Validation, not only the one above
      if (!ctr.queries.has('user')) return end(ctr.status(422).print('User Query (?user=) is missing!'))

      // end() function was not called so will continue with routes
    })
    .http('GET', '/infos', (http) => http
      .onRequest((ctr) => {
        ctr.print({
          username: ctr.queries.get('user'),
          password: '123'
        })
      })
    )
  )
)

server.on('route404', (ctr) => {
  ctr.status(404)
  ctr.print('This page was not found!')
})

server.on('httpRequest', (ctr) => {
  console.log(`${ctr.type.toUpperCase()} ${ctr.url.method} Request made to ${ctr.url.href} by ${ctr.client.ip}`)
})

server.start().then((port) => {
  console.log(`server listening on port ${port} (version ${Version})`)
})