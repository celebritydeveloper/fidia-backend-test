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
}