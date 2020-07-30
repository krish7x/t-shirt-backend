const stripe = require("stripe")(process.env.SECRET_KEY);
const uuid = require("uuid/v4");

const makePayment = (req, res) => {
	const { product, token } = req.body;
	console.log("PRODUCTS..", product);

	let amount = 0;
	product.map((p) => {
		amount = Math.round(amount + p.price);
	});

	const idempotencyKey = uuid();

	return stripe.customers
		.create({
			email: token.email,
			source: token.id,
		})
		.then((customer) => {
			stripe.charges
				.create(
					{
						amount: amount * 100,
						currency: "usd",
						customer: customer.id,
						receipt_email: token.email,
						description: "test account",
						shipping: {
							name: token.card.name,
							address: {
								line1: token.card.address_line1,
								line2: token.card.address_line2,
								city: token.card.address_city,
								country: token.card.address_country,
								postal_code: token.card.address_zip,
							},
						},
					},
					{ idempotencyKey }
				)
				.then((result) => res.status(200).json(result))
				.catch((err) => console.log(err));
		});
};

module.exports = { makePayment };
