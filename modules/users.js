/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import Joi from "joi";
import $Users from "../models/users";
import {
	cryptoTokenBuffer,
	encryptPassword,
	ErrorTrap,
	ErrorTypes,
	EXTEND_PERIOD,
	extractValidationErrorMessage, generateToken, generateUniqueId,
	verifyPassword,
	//sendMail
} from '../utils';

/**
 *  List Users.
 * @param filters
 * @return {Promise<ErrorTrap|{data: *, success: boolean, count}>}
 */
const listUsers = async (filters) => {
	try {
		const {
			pageCursor,
			limit,
			query,
			status,
			iso2
		} = filters;


		const q = {};

		if (query) {
			const newQuery = String(query).split(' ').join('|');
			q.$or = [
				{
					firstName: {
						$regex: `^(${newQuery})`,
						$options: 'i'
					}
				},
				{
					lastName: {
						$regex: `^(${newQuery})`,
						$options: 'i'
					}
				},
				{
					email: {
						$regex: `^(${newQuery})`,
						$options: 'i'
					}
				},
				{
					phone: {
						$regex: `^(${newQuery})`,
						$options: 'i'
					}
				},
			];
		}

		if (status) {
			q.status = String(status).toLowerCase();
		}
		if (iso2) {
			q.iso2 = String(iso2).trim().toUpperCase()
		}

		const data = await $Users.find(q, {
			password: false,
			RESET_TOKEN_TTL: false,
			RESET_TOKEN: false
		})
			.sort({_id: -1})
			.limit(Number(limit) || 100);


		const count = await $Users.countDocuments(q);
		return {
			success: true,
			data,
			count
		};
	} catch (e) {
		return new ErrorTrap(e);
	}
};


/**
 * To Create an user.
 * @param body
 */

const register = async (payload) => {
	try {
		const {
			email,
			password,
			name,
            phone,
            country
		} = payload;

		const schema = Joi.object()
			.keys({
				name: Joi.string().required(),
				email: Joi.string().email().required(),
				password: Joi.string().required(),
                phone: Joi.string().required(),
                country: Joi.string().required(),
			});
		const validation = Joi.validate(payload, schema);

		if (validation.error) {
			return extractValidationErrorMessage(validation, null);
		}

		payload.password = encryptPassword(password)
		delete payload.confirmPassword

		const existingUser = await $Users.findOne({ email });

		if (existingUser) {
			return {
				success: false,
				message: 'Sorry, there exists an account with this email.',
				error: ErrorTypes.ENTRY_EXISTS,
			};
		}

		const data = await $Users.create({
			...payload,
			firstName: name.split(" ")[0],
			lastName: name.split(" ")[1],
			id: generateUniqueId()
		});

		// await sendMail({
		// 	to: email,
		// 	data: {
		// 	  name: name.split(" ")[0],
		// 	  link: "https://fj-lite.netlify.app"
		// 	},
		// 	path: "signup",
		// 	subject: `Welcome to Spire ${name.split(" ")[0]}`,
		// });

		let token = generateToken({
			id: data.id
		});

		delete data.password;
		delete data._doc.password;
		return {
			success: true,
			message: 'Successfully registered on Fidia 👏🏾👏🏾👏🏾',
			data,
			token,
		};
	} catch (e) {
		return new ErrorTrap(e);
	}
};



const login = async ({email, password}) => {
	try {

		const schema = Joi.object()
			.keys({
				email: Joi.string().email().required(),
				password: Joi.string().required(),
			});
		const validation = Joi.validate({email, password}, schema);

		if (validation.error) {
			return extractValidationErrorMessage(validation, null);
		}


		const user = await $Users.findOne({email});

		if (!user) {
			return {
				success: false,
				message: '👀 Sorry, login failed! 👀, are you sure this is your account? or you neva sign up 🌚?',
				error: ErrorTypes.AUTHENTICATION_ERROR
			};
		}


		if (!verifyPassword(password, user.password)) {
			return {
				success: false,
				message: '👀 Sorry, login failed! 👀, are you sure this is your account? or you neva sign up 🌚?',
				error: ErrorTypes.AUTHENTICATION_ERROR
			};
		}

		let token = generateToken({
			id: user.id
		})

		delete user.password;
		delete user._doc.password;
		return {
			success: true,
			message: 'Successfully logged in to spire feedjet 👏🏾👏🏾👏🏾',
			data: {
				user,
				token
			}
		};
	} catch (e) {
		return new ErrorTrap(e);
	}
}







