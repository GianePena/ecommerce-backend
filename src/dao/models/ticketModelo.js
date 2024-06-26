import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid'
const ticketCollection = "ticket"

const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
            default: () => uuidv4(),
        },
        purchase_datetime: {
            type: Date,
            default: Date.now,
        },
        amount: {
            type: Number,
            default: 0
        },
        purchaser: {
            type: String
        }
    },
    {
        timestamps: true,
        strict: false
    }
)
export const ticketModelo = mongoose.model(
    ticketCollection,
    ticketSchema
)