const http=require ('http')
const app = require('./app')
const port=process.env.PORT||3000;
const connectToDB =require("./db/db")


connectToDB(); 
const server=http.createServer(app);

server.listen(port,()=>{
    console.log(`server runing on port ${port}`)
})