const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      default: "Other",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    offer: {
      type: Number,
      min: 0,
      max: 70,
      default: 0,
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ✅ Automatically calculate discountedPrice before save
productSchema.pre("save", function (next) {
  if (this.offer > 0) {
    this.discountedPrice = this.price - (this.price * this.offer) / 100;
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

// ✅ Virtual field to build full image URL for Render / Netlify frontend
productSchema.virtual("imageUrl").get(function () {
  if (this.url.startsWith("http")) {
    // already a full URL (for example, from Cloudinary)
    return this.url;
  }
  // 👇 change this to your Render backend base URL
  return `https://tuba-8yh1.onrender.com/${this.url.replace(/\\/g, "/")}`;
});

productSchema.set("toJSON", { virtuals: true }); // include virtual field in API response

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
