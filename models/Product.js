import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    _id: { type: Number },
    category: { type: String },
    name: { type: String },
    unit: { type: String },
    weight: { type: Number },
    cost: { type: Number },
}, { versionKey: false });

export const Product = mongoose.model('Product', ProductSchema);