// /**
//  * To Update a user account as an account owner
//  * @param id
//  * @param body
//  */
// const update = async (id = undefined, body = {}) => genericUpdate(id, body, {
//     id: Joi.string()
//         .required(),
//     firstName: Joi.string()
//         .optional(),
//     lastName: Joi.string()
//         .optional(),
//     middleName: Joi.string()
//         .optional(),
//     phone: Joi.string()
//         .regex(/([0-9])/)
//         .max(15)
//         .optional(),
//     profilePicture: Joi.string()
//         .optional()
// });

const forgotPassword = async ({email}) => {
	try {
		const schema = Joi.object()
			.keys({
				email: Joi.string().email().required(),
			});
		const validation = Joi.validate({email}, schema);

		if (validation.error) {
			return extractValidationErrorMessage(validation, null);
		}


		let user = await $Users.findOne({email})
		if (!user) {
			return {
				success: true,
				message: "⚡️ You will receive a password reset email if you have an account with us. Kindly check your email inbox. 🚀",
				data: null
			}
		}

		// generate crazy key.
		user.RESET_TOKEN = cryptoTokenBuffer(43)
		// Extend now by 15minutes.
		user.RESET_TOKEN_TTL = EXTEND_PERIOD(15, "m", new Date(Date.now()))

		await user.save()

		let link = `${process.env.WEB_BASE_URL}/auth/password/reset/${user.RESET_TOKEN}`

		console.log("Reset Token: => ", user.RESET_TOKEN);

		// Build email template here..
		await sendEmail('RESET_PASSWORD', {
			to: [email],
			subject: 'You or someone have requested for a password reset on your account 😱!',
			props: {
				email,
				link,
				WEB_BASE_URL: process.env.WEB_BASE_URL
			}
		});


		return {
			success: true,
			message: "⚡️ You will receive a password reset email if you have an account with us. Kindly check your email inbox. 🚀",
			data: null
		}

	} catch (e) {
		return new ErrorTrap(e)
	}
}

// const resetPassword = async ({resetToken, password, repeat_password}) => {
// 	try {
// 		const account = await $Users.findOne({RESET_TOKEN: resetToken});
// 		if (!account) {
// 			return {
// 				success: true,
// 				message: 'Yo, yo, yo... this token is denied. 🤺',
// 				data
// 			}
// 		}

// 		const CURRENT_TIME = new Date(Date.now());

// 		if (CURRENT_TIME.getTime() > account.RESET_TOKEN_TTL.getTime()) {
// 			return {
// 				success: true,
// 				message: 'Yo, yo, yo... this token is denied. 🤺',
// 				data: null
// 			}
// 		}

// 		// encrypt new pass and send email.

// 		account.password = encryptPassword(password)
// 		await account.save()

// 		// Build email template here..
// 		await sendEmail('RESET_PASSWORD_SUCCESS', {
// 			to: [account.email],
// 			subject: 'You have successfully reset your password',
// 			props: {
// 				WEB_BASE_URL: process.env.WEB_BASE_URL
// 			}
// 		});

// 		return {
// 			success: true,
// 			message: 'Password reset success, please login with your new password to continue',
// 			data: null
// 		}
// 	} catch (e) {
// 		return new ErrorTrap(e)
// 	}
// }


export default {
	//resetPassword,
	register,
	//forgotPassword,
	login,
};
