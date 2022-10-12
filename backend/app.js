const express = require ('express');
const mongoose = require ('mongoose');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const app = express();
require('dotenv').config()


//Authorisation pour faire des requètes provenant d'une autre origine.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    next();
  });


mongoose.connect(process.env.MONGO_URI,
  {   useNewUrlParser: true,
      useUnifiedTopology: true})
  .then(() => console.log('Connection à MongoDB réussi !'))
  .catch(() => console.log('Connection à MongoDB échouée !'));

app.use(express.json())
app.use('/api/auth', userRoutes)
app.use('/api/post', postRoutes);

module.exports = app