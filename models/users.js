/*
User schema
*/
//import MongooseValidation from 'mongoose-beautiful-unique-validation';
//import MongooseDelete from 'mongoose-delete';
import mongoose from 'mongoose';
import connection from './connection';
//import {generateUniqueId} from "../utils";


const {Schema} = mongoose;

const UserSchema = new Schema({
	id: {
		type: String,
		//default: generateUniqueId(),
		unique: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: 'Two users cannot share the same email ({VALUE})',
		sparse: true,
		trim: true,
		lowercase: true,
	},
	phone: {
		type: String,
		sparse: true,
		required: false
	},
	password: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: ["activated", "pending", "deactivated"],
		required: false,
		default: "pending",
	},
	RESET_TOKEN: {
		type: String,
		required: false
	},
	RESET_TOKEN_TTL: {
		type: Date,
		required: false
	},
},
{
	timestamps: true
}
);

// UserSchema.index({
// 	firstName: 'text',
// 	lastName: 'text',
// 	email: 'text',
// 	phone: 'text',
// });

// UserSchema.plugin(MongooseValidation);
// UserSchema.plugin(MongooseDelete, {overrideMethods: 'all'});

export default connection.model('users', UserSchema);
