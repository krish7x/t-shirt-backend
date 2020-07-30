const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
	product: {
		type: ObjectId,
		ref: "Product",
	},
	name: String,
	count: Number,
	price: Number,
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

const OrderSchema = new mongoose.Schema(
	{
		products: [ProductCartSchema],
		transaction_id: {},
		amount: {
			type: Number,
			required: true,
		},
		address: {
			type: String,
			required: true,
			maxlength: 500,
			trim: true,
		},
		status: {
			type: String,
			default: "Received",
			enum: ["Shipped", "Cancelled", "Processing", "Delivered", "Received"],
		},
		updated: {
			type: Date,
			required: true,
		},
		user: {
			type: ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, ProductCart };
