const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
			
		},
		description: {
			type: String,
			required: true,
			
		},
		category: {
			type: String,
			required: true
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId, //owner pointe vers la collection User
				ref: "User"
			}
		],

		owner: {
			type: mongoose.Schema.Types.ObjectId, 
			ref: "User"
		},

	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Project", projectSchema);
