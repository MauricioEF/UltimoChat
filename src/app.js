import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';

import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';

const app = express();

const PORT = process.env.PORT||8080;

const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`));

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

app.use(express.static(`${__dirname}/public`))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/',viewsRouter);


const io = new Server(server);

const logs = [];

io.on('connection', socketClient=> {
    //Aquí le configuro toooodos sus eventos.
    console.log(`Conectado con ${socketClient.id}`);

    socketClient.on('message',data=>{
        logs.push(data);
        io.emit('logs',logs)
    })

    socketClient.on('authenticated',user=>{
        console.log(`${user} está listo para participar en el chat`)
        socketClient.emit('logs',logs);
        socketClient.broadcast.emit('newUser',user)
    })

    
} );