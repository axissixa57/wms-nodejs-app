import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TTNSchema = new Schema(
  {
    id_doc: { type: String },
    date: { type: String },
    id_warehouse: { type: Number },
    id_consignee: { type: Number },
    products: { type: Array },
    comment: { type: String },
    car: {
      id_tripTicket: { type: String },
      brand: { type: String },
      stateNumber: { type: String },
      id_driver: { type: String },
      driver: { type: String },
      organization: { type: String }
    },
    total_weight: { type: String },
    total_cost: { type: String },
    code_car: { type: String },
    status: { type: String }
  },
  { versionKey: false }
);

export const TTN = mongoose.model('TTN', TTNSchema);
