import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const WarehouseSchema = new Schema(
  {
    _id: { type: Number },
    address: { type: String },
    phone: { type: String },
    products: { type: Array }
  },
  { versionKey: false }
);

export const Warehouse = mongoose.model('Warehouse', WarehouseSchema);
