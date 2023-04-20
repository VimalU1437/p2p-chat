const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const socket = require("socket.io");



const port = 5000;

const app = express();

const server = http.createServer(app);
const io = socket(server,{cors:{
    origin:"*",
    methods:["GET","POST"]
}});

app.use(cors());

io.on("connection",socket=>{
    console.log("new connection");
    // console.log(socket)
    socket.on("offer",offer=>{
        console.log(offer);
        socket.broadcast.emit("offer",offer);
    })
    socket.on("answer",answer=>{
        console.log(answer);
        socket.broadcast.emit("answer",answer);
    })
})


app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public/peerpage.html"));
})

server.listen(port,()=>{
    console.log("server @ "+port);
})



