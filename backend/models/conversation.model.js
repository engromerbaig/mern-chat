// backend\models\conversation.model.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

// Add a virtual field to calculate the last message timestamp
conversationSchema.virtual('lastMessageTimestamp').get(function() {
    if (this.messages.length > 0) {
        return this.messages[this.messages.length - 1].createdAt; // Last message timestamp
    }
    return null;
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
