const http=require ('http')
const app = require('./app')
const port=process.env.PORT||3000;
const connectToDB =require("./db/db")
const { initializeSocket } = require('./socket');


connectToDB(); 
const server=http.createServer(app);

initializeSocket(server);

server.listen(port,()=>{
    console.log(`server runing on port ${port}`)
})