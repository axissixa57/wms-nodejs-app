import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ShipmentsToTTNSchema = new Schema({
    _id: { type: Number },
    shipments: { type: Array },
}, { versionKey: false });

export const ShipmentsToTTN = mongoose.model('ShipmentsToTTN', ShipmentsToTTNSchema);