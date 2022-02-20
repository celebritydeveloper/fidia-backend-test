//import bcrypt from 'bcrypt-nodejs';
//import axios from 'axios';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import APP_ROOT from 'app-root-path';
import { Secrets } from "../config";
//import mailer from 'express-mailer';
import path from 'path';
//import {monotonicFactory} from 'ulid'
//import sendGridEmail from './sendgrid';
//const ulid = monotonicFactory()

const app = require('express')();

require('dotenv').config();

app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'pug');

// mailer.extend(app, {
// 	host: process.env.EMAIL_HOST,
// 	port: process.env.EMAIL_PORT,
// 	auth: {
// 		user: process.env.EMAIL_USERNAME,
// 		pass: process.env.EMAIL_PASSWORD
// 	}
// });





/**
 * Error Types.
 * @type {{
 * ENTRY_NOT_FOUND: string,
 * FATAL_ERROR: string,
 * AUTHORISATION_ERROR: string,
 * VALIDATION_ERROR: string,
 * ENTRY_DELETED: string,
 * ENTRY_EXISTS: string
 * }}
 */
export const ErrorTypes = {
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	FATAL_ERROR: 'FATAL_ERROR',
	ENTRY_EXISTS: 'ENTRY_EXISTS',
	ENTRY_DELETED: 'ENTRY_DELETED',
	ENTRY_NOT_FOUND: 'ENTRY_NOT_FOUND',
	AUTHORISATION_ERROR: 'AUTHORISATION_ERROR',
	AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
	TOKEN_EXPIRED: 'TOKEN_EXPIRED',
	PERMISSION_ERROR: 'PERMISSION_ERROR',
	TOKEN_INVALID: 'TOKEN_INVALID'
};

export class ErrorTrap {
	constructor(e) {
		if (e.name !== 'ValidationError') {
			console.log(e, ' Error Caught In Error Trap.'); // TODO: Plug ElasticAPM Here.
		}
		this.message = e.message;
		this.success = false;
		this.error = ErrorTypes.FATAL_ERROR;
	}
}


export const StatusCodeHandler = (error = undefined) => {
	switch (error) {
		case ErrorTypes.ENTRY_NOT_FOUND:
			return 404;
		case ErrorTypes.VALIDATION_ERROR:
			return 400;
		case ErrorTypes.ENTRY_EXISTS:
			return 400;
		case ErrorTypes.AUTHENTICATION_ERROR:
			return 401;
		case ErrorTypes.TOKEN_EXPIRED:
			return 401;
		case ErrorTypes.TOKEN_INVALID:
			return 401;
		case ErrorTypes.AUTHORISATION_ERROR:
			return 403;
		case ErrorTypes.PERMISSION_ERROR:
			return 403;
		case ErrorTypes.FATAL_ERROR:
			return 500;
		default:
			return 200;
	}
};

/**
 * This generates an alphanumeric ID,
 * based on the number of characters provided.
 * @param {Number} length
 * @returns String
 */
export const generateId = (length = 10) => { // Default length is 10 Characters;
	let result = '';
	const chars = length === 10 ? '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!\\&$%#*^?' : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (let i = length; i > 0; --i) { // eslint-disable-line
		result += chars[parseInt(crypto.randomBytes(1).toString('hex'), 16) % chars.length];
	}

	return result;
};

// export const generateUniqueId = () => {
// 	return String(ulid()).toLowerCase()
// }

/**
 * Adds time to a date.
 * Example: EXTEND_TIME(new Date(Date.now()), 'minute', 30)  //returns 30 minutes = now.
 * @param {Date} CURRENT_PERIOD  DateTime to start with
 * @param amount
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second.
 */
export const EXTEND_PERIOD = (
	amount,
	interval,
	CURRENT_PERIOD = new Date()
) => moment(CURRENT_PERIOD)
	.add(Number(amount), interval)
	.toDate();

/**
 * Verify a password provided with the hash of the password;
 * @param providedPassword
 * @param hashedPassword
 * @returns {boolean}
 */
