import Users from "../modules/users";
import { ApolloError } from "apollo-server";
import { checkAuthenticatedUser } from "../middlewares";


export default {

	async listUsers(_, x, ctx) {
		if (checkAuthenticatedUser(ctx)) {
			return checkAuthenticatedUser(ctx)
		}

		let userOutput = await Users.listUsers();
		if (userOutput.error) {
			return new ApolloError(userOutput.error);
		}

		return userOutput;
	},
}
