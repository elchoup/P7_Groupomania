
const Post = require('../models/Post')

module.exports = (req, res, next) => { 
    Post.findOne({_id: req.params.id})
        .then(post => {
            if(post.userId === res.locals.userId) {
                next()
            } else {
                return res.status(403).json("Vous n'avez pas les droits")
            }
        })
        .catch(error => { res.status(404).json({ error })})
    }
