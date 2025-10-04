const Product = require("../models/Product");
const path = require("path");

// Add product
const addProduct = async (req, res) => {
  try {
    const { name, price, category, stock, offer } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    // ✅ Correct image path for Render/production
    const imageUrl = req.file.path.replace(/\\/g, "/");

    const newProduct = {
      url: imageUrl,
      name,
      price,
      category,
      stock,
      offer: offer || 0,
      discountedPrice: offer > 0 ? price - (price * offer) / 100 : price, // auto discount
    };

    const product = await Product.create(newProduct);

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, price, category, stock, offer } = req.body;

    const updatedData = {
      name,
      price,
      category,
      stock,
      offer: offer || 0,
      discountedPrice: offer > 0 ? price - (price * offer) / 100 : price,
    };

    if (req.file) {
      updatedData.url = req.file.path.replace(/\\/g, "/");
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Recently added products (latest 1 per category)
const getProductsrecently = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$category",
          product: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$product" } },
    ]);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in getProductsrecently:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsrecently,
};
