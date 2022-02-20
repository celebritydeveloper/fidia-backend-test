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




// (async function () {
// 	try {
// 		let schemas = await Schemas()
// 		const typeDefinitions = gql`${schemas}`;

// 		const server = new ApolloServer({
// 			typeDefs: typeDefinitions,
// 			resolvers: resolvers,
// 			//plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
// 			context: async ({req, res}) => {
// 				// Check whitelisted calls. Else block left and right, everywhere
// 				let user = await getAuthenticatedAccountMiddleware(req['headers'].authorization)
// 				return ({user})
// 			}
// 		});

		

// 		await server.start();

//         server.applyMiddleware({ app });

// 		server.listen({port: Secrets.PORT, host: Secrets.HOST}).then(({url}) => {
// 			console.log(`🚀  Server ready at ${url}`);
// 		}).catch(err => {
// 			console.log(err, " Failed to start server");
// 		})
// 		// server.applyMiddleware({ app });
//   		// await new Promise(resolve => httpServer.listen({ port: Secrets.PORT }, resolve));
// 		// console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
		  
// 	} catch (e) {
// 		console.log(e, " Err.");
// 	}
// }());


(async function startApolloServer() {
	//const httpServer = http.createServer(app);
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

    	    server.listen({port: Secrets.PORT, host: Secrets.HOST}).then(({url}) => {
			console.log(`🚀  Server ready at ${url}`);
		}).catch(err => {
			console.log(err, " Failed to start server");
		});
}());

