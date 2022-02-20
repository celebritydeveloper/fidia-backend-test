import {AuthenticationError, ForbiddenError} from "apollo-server";
import {verifyToken} from "../utils";
import $Users from '../models/users'

export const checkAuthenticatedUser = (ctx) => {
	if (ctx.user == null) {
		return new AuthenticationError("Sorry, no sorry 😡... you must be authenticated to continue 🤺")
	}

	return null
}

export const checkAuthorization = (original, allowed) => {
	if (original !== allowed) {
		return new ForbiddenError("Ehn?, you shall not pass! no be you get this business 😡")
	}

	return null
}


export const getAuthenticatedAccountMiddleware = async (authorization) => {
	try {

		if (!authorization) {
			return null
		}

		if (String(authorization).trim().length === 0) {
			return null
		}

		const Bearer = "bearer "
		const token = authorization.substring(Bearer.length, authorization.length)


		let decoded = await verifyToken(token)

		let user = await $Users.findOne({id: decoded.id})
		if (!user) {
			return null
		}
		return user
	} catch (e) {
		return null
	}
}
