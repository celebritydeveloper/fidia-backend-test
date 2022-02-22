import {ApolloServer, gql} from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import Schemas from "./graph/schemas";
import resolvers from "./graph"
import { getAuthenticatedAccountMiddleware } from "./middlewares";
import { Secrets } from "./config";
const cors = require("cors")
require("dotenv").config();
import express from "express";
const app = express();

const WhitelistedCalls = ["login"];
app.use(cors());
app.options("*", cors());


async function startApolloServer() {
	let schemas = await Schemas()
	const typeDefinitions = gql`${schemas}`;

	const server = new ApolloServer({
	  typeDefs: typeDefinitions,
	  resolvers: resolvers,
	  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
	  context: async ({req, res}) => {
		// Check whitelisted calls. Else block left and right, everywhere
		let user = await getAuthenticatedAccountMiddleware(req['headers'].authorization)
		return ({ user })
	  }  
	});

    	    server.listen({ port: process.env.PORT || 4000 }).then(({url}) => {
			console.log(`🚀  Server ready at ${url}`);
		}).catch(err => {
			console.log(err, " Failed to start server");
		});
};

startApolloServer();

module.exports = app;

