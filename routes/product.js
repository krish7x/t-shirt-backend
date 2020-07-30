const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
	getProductById,
	createProduct,
	getProduct,
	getAllProducts,
	photo,
	updateProduct,
	deleteProduct,
	getAllUniqueCategories,
} = require("../controllers/product");

//params
router.param("userId", getUserById);
router.param("productId", getProductById);

//routes

//create route
router.post(
	"/product/create/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	createProduct
);

//get route
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//update route

router.put(
	"/product/:productId/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateProduct
);

//delete route

router.delete(
	"/product/:productId/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	deleteProduct
);

//listing products route

router.get("/products", getAllProducts);

//listing distinct categories

router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
