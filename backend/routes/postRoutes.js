const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")
const Post = require("../models/Post")
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
        cb(null, unique);
    }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit


//post creation (supports file upload)
router.post("/", auth, upload.single('image'), async (req, res) => {
    try {
        const { text } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        console.log('Post creation - text:', text, 'image:', image, 'file:', req.file);

        if (!text && !image) {
            return res.status(400).json({ message: "Post cannot be empty" });
        }

        const post = await Post.create({
            userId: req.User.id,
            username: req.User.username,
            text,
            image,
            likes: [],
            comments: []
        });

        console.log('Post created successfully:', post);
        const postObj = post.toObject();
        if (postObj.image) {
            postObj.image = `http://localhost:5000${postObj.image}`;
        }
        res.json({ post: postObj });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

//feed

router.get("/",async(req,res)=>{

    const posts = await Post.find().sort({createdAt: -1});
    const postsWithImages = posts.map(post => {
        const postObj = post.toObject();
        if (postObj.image && !postObj.image.startsWith('http')) {
            postObj.image = `http://localhost:5000${postObj.image}`;
        }
        return postObj;
    });
    res.json(postsWithImages);
})

//likes

router.post("/:id/like", auth, async(req, res)=>{
    const post = await Post.findById(req.params.id)
    const username = req.User.username;

    if(post.likes.includes(username)){
        post.likes.pull(username);
    }else{
        post.likes.push(username);
    }

    await post.save()
    res.json(post);
});


//comments

router.post("/:id/comment", async(req, res)=>{
    const post = await Post.findById(req.params.id)

    post.comments.push({
        username: req.User.username,
        text: req.body.text
    })

    await post.save();
    res.json(post);
})


module.exports = router;