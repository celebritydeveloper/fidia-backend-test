const mongoose = require("mongoose");

import { Secrets } from "../config"

const options = {
	keepAlive: true,
	connectTimeoutMS: 30000,
	socketTimeoutMS: 0,
	useNewUrlParser: true,
	// useFindAndModify: true,
};

const connection = mongoose.createConnection(
	Secrets.DATABASE_URL,
	options,
	(error) => {
		if (error) {
			console.log('DB connection failed with the following errors: ', error);
			process.exit(1);
		}
	}
)

export default connection;
