const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

users=[]
connections=[]
 

const {Server} = require('socket.io')
const io = new Server(server)

server.listen(3000,()=>{
    console.log('Servidor corriendo en http://localhost:3000/');
})

app.get('/', (req, res)=>{
    //res.send('<h2>Hola pAAAA</h2>')
    //console.log(__dirname)
    res.sendFile(`${__dirname}/cliente/index.html`)
})

//conection
io.on('connection',(socket)=>{
    connections.push(socket)
    console.log('Un usuario se ha conectado')

    socket.on('disconnect',(msg)=>{
        users.splice(users.indexOf(socket.username),1)
        updateUsernames()
        connections.splice(connections.indexOf(socket),1)
        console.log('Un usuario se ha desconectado')
    })

    socket.on('chat',(msg)=>{
        console.log('Mensaje: '+msg)
    })
   
    //enviar mensaje
   socket.on('chat',(msg)=>{
    io.emit('chat', msg, socket.username)
   })

   //nuevo usuario
   socket.on('new user',(msg, callback)=>{
    callback(true)  
    socket.username = msg
    users.push(socket.username)
    updateUsernames()
   })

   //funcion ActuaUser
   function updateUsernames(){
    io.emit('get users',users)
   }

   socket.on('user image', (image)=>{
    io.sockets.emit('addimage', image)
   })

})
 