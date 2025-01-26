const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const app = express()
//const multer = require('multer')
const connect = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const recipeRoutes = require('./routes/recipeRoutes')
//import path from 'path'
const {errorHandler} = require('./middleware/errorHandler')
require('dotenv').config()
const port = process.env.port || 4000
connect()
//const _dirname = path.resolve();
app.use(cors())
//app.use(multer().none())
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path);
    console.log(`API Path: ${req.method} ${req.originalUrl}`); // Logs the request method and path
    next(); // Proceed to the next middleware or route handler
  });
app.use('/api/auth',authRoutes);
app.use('/api/recipe',recipeRoutes);


app.use(errorHandler);

app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})

