const jwt = require('jsonwebtoken');
const User = require('../models/User')

module.exports = (req, res, next) => {
    try{
        //Nous extrayons du header authorization le token (split bearer/token)
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        //nous extrayons l'ID utilisateur de notre token et le rajoutons à l’objet Request afin que nos différentes routes puissent l’exploiter.
        const userId = decodedToken.userId;
        User.findById(userId) 
        .then(user => {
            if(!user) {
                return res.status(401).json({message : "Pas d'utilisateur trouvé"})
            }else {
                res.locals.user = user
                res.locals.userId = userId;
                next();              
            }
        })
        //stocker dans res.locals.userId
        //todo : remplacer res.locals.user.id
        
    
    } catch(error) {
        res.status(401).json({ error })
    }
};