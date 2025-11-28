const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "An article must have a title"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    summary: {
      type: String,
      required: [true, "An article must have a summary"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "An article must have content"],
    },
    image: {
      type: String,
      default: "default-blog.jpg",
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "An article must have an author"],
    },
    published: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

articleSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
