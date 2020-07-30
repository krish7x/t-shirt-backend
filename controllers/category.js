const Category = require("../models/category");

const getCategoryById = (req, res, next, id) => {
	Category.findById(id).exec((err, cate) => {
		if (err) {
			return res.status(400).json({
				error: "Category not found in DB",
			});
		}
		req.category = cate;
		next();
	});
};

const createCategory = (req, res) => {
	const category = new Category(req.body);
	category.save((err, category) => {
		if (err) {
			return res.status(400).json({
				error: "Category already exist in DB",
			});
		}
		res.json({ category });
	});
};

const getCategory = (req, res) => {
	return res.json(req.category);
};

const getAllCategory = (req, res) => {
	Category.find().exec((err, items) => {
		if (err) {
			res.status(400).json({
				error: "Cannot fetch all categories",
			});
		}
		res.json(items);
	});
};

const updateCategory = (req, res) => {
	const category = req.category;
	category.name = req.body.name;

	category.save((err, category) => {
		if (err) {
			res.status(400).json({
				error: "Cannot update categories",
			});
		}
		res.json(category);
	});
};

const deleteCategory = (req, res) => {
	const category = req.category;

	category.remove((err, category) => {
		if (err) {
			res.status(400).json({
				error: "Failed to delete category",
			});
		}
		res.json({
			message: "Category deleted sucessfully",
		});
	});
};

module.exports = {
	getCategoryById,
	createCategory,
	getCategory,
	getAllCategory,
	updateCategory,
	deleteCategory,
};
