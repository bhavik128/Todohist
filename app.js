const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
require('dotenv').config();

//middlewares
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(cookieParser());
app.use(express.json());
app.use(routes);

//db connection
mongoose.connect(process.env.MONGODB_CONNECTION,{useCreateIndex:true,useUnifiedTopology:true,useNewUrlParser:true})
    .then(() => {console.log("DB connection successful..");})
    .catch((err) => {console.log(err.message);});

// listen
app.listen(port,() => {console.log(`server listening on port ${port}...`);})