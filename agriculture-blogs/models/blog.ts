import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Blog title is required"],
    trim: true
  },
  author: {
    type: String,
    required: [true, "Author name is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Agriculture", "Agri-Tech", "Sustainability", "Organic Farming"],
    default: "Agriculture"
  },
  content: {
    type: String,
    required: [true, "Blog content is required"]
  },
  image: {
    type: String, // Cloudinary secure_url
    required: [true, "Blog image is required"]
  },
  likes: {
    type: [String], // Array of user IPs or user IDs
    default: []
  },
  dislikes: {
    type: [String], // Array of user IPs or user IDs
    default: []
  }
}, { 
  timestamps: true 
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;