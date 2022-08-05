import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    id_service: Number,
    id_professional: Number,
    id_client: Number,
    type_service: String,
    address: String,
    date: Date,
    state: String
});

export default mongoose.model('services', ServiceSchema);