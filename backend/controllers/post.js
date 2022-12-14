const Post = require('../models/Post')
const fs = require('fs')
const { populate } = require('../models/Post')

// Création d'un Post
exports.createPost = (req, res, next) => {
    const userId = res.locals.userId
    const postObject = JSON.parse(req.body.post)
    let date1 = new Date();
    const dateLocale = date1.toLocaleString('fr-FR',{
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'});
    delete postObject._id
    const post = new Post({
        userId: userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        description: postObject.description,
        postDate: dateLocale,
        likes: 0,
        usersLiked: [],
        user: userId
        
    })
    post.save()
        .then(() => res.status(201).json({ message: 'Post enregistré'}))
        .catch(error => res.status(400).json({error}))

}

// Affichage de toutes les sauces
exports.getAllPosts = (req, res, next) => {
     Post.find().populate("user")
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }))
}

//Affichage d'une seule sauce
exports.getOnePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id}).populate("user")   
        .then(post => res.status(200).json( post ))
        .catch(error => res.status(404).json({ error }))
}

//Modification d'un post
exports.modifyPost = (req, res, next) => {
    if (req.file) {
        Post.findOne({ _id: req.params.id })
            .then(post => {
                const filename = post.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    const postObject = JSON.parse(req.body.post)
                    const modifiedPost = ({
                        userId: res.locals.userId,
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                        description: postObject.description
                    })
                    Post.updateOne({ _id: req.params.id }, { ...modifiedPost, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Post modifié!' }))
                        .catch(error => res.status(400).json({ error }));
                })
                
            })
            .catch(error => res.status(500).json({ error }));
    } else {
       
            const modifiedPost = ({
                userId: res.locals.userId,
                description: req.body.description
            })
            Post.updateOne({ _id: req.params.id }, { ...modifiedPost, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Post modifié!' }))
                .catch(error => res.status(400).json({ error }));
      
    }
}


//Suppression d'un post
exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            if(!post) {
                return res.status(400).json({ message: "Le post recherché n'existe pas " })
            }
            console.log(res.locals)
            const filename = post.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => 
                Post.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Post supprimé" }))
                    .catch(error => res.status(400).json({ error }))
            )
            
        })
}

//Like de post
exports.likePost = (req, res, next) => {
    const userId = res.locals.userId
    const like = req.body.like
    const postId = req.params.id
    Post.findOne({ _id: postId })
        .then(post => {
            const newValues = {
                usersLiked : post.usersLiked,
                likes: 0
            }
            const indexLike = newValues.usersLiked.indexOf(userId)
            switch (like) {
                case 1: 
                    if(indexLike > -1){
                        return res.status(401).json({ message: "post déjà noté" })
                    } else {
                        newValues.usersLiked.push( userId )
                    }
                    break
                    
                case 0:
                    if (indexLike>-1){
                        newValues.usersLiked.splice(indexLike, 1)
                    }
                    break                
            }

            newValues.likes = newValues.usersLiked.length

            Post.updateOne({ _id: postId }, newValues )
                .then(() => res.status(200).json({ message: 'Sauce notée !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))

}


