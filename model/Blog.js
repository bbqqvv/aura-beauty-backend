const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    list_img: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tags: {
      type: [String],
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    comments: {
      type: Number,
      default: 0,
    },
    sm_desc: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
    blog: {
      type: String,
      required: false,
    },
    video: {
      type: Boolean,
      default: false,
    },
    video_id: {
      type: String,
      required: false,
    },
    blockquote: {
      type: Boolean,
      default: false,
    },
    audio: {
      type: Boolean,
      default: false,
    },
    audio_id: {
      type: String,
      required: false,
    },
    slider: {
      type: Boolean,
      default: false,
    },
    slider_images: {
      type: [String],
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
