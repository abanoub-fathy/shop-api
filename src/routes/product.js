const express = require("express");
const productController = require("../controllers/product");
const router = express.Router();

// auth middleware
const auth = require("../middleware/auth");
const authAdmin = require("..//middleware/authAdmin");

// create product
router.post("/", auth, authAdmin, productController.createProduct);

// get all products
router.get("/", auth, productController.viewProducts);

// get single product
router.get("/:id", auth, productController.viewSingleProduct);

// update single product
router.patch("/:id", auth, authAdmin, productController.updateProduct);

// delete single product
router.delete("/:id", auth, authAdmin, productController.deleteProduct);

module.exports = router;
