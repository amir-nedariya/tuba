// router/productRoutes.js
const express = require("express");
const { authenticateToken, isAdmin } = require("../Middleware/authMiddleware");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getProductsrecently,
} = require("../controllers/productController");

const upload = require("../Middleware/upload"); // <-- new

const router = express.Router();

// add product (admin) - field name should be "url" (same as you used earlier)
router.post("/", authenticateToken, isAdmin, upload.single("url"), addProduct);
router.put("/:id", authenticateToken, isAdmin, upload.single("url"), updateProduct);
router.delete("/:id", authenticateToken, isAdmin, deleteProduct);

router.get("/", getProducts);
router.get("/recently", getProductsrecently);
router.get("/:id", getProductById);

module.exports = router;
