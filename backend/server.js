const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config")
const path = require('path');
const fs = require('fs');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "https://mini-social-post-application.netlify.app",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ensure uploads dir exists and serve it
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

app.use("/api/auth",require("./routes/authRoutes"))
app.use("/api/posts",require("./routes/postRoutes"))

const PORT = process.env.PORT || 5000;
    app.listen(PORT, ()=>{
    console.log(`server is running on port: ${PORT}`);
    }) 
  
