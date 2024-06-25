require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hotgirlsread", // Cloudinary folder name
    allowed_formats: ["jpg", "png"],
  },
});

// Set up Multer
const upload = multer({ storage: storage });

// Middleware to serve static files and parse form data
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set("view engine", "ejs");

// Fetch images from Cloudinary
async function fetchImages() {
  try {
    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image`,
      {
        auth: {
          username: process.env.CLOUDINARY_API_KEY,
          password: process.env.CLOUDINARY_API_SECRET,
        },
        params: {
          prefix: "hotgirlsread/", // Specify the folder name
          type: "upload", // Make sure to specify the type
          max_results: 30, // Adjust as needed
        },
      }
    );

    const images = response.data.resources.map(
      (resource) => resource.secure_url
    );
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

// Route to display the index page
app.get("/", async (req, res) => {
  const images = await fetchImages();
  res.render("index", { images });
});

// Route to display the submit form
app.get("/submit", (req, res) => {
  res.render("submit", { error: null });
});

// Route to display the merch info
app.get("/merch", (req, res) => {
  res.render("merch");
});

// Route to display the about info
app.get("/about", (req, res) => {
  res.render("about");
});

// Route to display the image list
app.get("/list", async (req, res) => {
  const images = await fetchImages();
  res.render("list", { images });
});

// Route to handle file upload
app.post("/upload", upload.single("image"), (req, res) => {
  res.redirect("/list");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
