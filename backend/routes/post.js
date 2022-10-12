const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const postCtrl = require('../controllers/post')
const verification = require('../middleware/verification')

router.post('/', auth, multer, postCtrl.createPost)
router.post('/:id/like', auth, postCtrl.likePost)
router.get('/', auth, postCtrl.getAllPosts)
router.get('/:id', auth, postCtrl.getOnePost)
router.put('/:id', auth, verification, multer, postCtrl.modifyPost)
router.delete('/:id', auth, postCtrl.deletePost)

module.exports = router