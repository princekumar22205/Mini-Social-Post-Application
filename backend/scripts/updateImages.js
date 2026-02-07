require('dotenv').config();
const connectDB = require('../config');
const Post = require('../models/Post');

async function run() {
  try {
    await connectDB();
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

    console.log('Updating posts image URLs to use:', BACKEND_URL);

    const posts = await Post.find({ image: /localhost:5000/ });
    console.log('Found', posts.length, 'posts with localhost image URLs');

    for (const post of posts) {
      const old = post.image;
      post.image = post.image.replace('http://localhost:5000', BACKEND_URL);
      await post.save();
      console.log('Updated:', old, '->', post.image);
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Error updating images:', err);
    process.exit(1);
  }
}

run();
