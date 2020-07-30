const User = require("../models/user");
const Order = require("../models/order");

const getUserById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "No user was found in DB",
			});
		}
		req.profile = user;
		next();
	});
};

const getUser = (req, res) => {
	req.profile.salt = undefined;
	req.profile.encry_password = undefined;
	req.profile.__v = undefined;
	return res.json(req.profile);
};

const updateUser = (req, res) => {
	User.findOneAndUpdate(
		{ _id: req.profile._id },
		{ $set: req.body },
		{ new: true, useFindAndModify: false },
		(err, user) => {
			if (err || !user) {
				return res.status(400).json({
					error: "You are not authorized to update information",
				});
			}
			user.salt = undefined;
			user.encry_password = undefined;
			res.json(user);
		}
	);
};

const userPurchaseList = (req, res) => {
	Order.find({ _id: req.profile.id })
		.populate("user", "_id name")
		.exec((err, order) => {
			if (err) {
				return res.status(400).json({
					error: "There is no purchases for this user",
				});
			}
			res.json(order);
		});
};

const pushOrderInPurchaseList = (req, res, next) => {
	let purchases = [];

	req.body.order.prodcuts.forEach((product) => {
		purchases.push({
			_id: product.id,
			name: product.name,
			description: product.description,
			categoty: product.categoty,
			quantity: product.quantity,
			amount: req.body.order.amount,
			transaction_id: req.body.order.transaction_id,
		});
	});
	//Store this information in DB
	User.findByIdAndUpdate(
		{
			_id: req.profile._id,
		},
		{ $push: { purchases: purchases } },
		{ new: true },
		(err, purchases) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to save the purchase list",
				});
			}
		}
	);
	next();
};

//This code is used to get all the users information TODO: Later delete this code

// const getAllUsers = (req, res) => {
// 	User.find().exec((err, user) => {
// 		if (err || !user) {
// 			return res.status(400).json({
// 				error: "No users were found in a DB!",
// 			});
// 		}
// 		res.json(user);
// 	});
// };

module.exports = {
	getUserById,
	getUser,
	updateUser,
	userPurchaseList,
	pushOrderInPurchaseList,
};
