import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadProductImage);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
