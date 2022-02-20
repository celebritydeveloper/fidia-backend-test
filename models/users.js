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
	useCase: {
		type: String,
		required: false
	},
	role: {
		type: String,
		required: false
	},
	lastLogin: {
		type: Date,
		require: false
	},
	newUser: {
		type: Boolean,
		default: true
	},
	status: {
		type: String,
		enum: ['activated', 'onboarding', 'deactivated'],
		required: false,
		default: 'onboarding',
	},
	profilePicture: {
		type: String,
		default: '',
		required: false
	},
	address: {
		type: String,
		required: false,
		default: ''
	},
	RESET_TOKEN: {
		type: String,
		required: false
	},
	RESET_TOKEN_TTL: {
		type: Date,
		required: false
	},
	timeCreated: {
		type: Date,
		default: new Date(Date.now())
	},
	timeUpdated: {
		type: Date,
		default: new Date(Date.now())
	}
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
