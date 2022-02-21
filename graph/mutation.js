import Users from "../modules/users"
import {checkAuthenticatedUser } from "../middlewares";
import { ApolloError } from "apollo-server";
const randomstring = require("randomstring");

export default {
	async register(_, args, ctx) {
		return await Users.register(args.payload);
	},
	async login(_, args, ctx) {
		return await Users.login(args.payload);
	},
	async verifyAccount(_, args, ctx) {
		return await Users.verifyAccount(args);
	},
	async resendVerificationEmail(_, args, ctx) {
		return await Users.resendVerificationEmail(args);
	},

	// async getUserBusiness(_, args, ctx) {
	// 	if (checkAuthenticatedUser(ctx)) {
	// 		return checkAuthenticatedUser(ctx)
	// 	}

	// 	let businessOutput = await Businesses.getBusinessById(ctx.user.id)
	// 	if (businessOutput.error) {
	// 		return new ApolloError(businessOutput.error)
	// 	}

	// 	const business = businessOutput.data

	// 	if (checkAuthorization(business.userId, ctx.user.id)) {
	// 		return checkAuthorization(business.userId, ctx.user.id)
	// 	}

	// 	return business
	// },

	// async forgotPassword(_, args, ctx) {
	// 	return await Users.forgotPassword(args)
	// },
	// async resetPassword(_, args, ctx) {
	// 	return await Users.resetPassword(args)
	// },
}