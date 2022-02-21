/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import Joi from "joi";
import $Users from "../models/users";
require("dotenv").config();
import { Secrets } from "../config";
import {
	cryptoTokenBuffer,
	encryptPassword,
	ErrorTrap,
	ErrorTypes,
	EXTEND_PERIOD,
	extractValidationErrorMessage, generateToken, generateUniqueId,
	verifyPassword,
	sendEmail
} from '../utils';



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
            id: generateUniqueId(),
            RESET_TOKEN: cryptoTokenBuffer(43),
            RESET_TOKEN_TTL: EXTEND_PERIOD(24, "h", new Date(Date.now()))
		});

		await sendEmail({
			to: email,
			data: {
			  name: name.split(" ")[0],
			  link: `${Secrets.WEB_BASE_URL}/auth/password/reset/${data.RESET_TOKEN}`
			},
			path: "signup",
			subject: `Welcome to Fidia ${name.split(" ")[0]}`,
		});

		let token = generateToken({
			id: data.id
		});

        delete data._doc.status;
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



const login = async (payload) => {
	try {

        const {
			email,
			password,
		} = payload;

		const schema = Joi.object()
			.keys({
				email: Joi.string().email().required(),
				password: Joi.string().required(),
			});
		const validation = Joi.validate(payload, schema);

		if (validation.error) {
			return extractValidationErrorMessage(validation, null);
		}


		const user = await $Users.findOne({email});

		if (!user) {
			return {
				success: false,
				message: "👀 Sorry, login failed! 👀, are you sure this is your account? or you neva sign up 🌚?",
				error: ErrorTypes.AUTHENTICATION_ERROR
			};
		}

        if (user.status === "pending") {
			return {
				success: false,
				message: `👀You neva verify you email address, abeg check ${email} inbox to verify your account🌚?`,
				error: ErrorTypes.AUTHENTICATION_ERROR
			};
		}


		if (!verifyPassword(password, user.password)) {
			return {
				success: false,
				message: "👀 Sorry, login failed! 👀, are you sure this is your account? or you neva sign up 🌚?",
				error: ErrorTypes.AUTHENTICATION_ERROR
			};
		}

		let token = generateToken({
			id: user.id
		});
        

        delete user._doc.status;
		delete user._doc.password;

		return {
			success: true,
			message: "Successfully logged in to Fidia 👏🏾👏🏾👏🏾",
			data: user,
            token
		};
	} catch (e) {
		return new ErrorTrap(e);
	}
}



const verifyAccount = async ({ resetToken }) => {
	try {

		const account = await $Users.findOne({RESET_TOKEN: resetToken});

		if (!account) {
			return {
				success: false,
				message: "Yo, yo, yo... this token is denied. 🤺",
				data: null
			}
		}


        if (account.status === "activated") {
			return {
				success: true,
				message: "This account has already been verified... 🤺",
				data: null
			}
		}

		const CURRENT_TIME = new Date(Date.now());

		if (CURRENT_TIME.getTime() > account.RESET_TOKEN_TTL.getTime()) {
            await sendEmail({
                to: account.email,
                data: {
                  name: account.name.split(" ")[0],
                  link: `${Secrets.WEB_BASE_URL}/auth/password/reset/${account.RESET_TOKEN}`
                },
                path: "signup",
                subject: `Welcome to Fidia ${account.name.split(" ")[0]}`,
            });
			return {
				success: false,
				message: `Yo, yo, yo... Token expired. A new verification email has been sent to ${account.email} 🤺`,
				data: null
			}
		}

		account.status = "activated";
		await account.save();

		return {
			success: true,
			message: "Your brand new Fidia account has been activated.",
			data: null
		}
	} catch (e) {
		return new ErrorTrap(e)
	}
}


const resendVerificationEmail = async ({ email }) => {
	try {

		const account = await $Users.findOne({ email });

		if (!account) {
			return {
				success: false,
				message: "👀 No account related to this email address was found 😱!",
				data: null
			}
		}

		await sendEmail({
			to: account.email,
			data: {
			  name: account.name.split(" ")[0],
			  link: `${Secrets.WEB_BASE_URL}/auth/password/reset/${account.RESET_TOKEN}`
			},
			path: "signup",
			subject: `Welcome to Fidia ${account.name.split(" ")[0]}`,
		});

		account.RESET_TOKEN_TTL = EXTEND_PERIOD(24, "h", new Date(Date.now()))
		await account.save();

		return {
			success: true,
			message: `Verification email has been sent to ${email}`,
			data: null
		}
	} catch (e) {
		return new ErrorTrap(e)
	}
}







// /**
//  * To Update a user account as an account owner
//  * @param id
//  * @param body
//  */
const listUsers = async () => {
	try {

        const query = {status: "activated"};

		let user = await $Users.find(query, {password: false}).sort({_id: -1});
        
        const count = await $Users.countDocuments(query);

		return {
			success: true,
			message: "⚡️ Fetched all users successfully 🚀",
			data: user,
            count
		}

	} catch (e) {
		return new ErrorTrap(e)
	}
}



export default {
	register,
	login,
    verifyAccount,
    resendVerificationEmail,
    listUsers
};