// export const verifyPassword = (providedPassword, hashedPassword) => {
// 	try {
// 		return Boolean(bcrypt.compareSync(providedPassword, hashedPassword));
// 	} catch (e) {
// 		return false;
// 	}
// };


/**
 * Hashes a provided password;
 * Returns a hash;
 * @param providedPassword
 * @returns string
 */
// export const encryptPassword = providedPassword => bcrypt
// 	.hashSync(providedPassword, bcrypt.genSaltSync(10));

/**
 * Token Verification Default Options.
 * @type {{issuer: string}}
 */
export const verifyTokenOptions = {
	issuer: 'Spirē Technologies Inc.',
	subject: 'SPIRĒ Tech Gunjalis ⚡️ [Author: Justice Nefe & Kells Gingerman.]',
	audience: ['World'],
	algorithms: ['HS256']
};


/**
 * Generate and sign a token for a user.
 * @param data
 * @returns {*}
 */
export const generateToken = (data) => {
	const signOptions = {
		issuer: 'Spirē Technologies Inc.',
		subject: 'SPIRĒ Tech Gunjalis ⚡️ [Author: Justice Nefe & Kells Gingerman.]',
		audience: ['World'],
		algorithm: 'HS256',
	};
	// signOptions.maxAge = timeToLive;

	return jwt.sign(data, Secrets.JWT_TOKEN, signOptions);
};

/**
 * Verify a user's JWT token.
 * @param token
 * @returns {void|*}
 */
export const verifyToken = async (token) => {
	return jwt.verify(token, Secrets.JWT_TOKEN, verifyTokenOptions);
};
/**
 *
 * @returns {*}
 * @param validation
 * @param message
 */
export const extractValidationErrorMessage = (validation, message = undefined) => ({
	success: false,
	message: message || validation.error.details[0].message,
	error: ErrorTypes.VALIDATION_ERROR
});


export const CleanStringToLower = str => str.replace(/\s+/igm, '-')
	.toLowerCase();

/**
 * Generate a random crypto token.
 * @param length
 * @returns {string}
 */
export const cryptoTokenBuffer = (length = 56) => crypto.randomBytes(length)
	.toString('hex');

/**
 *
 * @param TEMPLATE (Templates are found in APP_PATH/views/email/)
 * @param subject
 * @param to
 * @param props
 * @param message
 * @returns {*}
 */

//export const sendMail = sendGridEmail;

// export const sendEmail = (TEMPLATE, {
// 	subject = '',
// 	to = [],
// 	props = {},
// }) => {
// 	if (process.env.NODE_ENV === 'test') {
// 		return true;
// 	}
// 	const cb = (err, info) => {
// 		if (err) {
// 			console.error(err, ' :=> Error Response = Mailer');
// 			return false;
// 		}
// 		console.info(info, ' :=> Info Response = Mailer');
// 		return true;
// 	};
// 	const modifiedProps = {
// 		...props,
// 		currentYear: new Date().getFullYear(),
// 		feedBackMail: 'fire@spire.africa',
// 		feedbackPhone: '0812SPIRE-NATION'
// 	};
// 	return app['mailer'].send(`${APP_ROOT}/views/emails/${TEMPLATE}`, {
// 		from: process.env.EMAIL_USERNAME,
// 		to, // REQUIRED. This can be a comma delimited string just like a normal email `to` field.
// 		subject,
// 		APP_URL: process.env.WEB_BASE_URL,
// 		...modifiedProps
// 		// All additional properties are also passed to the template as local
// 		// variables.
// 	}, cb);
// };

// export const cleanEmpty = obj => {
// 	if (Array.isArray(obj)) {
// 		return obj
// 			.map(v => (v && typeof v === 'object') ? cleanEmpty(v) : v)
// 			.filter(v => !(v == null));
// 	} else {
// 		return Object.entries(obj)
// 			.map(([k, v]) => [k, v && typeof v === 'object' ? cleanEmpty(v) : v])
// 			.reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {});
// 	}
// }
