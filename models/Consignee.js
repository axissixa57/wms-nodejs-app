import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ConsigneeSchema = new Schema({
    _id: { type: Number },
    address: { type: String },
    phone: { type: String },
    products: { type: Array },
}, { versionKey: false });

export const Consignee = mongoose.model('Consignee', ConsigneeSchema);