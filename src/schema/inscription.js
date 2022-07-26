import mongoose from "mongoose";

const Schema = mongoose.Schema;

const InscriptionSchema = new Schema({
    id_inscription: Number,
    id_subject: Number,
    id_student: Number

});

export default mongoose.model('inscription', InscriptionSchema);