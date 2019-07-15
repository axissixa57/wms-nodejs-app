import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ShipmentSchema = new Schema({
    _id: { type: Number },
    date: { type: Date },
    status: { type: String },
    shipment_date: { type: Date },
    id_warehouse: { type: Number },
    id_consignee: { type: Number },
    products: { type: Array },
    pallet: { type: Number },
    total_weight: { type: Number }
}, { versionKey: false });

export const Shipment = mongoose.model('Shipment', ShipmentSchema);