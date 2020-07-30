const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

//  **** SIGNUP AUTHENTICATION ******
const signup = (req, res) => {
	//the method for validationResult which gives out a msg
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	//destructuring email to check if already exists while sigining up!
	const { email } = req.body;

	User.findOne({ email }, (err, user) => {
		//email checking
		if (err || user) {
			return res.status(400).json({
				error: "E-Mail already has been registered",
				suggestion: "Try some other E-mail",
			});
		} else {
			//this error will rise when we have a problem while saving the data
			const user = new User(req.body);
			user.save((err, user) => {
				if (err) {
					return res.status(400).json({
						err: "Failed to add user in DB",
					});
				}
				//the output will be of  like these params
				res.json({
					name: user.name,
					email: user.email,
					id: user._id,
					password: user.encry_password,
				});
			});
		}
	});
};

//  **** SIGNIN AUTHENTICATION ******

const signin = (req, res) => {
	//validating the errors
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	//destructing email and password
	const { email, password } = req.body;

	User.findOne({ email }, (err, user) => {
		//email checking
		if (err || !user) {
			return res.status(400).json({
				error: "E-Mail doesn't exist in DB!",
			});
		}
		//password checking
		if (!user.authenticate(password)) {
			return res.status(401).json({
				error: "E-mail and Password does not match",
			});
		}

		//creating a token
		const token = jwt.sign({ _id: user._id }, process.env.SECRET);

		//put token into a cookie

		res.cookie("token", token, { expire: new Date() + 9999 });

		//send response to  front-end

		const { _id, name, email, role } = user;
		return res.json({ token, user: { _id, name, email, role } });
	});
};

//  **** SIGNOUT AUTHENTICATION ******

const signout = (req, res) => {
	//Method comes from cookieParser()
	res.clearCookie("token");

	res.json({
		message: "User Signed Out Sucessfully",
	});
};

const isSignedIn = expressJwt({
	secret: process.env.SECRET,
	userProperty: "auth",
});

//Custom middle wares

// profile -> from front-end , auth-> from signedIn(expressJewt), profile._id -> front-end profile id
const isAuthenticated = (req, res, next) => {
	let checker = req.profile && req.auth && req.profile._id == req.auth._id;

	if (!checker) {
		return res.status(403).json({
			error: "ACCESS DENIED",
		});
	}

	next();
};

const isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		res.status(403).json({
			error: "You are not an admin, ACCESS DINED!",
		});
	}

	next();
};

module.exports = {
	signout,
	signup,
	signin,
	isSignedIn,
	isAuthenticated,
	isAdmin,
};
