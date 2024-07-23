require('dotenv').config();
const express = require("express");
const app = express()

const dbUrl = process.env.MONGO_URI
const connect = require("./features/data/repository/connectToMongoDatabase")
const port = process.env.PORT

const cors = require("cors");
const router = require('./features/router/UserRouter')
const notFound = require("./features/middleware/notFound")

app.use(cors())
app.use(express.json());
app.use('/api/v1/paypaxe_user',router);
app.use(notFound)


connect(dbUrl)
    .then(()=>{
        app.listen(port,()=>{
            console.log(`app listening at port ${port}`)
        })
    }).catch((error)=>{
    console.log(error)
})