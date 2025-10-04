const express = require("express");
const cors = require("cors");
const connectDB = require("./db/conn");
const path = require("path");
const fs = require("fs");

const userRoutes = require("./router/userRouter");
const productRoutes = require("./router/productRoutes");
const productFavouritesRoutes = require("./router/favouiritesRouter");
const cartRoutes = require("./router/cardRouter");
const orderRoutes = require("./router/orderRouter");
const contactRoutes = require("./router/ContatRouter");
const offerRoutes = require("./router/offerRoutes");

const app = express();

// ✅ Connect MongoDB
connectDB();

// ✅ Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// ✅ CORS setup for local + Render + Netlify frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tubastore.netlify.app", // your frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Serve uploaded images (important for Render)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/favourites", productFavouritesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/offers", offerRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 Tuba Store Backend is Running Successfully!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
