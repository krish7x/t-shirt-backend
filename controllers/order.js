const { Order, ProductCart } = require("../models/order");

const getOrderById = (req, res, id, next) => {
	Order.findById(id)
		.populate("products.product", "name price")
		.exec((err, order) => {
			if (err) {
				return res.status(400).json({
					error: "Cannot get the order Id",
				});
			}
			req.order = order;
			next();
		});
};

const createOrder = (req, res) => {
	req.body.order.user = req.profile;

	const order = new Order(req.body.order);

	order.save((err, order) => {
		if (err) {
			return res.status(400).json({
				error: "Cannot save an order",
			});
		}
		res.json(order);
	});
};

const getAllOrders = (req, res) => {
	Order.find()
		.populate("user", "._id name")
		.exec((err, order) => {
			if (err) {
				return res.status(400).json({
					error: "Cannot get all the orders",
				});
			}
			res.json(order);
		});
};

const getOrderStatus = (req, res) => {
	res.json(Order.schema.path("status").enumValues);
};

const updateStatus = (req, res) => {
	Order.update(
		{ _id: req.body.orderId },
		{ $set: { status: req.body.status } },
		(err, update) => {
			if (err) {
				return res.status(400).json({
					error: "Cannot update the status of an order",
				});
			}
			res.json(order);
		}
	);
};

module.exports = {
	getOrderById,
	createOrder,
	getAllOrders,
	getOrderStatus,
	updateStatus,
};
