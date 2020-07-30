const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 32,
      required: true,
      unique: true,
    },
  },
  { timestamps: true } //It will records the time whenever we make changes in the Schemas
);

module.exports = mongoose.model("Category", CategorySchema);
