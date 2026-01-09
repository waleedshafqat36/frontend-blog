import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  author: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

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
  likeCount: {
    type: Number,
    default: 0
  },
  dislikeCount: {
    type: Number,
    default: 0
  },
  likedBy: {
    type: [String], // Array of user IDs to prevent duplicate likes
    default: []
  },
  dislikedBy: {
    type: [String], // Array of user IDs to prevent duplicate dislikes
    default: []
  },
  comments: {
    type: [commentSchema],
    default: []
  }
}, { 
  timestamps: true 
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;