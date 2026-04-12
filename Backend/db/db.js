const mongoose=require('mongoose')
// const dotenv=re
async function connectToDB()
{
    try
    {await mongoose.connect(process.env.MONGODB_URI)
    console.log("connected to database")}
    catch(err)
    {
        console.log("failed to connect to database")
    }
}
module.exports=connectToDB