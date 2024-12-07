
const bcrypt = require('bcrypt');
const ApiResponse = require('../utils/ApiResponse');
const sendVerificationEmail = require('../helpers/registerEmail');
const User = require('../models/user');


const generateAccessAndRefereshTokens = async (userId) => {
	try {
		const user = await User.findById(userId)
		const accessToken = user.generateAccessToken()
		const refreshToken = user.generateRefreshToken()

		user.refreshToken = refreshToken
		await user.save({ validateBeforeSave: false })

		return { accessToken, refreshToken }


	} catch (error) {
		throw new ApiError(500, "Something went wrong while generating referesh and access token")
	}
}

const registerUser = async (req, res) => {
	try {

		const { username, email, password } = req.body;
		console.log('username, email, password', username, email, password);

		if ([email, username, password].some((field) => field?.trim() === "")) {
			throw new ApiError(400, "All fields are required")
		}

		// Check if the user already exists and is verified
		const existingUserByVerification = await User.findOne({ username, isVerified: true });
		if (existingUserByVerification) {
			return res.status(400).json({
				success: false,
				message: 'User already exists'
			});

		}

		const existingUserByEmail = await User.findOne({ email });

		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		if (existingUserByEmail) {
			if (existingUserByEmail.isVerified) {
				return res.status(400).json({
					success: false,
					message: 'User already exists with this email and verified'
				});
			} else {
				// User exists but not verified, update their details
				const hashedPassword = await bcrypt.hash(password, 10);
				existingUserByEmail.password = hashedPassword;
				existingUserByEmail.verifyCode = verifyCode;
				existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);  // OTP expires in 1 hour
				await existingUserByEmail.save();
			}
		} else {
			// New user, create user and save details
			const hashedPassword = await bcrypt.hash(password, 10);
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);

			const newUser = await User.create({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry: expiryDate,
				isVerified: false,
			});



			// Send verification email with OTP
			const emailResponse = await sendVerificationEmail(email, username, verifyCode);
			if (!emailResponse.success) {

				return res.status(500).json({
					success: false,
					message: emailResponse.message
				});
			}

			console.log("email:::", emailResponse);


			const createdUser = await User.findById(newUser._id).select(
				"-password -refreshToken"
			)

			return res.status(201).json(
				new ApiResponse(200, createdUser, "User registered Successfully")
			)
		}

	} catch (error) {

		console.error('Error User registration: ', error);
		return res.status(500).json({
			success: false,
			message: 'Error during user registration. Please try again later.'
		});
	}
};


const loginUser = async (req, res) => {
	// req body -> data
	// username or email
	//find the user
	//password check
	//access and referesh token
	//send cookie

	const { email, password } = req.body
	console.log(email);


	// Here is an alternative of above code based on logic discussed in video:
	if (!(password || email)) {
		throw new ApiError(400, "username or email is required")

	}

	const user = await User.findOne({
		$or: [{ email }]
	})

	if (!user) {
		throw new ApiError(404, "User does not exist")
	}

	const isPasswordValid = await user.isPasswordCorrect(password)

	if (!isPasswordValid) {
		throw new ApiError(401, "Invalid user credentials")
	}

	const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

	const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

	const options = {
		httpOnly: true,
		secure: true
	}

	return res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					user: loggedInUser, accessToken, refreshToken
				},
				"User logged In Successfully"
			)
		)

}

const logoutUser = async (req, res) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$unset: {
				refreshToken: 1 // this removes the field from document
			}
		},
		{
			new: true
		}
	)

	const options = {
		httpOnly: true,
		secure: true
	}

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json(new ApiResponse(200, {}, "User logged Out"))
}

const refreshAccessToken = async (req, res) => {

	const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

	if (!incomingRefreshToken) {
		throw new ApiError(401, "unauthorized request")
	}

	try {
		const decodedToken = jwt.verify(
			incomingRefreshToken,
			process.env.REFRESH_TOKEN_SECRET
		)

		const user = await User.findById(decodedToken?._id)

		if (!user) {
			throw new ApiError(401, "Invalid refresh token")
		}

		if (incomingRefreshToken !== user?.refreshToken) {
			throw new ApiError(401, "Refresh token is expired or used")

		}

		const options = {
			httpOnly: true,
			secure: true
		}

		const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

		return res
			.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", newRefreshToken, options)
			.json(
				new ApiResponse(
					200,
					{ accessToken, refreshToken: newRefreshToken },
					"Access token refreshed"
				)
			)
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid refresh token")
	}

}



module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken };
