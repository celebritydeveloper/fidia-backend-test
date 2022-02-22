/*
User schema
*/
//import MongooseValidation from 'mongoose-beautiful-unique-validation';
//import MongooseDelete from 'mongoose-delete';
import mongoose from 'mongoose';
import connection from '../database/index';
import {generateUniqueId} from "../utils";


const {Schema} = mongoose;

const UserSchema = new Schema({
	id: {
		type: String,
		default: generateUniqueId(),
		unique: true
	},
	name: {
		type: String,
		required: false
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
		required: true
	},
	password: {
		type: String,
		required: true
	},
	country: {
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

export default mongoose.model('users', UserSchema);
