
const Post = require('../models/Post')

module.exports = (req, res, next) => { 
    function isOwnerOrAdmin (user, ownerId) {
        let isOwnerOrAdmin = false
        if(user.isAdmin) {
            return true
        }
        if(user.id == ownerId ) {
            return true
        }
        return isOwnerOrAdmin
    }
    Post.findOne({_id: req.params.id})
        .then(post => {
            if(isOwnerOrAdmin(res.locals.user, post.userId)) {
                next()
            } else {
                return res.status(403).json("Vous n'avez pas les droits")
            }
        })
        .catch(error => { res.status(404).json({ error })})
    }
