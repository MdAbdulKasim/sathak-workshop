import { Router } from "express";
import multer from "multer";
import {
  createUser,
  login,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  getUserByName,
  getUserByEmail,
  updateUser,
  deleteUser,
  createProduct,
  getAllProducts,
  getProductById,
  getProductByName,
  getProductByCategory,
  updateProduct,
  deleteProduct,
} from "./controller";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ---------- User Auth ----------
router.post("/users", createUser);
router.post("/users/login", login);
router.post("/users/verify-otp", verifyOtp);
router.post("/users/forgot-password", forgotPassword);
router.post("/users/reset-password", resetPassword);

// ---------- User CRUD ----------
router.get("/users", getAllUsers);
router.get("/users/id/:id", getUserById);
router.get("/users/name/:name", getUserByName);
router.get("/users/email/:email", getUserByEmail);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// ---------- Product CRUD ----------
router.post("/products", upload.single("image"), createProduct);
router.get("/products", getAllProducts);
router.get("/products/id/:id", getProductById);
router.get("/products/name/:name", getProductByName);
router.get("/products/category/:category", getProductByCategory);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
