import mongoose from '@src/lib/mongoose'
import { Document, Schema, Types, Model } from 'mongoose'

/**
 * @description ChatMessage interface
 * @interface ChatMessage
 * @property {string} _id Chat message id
 * @property {string} text Chat message content
 * @property {string} authorId The author ID
 * @property {string} authorName The author name
 */
export interface ChatMessageInterface extends Document {
    _id: Types.ObjectId,
    text: string,
    channelId: string,
    authorId: string,
    authorName: string
}

/**
 * @description ChatMessage Schema
 * @constant ChatMessageSchema
 * @type {Schema<ChatMessageInterface}
 * @extends Schema
 * @see https://mongoosejs.com/docs/schematypes.html
 */
const ChatMessageSchema: Schema<ChatMessageInterface> = new Schema<ChatMessageInterface, Model<ChatMessageInterface>>({
    text: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
}, { timestamps: true })

/**
 * @description ChatMessage model
 * @constant ChatMessage
 * @type {Model<ChatMessageInterface>}
 * @extends Model
 * @see https://mongoosejs.com/docs/models.html
 */
const ChatMessage: Model<ChatMessageInterface> = mongoose.models.User || mongoose.model<ChatMessageInterface>('ChatMessage', ChatMessageSchema)

export default ChatMessage
